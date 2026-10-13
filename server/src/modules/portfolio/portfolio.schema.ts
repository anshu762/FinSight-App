import { z } from 'zod';
import { AssetType, TransactionSide } from '@prisma/client';

export const tradeSchema = z.object({
  body: z.object({
    assetId: z.string({ required_error: 'assetId is required' }).min(1, 'assetId cannot be empty'),
    side: z.nativeEnum(TransactionSide, { required_error: 'side must be BUY or SELL' }),
    quantity: z
      .number({ required_error: 'quantity is required' })
      .positive('quantity must be strictly greater than 0'),
  }),
});

export type TradeInput = z.infer<typeof tradeSchema>['body'];

export const assetQuerySchema = z.object({
  query: z.object({
    type: z.nativeEnum(AssetType).optional(),
    q: z.string().optional(),
  }),
});

export const assetDetailQuerySchema = z.object({
  query: z.object({
    period: z.enum(['1D', '1W', '1M', '3M', '1Y']).optional().default('1D'),
  }),
});

export const transactionsQuerySchema = z.object({
  query: z.object({
    type: z.nativeEnum(AssetType).optional(),
    cursor: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  }),
});
