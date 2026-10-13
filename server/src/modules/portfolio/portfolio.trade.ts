import { AssetType, TransactionSide } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../lib/api-error.js';
import { awardXp } from '../gamification/xp.service.js';
import { evaluateBadges, type EarnedBadgeInfo } from '../gamification/badge.service.js';
import { getPrice, round2 } from './pricing.js';
import { type TradeInput } from './portfolio.schema.js';

export const executeTrade = async (userId: string, input: TradeInput) => {
  const asset = await prisma.asset.findUnique({
    where: { id: input.assetId },
  });

  if (!asset) {
    throw ApiError.notFound('Asset not found', 'ASSET_NOT_FOUND');
  }

  // Validation: integer vs fractional
  if (!asset.allowFractional) {
    if (!Number.isInteger(input.quantity)) {
      throw ApiError.badRequest(
        `Fractional shares are not allowed for ${asset.name}. Quantity must be a whole integer.`,
        'FRACTIONAL_NOT_ALLOWED'
      );
    }
  }

  // Normalize quantity: max 4 decimal places for fractional assets
  const quantity = Math.round(input.quantity * 10000) / 10000;
  if (quantity <= 0) {
    throw ApiError.badRequest('Quantity must be greater than zero', 'INVALID_QUANTITY');
  }

  const currentPrice = getPrice(asset);
  const totalCost = round2(quantity * currentPrice);

  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
    });

    if (input.side === TransactionSide.BUY) {
      if (totalCost < asset.minInvestment) {
        throw ApiError.badRequest(
          `Minimum order value for ${asset.symbol} is ₹${asset.minInvestment}. Current order is ₹${totalCost}.`,
          'BELOW_MIN_INVESTMENT'
        );
      }

      if (user.cashBalance < totalCost) {
        throw ApiError.badRequest(
          `Insufficient funds. You need ₹${totalCost.toLocaleString('en-IN')} but have ₹${user.cashBalance.toLocaleString('en-IN')}.`,
          'INSUFFICIENT_FUNDS'
        );
      }

      // Deduct cash
      await tx.user.update({
        where: { id: userId },
        data: { cashBalance: round2(user.cashBalance - totalCost) },
      });

      // Update or create holding
      const existingHolding = await tx.holding.findUnique({
        where: { userId_assetId: { userId, assetId: asset.id } },
      });

      if (existingHolding) {
        const newQty = Math.round((existingHolding.quantity + quantity) * 10000) / 10000;
        const newAvgBuyPrice = round2(
          (existingHolding.quantity * existingHolding.avgBuyPrice + totalCost) / newQty
        );

        await tx.holding.update({
          where: { id: existingHolding.id },
          data: {
            quantity: newQty,
            avgBuyPrice: newAvgBuyPrice,
          },
        });
      } else {
        await tx.holding.create({
          data: {
            userId,
            assetId: asset.id,
            quantity,
            avgBuyPrice: currentPrice,
          },
        });
      }
    } else {
      // SELL logic
      const existingHolding = await tx.holding.findUnique({
        where: { userId_assetId: { userId, assetId: asset.id } },
      });

      if (!existingHolding || existingHolding.quantity < quantity) {
        const available = existingHolding ? existingHolding.quantity : 0;
        throw ApiError.badRequest(
          `Insufficient holdings. You own ${available} units but tried to sell ${quantity} units.`,
          'INSUFFICIENT_HOLDINGS'
        );
      }

      // Add cash proceeds
      await tx.user.update({
        where: { id: userId },
        data: { cashBalance: round2(user.cashBalance + totalCost) },
      });

      const remainingQty = Math.round((existingHolding.quantity - quantity) * 10000) / 10000;
      if (remainingQty <= 0.0001) {
        await tx.holding.delete({
          where: { id: existingHolding.id },
        });
      } else {
        await tx.holding.update({
          where: { id: existingHolding.id },
          data: { quantity: remainingQty },
        });
      }
    }

    // Record transaction
    const trade = await tx.transaction.create({
      data: {
        userId,
        assetId: asset.id,
        side: input.side,
        quantity,
        price: currentPrice,
        total: totalCost,
      },
      include: {
        asset: {
          select: { id: true, symbol: true, name: true, type: true },
        },
      },
    });

    // Gamification: First Trade XP (+150 XP)
    const xpResult = await awardXp(tx, userId, 'first_investment', 150, 'first_trade');

    // Evaluate badges
    const newBadges: EarnedBadgeInfo[] = await evaluateBadges(tx, userId);

    // Contextual Educational Tip
    let learningTip: string | null = null;
    const userHoldingsCount = await tx.holding.count({
      where: { userId, quantity: { gt: 0 } },
    });

    if (asset.type === AssetType.CRYPTO) {
      learningTip =
        '💡 Crypto is highly volatile. Seasoned investors typically limit speculative crypto to under 10% of their total wealth.';
    } else if (asset.type === AssetType.ETF) {
      learningTip =
        '💡 ETFs give you instant diversification across dozens of companies in a single trade with low fees.';
    } else if (input.side === TransactionSide.BUY && userHoldingsCount <= 2) {
      learningTip =
        '💡 Great start! Spreading your virtual cash across stocks, ETFs, and funds helps protect against single-stock risks.';
    } else if (input.side === TransactionSide.SELL) {
      learningTip =
        '💡 Booking profits or rebalancing is a key investing skill. Your sale proceeds are now back in your virtual cash balance.';
    }

    return {
      trade: {
        id: trade.id,
        side: trade.side,
        quantity: trade.quantity,
        price: trade.price,
        total: trade.total,
        createdAt: trade.createdAt.toISOString(),
        asset: trade.asset,
      },
      xpAwarded: xpResult.xpAwarded,
      newBadges,
      learningTip,
    };
  }, {
    maxWait: 10000,
    timeout: 20000,
  });
};

