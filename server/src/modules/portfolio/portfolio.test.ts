import { getPrice, get24hPriceChange, getSeries } from './pricing.js';
import { prisma } from '../../lib/prisma.js';
import { executeTrade, getPortfolioSummary, resetPortfolio, getAssetsWithPrices } from './portfolio.service.js';
import { TransactionSide } from '@prisma/client';

async function runPortfolioTests() {
  console.log('🧪 Starting FinSight Portfolio Engine & Service Tests...');

  // 1. Pricing Engine Determinism & Formula Checks
  console.log('1. Testing Deterministic Pricing Engine...');
  const testAsset = {
    symbol: 'RELIANCE',
    basePrice: 2450.0,
    volatility: 0.08,
  };

  const fixedDate = new Date('2026-10-12T10:00:00.000Z');
  const price1 = getPrice(testAsset, fixedDate);
  const price2 = getPrice(testAsset, fixedDate);

  if (price1 !== price2) {
    throw new Error(`Pricing is not deterministic! price1: ${price1}, price2: ${price2}`);
  }
  console.log(`   ✅ Price is perfectly deterministic: RELIANCE at ${fixedDate.toISOString()} = ₹${price1}`);

  const changeInfo = get24hPriceChange(testAsset, fixedDate);
  if (typeof changeInfo.currentPrice !== 'number' || typeof changeInfo.changePct !== 'number') {
    throw new Error('24h price change returned invalid values');
  }
  console.log(`   ✅ 24h price change computed: Current ₹${changeInfo.currentPrice}, 24h Ago ₹${changeInfo.price24hAgo}, Delta ${changeInfo.changePct}%`);

  const series1D = getSeries(testAsset, '1D', fixedDate);
  if (series1D.length !== 24) {
    throw new Error(`Expected 24 points for 1D, got ${series1D.length}`);
  }
  const series1Y = getSeries(testAsset, '1Y', fixedDate);
  if (series1Y.length !== 52) {
    throw new Error(`Expected 52 points for 1Y, got ${series1Y.length}`);
  }
  console.log('   ✅ Series generation verified: 1D has 24 points, 1Y has 52 points');

  // 2. Test Asset Retrieval with Live Prices
  console.log('2. Testing getAssetsWithPrices...');
  const allAssets = await getAssetsWithPrices();
  if (allAssets.length < 12) {
    throw new Error(`Expected at least 12 seeded assets, got ${allAssets.length}`);
  }
  console.log(`   ✅ Fetched ${allAssets.length} assets with simulated prices`);

  // 3. User Setup for Trading Simulation
  console.log('3. Setting up test user for trading...');
  const testEmail = `trader_${Date.now()}@finsight.local`;
  const user = await prisma.user.create({
    data: {
      email: testEmail,
      passwordHash: 'dummy-hash',
      name: 'Simulated Trader',
      dob: new Date('2000-01-01'),
      cashBalance: 1000000.0,
    },
  });

  try {
    const reliance = allAssets.find((a) => a.symbol === 'RELIANCE')!;
    const nifty = allAssets.find((a) => a.symbol === 'NIFTYBEES')!;

    // 4. Test Buy Integer Validation (Fractional not allowed for Stock)
    console.log('4. Testing integer validation on Stocks...');
    let threwFractional = false;
    try {
      await executeTrade(user.id, {
        assetId: reliance.id,
        side: TransactionSide.BUY,
        quantity: 1.5,
      });
    } catch (err: any) {
      if (err.code === 'FRACTIONAL_NOT_ALLOWED') {
        threwFractional = true;
      }
    }
    if (!threwFractional) {
      throw new Error('Stock buy did not reject fractional quantity');
    }
    console.log('   ✅ Fractional quantity on STOCK correctly rejected');

    // 5. Test Min Investment Validation
    console.log('5. Testing minimum investment validation...');
    let threwMinInvestment = false;
    const doge = allAssets.find((a) => a.symbol === 'DOGE')!;
    try {
      await executeTrade(user.id, {
        assetId: doge.id,
        side: TransactionSide.BUY,
        quantity: 1, // 1 * ~15 = ~15 < 100
      });
    } catch (err: any) {
      if (err.code === 'BELOW_MIN_INVESTMENT') {
        threwMinInvestment = true;
      }
    }
    if (!threwMinInvestment) {
      throw new Error('Buy order below min investment was not rejected');
    }
    console.log('   ✅ Order below min investment correctly rejected');

    // 6. Test Valid Buy Execution & First-Trade XP
    console.log('6. Executing valid BUY trade on RELIANCE...');
    const tradeResult = await executeTrade(user.id, {
      assetId: reliance.id,
      side: TransactionSide.BUY,
      quantity: 5,
    });

    if (tradeResult.xpAwarded !== 150) {
      throw new Error(`Expected 150 first-trade XP, got ${tradeResult.xpAwarded}`);
    }
    console.log(`   ✅ BUY executed: 5 shares of RELIANCE, +${tradeResult.xpAwarded} XP awarded!`);

    // Verify holding created
    let summary = await getPortfolioSummary(user.id);
    const relianceHolding = summary.holdings.find((h) => h.asset.symbol === 'RELIANCE');
    if (!relianceHolding || relianceHolding.quantity !== 5) {
      throw new Error('Holding not created with quantity 5');
    }
    console.log(`   ✅ Holding confirmed: 5 shares at avg price ₹${relianceHolding.avgBuyPrice}`);

    // 7. Test Insufficient Holdings on Sell
    console.log('7. Testing insufficient holdings on SELL...');
    let threwInsHoldings = false;
    try {
      await executeTrade(user.id, {
        assetId: reliance.id,
        side: TransactionSide.SELL,
        quantity: 10,
      });
    } catch (err: any) {
      if (err.code === 'INSUFFICIENT_HOLDINGS') {
        threwInsHoldings = true;
      }
    }
    if (!threwInsHoldings) {
      throw new Error('Over-selling holding was not rejected');
    }
    console.log('   ✅ Selling more shares than held correctly rejected');

    // 8. Test Partial Sell & Full Sell
    console.log('8. Testing partial and full SELL...');
    await executeTrade(user.id, {
      assetId: reliance.id,
      side: TransactionSide.SELL,
      quantity: 2,
    });
    summary = await getPortfolioSummary(user.id);
    const updatedHolding = summary.holdings.find((h) => h.asset.symbol === 'RELIANCE');
    if (!updatedHolding || updatedHolding.quantity !== 3) {
      throw new Error(`Expected 3 shares remaining, got ${updatedHolding?.quantity}`);
    }
    console.log('   ✅ Partial sell executed: 3 shares remaining');

    // Full sell
    await executeTrade(user.id, {
      assetId: reliance.id,
      side: TransactionSide.SELL,
      quantity: 3,
    });
    summary = await getPortfolioSummary(user.id);
    const deletedHolding = summary.holdings.find((h) => h.asset.symbol === 'RELIANCE');
    if (deletedHolding) {
      throw new Error('Holding was not removed after 100% sell');
    }
    console.log('   ✅ 100% sell executed: holding cleanly removed from portfolio');

    // 9. Test Weekly Reset & Cooldown
    console.log('9. Testing Portfolio Reset and 7-day cooldown...');
    // Buy 3 NIFTY shares first
    await executeTrade(user.id, {
      assetId: nifty.id,
      side: TransactionSide.BUY,
      quantity: 3,
    });

    const resetRes = await resetPortfolio(user.id);
    if (resetRes.cashBalance !== 1000000.0) {
      throw new Error('Reset did not restore cash to 1,000,000');
    }

    summary = await getPortfolioSummary(user.id);
    if (summary.holdings.length !== 0) {
      throw new Error('Reset did not clear holdings');
    }
    console.log('   ✅ Reset successful: cash restored to ₹10,00,000, holdings cleared');

    // Attempt second reset immediately (should hit cooldown)
    let threwCooldown = false;
    try {
      await resetPortfolio(user.id);
    } catch (err: any) {
      if (err.code === 'RESET_COOLDOWN') {
        threwCooldown = true;
      }
    }
    if (!threwCooldown) {
      throw new Error('Immediate second reset did not trigger RESET_COOLDOWN');
    }
    console.log('   ✅ Weekly cooldown correctly enforced (RESET_COOLDOWN)');

    console.log('\n🎉 ALL PORTFOLIO BACKEND TESTS PASSED SUCCESSFULLY!\n');
  } finally {
    // Clean up test user
    await prisma.holding.deleteMany({ where: { userId: user.id } });
    await prisma.transaction.deleteMany({ where: { userId: user.id } });
    await prisma.xpEvent.deleteMany({ where: { userId: user.id } });
    await prisma.userBadge.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  }
}

runPortfolioTests()
  .catch((e) => {
    console.error('❌ Test failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