export const getTransactions = async (
  userId: string,
  options: { type?: AssetType; cursor?: string; limit?: number }
) => {
  const limit = options.limit || 20;

  const whereClause: {
    userId: string;
    asset?: { type: AssetType };
  } = { userId };

  if (options.type) {
    whereClause.asset = { type: options.type };
  }

  const transactions = await prisma.transaction.findMany({
    where: whereClause,
    include: {
      asset: {
        select: { id: true, symbol: true, name: true, type: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    cursor: options.cursor ? { id: options.cursor } : undefined,
    skip: options.cursor ? 1 : 0,
  });

  let nextCursor: string | null = null;
  if (transactions.length > limit) {
    const nextItem = transactions.pop();
    nextCursor = nextItem ? nextItem.id : null;
  }

  return {
    transactions: transactions.map((t) => ({
      id: t.id,
      side: t.side,
      quantity: t.quantity,
      price: t.price,
      total: t.total,
      createdAt: t.createdAt.toISOString(),
      asset: t.asset,
    })),
    nextCursor,
  };
};

export const resetPortfolio = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, lastPortfolioResetAt: true },
  });

  const COOLDOWN_DAYS = 7;
  const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

  if (user.lastPortfolioResetAt) {
    const timeSinceLastReset = Date.now() - new Date(user.lastPortfolioResetAt).getTime();
    if (timeSinceLastReset < COOLDOWN_MS) {
      const nextAllowedDate = new Date(
        new Date(user.lastPortfolioResetAt).getTime() + COOLDOWN_MS
      ).toISOString();

      throw ApiError.badRequest(
        `Portfolio reset is on cooldown. You can reset once every 7 days. Next reset available on ${new Date(
          nextAllowedDate
        ).toLocaleDateString('en-IN')}.`,
        'RESET_COOLDOWN',
        { nextAllowedDate }
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    // Delete all holdings
    await tx.holding.deleteMany({ where: { userId } });

    // Delete all trade transactions
    await tx.transaction.deleteMany({ where: { userId } });

    // Reset cash to ₹10,00,000 and update reset timestamp
    await tx.user.update({
      where: { id: userId },
      data: {
        cashBalance: 1000000.0,
        lastPortfolioResetAt: new Date(),
      },
    });
  }, {
    maxWait: 10000,
    timeout: 20000,
  });

  return {
    message: 'Portfolio successfully reset to ₹10,00,000 virtual cash.',
    cashBalance: 1000000.0,
  };
};
