import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card, Button } from '../ui';
import { type AssetItem, type UserAssetHolding, type TransactionSide } from '../../api/types';
import { formatIndianCurrency, round2 } from '../../lib/calculators';

interface TradeOrderFormProps {
  asset: AssetItem;
  userHolding?: UserAssetHolding | null;

  cash: number;
  initialSide?: TransactionSide;
  isSubmitting: boolean;
  onSubmit: (side: TransactionSide, quantity: number) => void;
  serverError: string | null;
  onClearServerError: () => void;
}

export const TradeOrderForm: React.FC<TradeOrderFormProps> = ({
  asset,
  userHolding,
  cash,
  initialSide = 'BUY',
  isSubmitting,
  onSubmit,
  serverError,
  onClearServerError,
}) => {
  const [side, setSide] = useState<TransactionSide>(initialSide);
  const [quantityStr, setQuantityStr] = useState('');
  const currentPrice = asset.currentPrice;

  const numericQty = parseFloat(quantityStr) || 0;
  const liveTotal = round2(numericQty * currentPrice);

  let validationError: string | null = null;
  if (quantityStr.trim().length > 0) {
    if (numericQty <= 0) {
      validationError = 'Please enter a positive quantity.';
    } else if (!asset.allowFractional && !Number.isInteger(numericQty)) {
      validationError = `Fractional shares not allowed for ${asset.symbol}. Enter whole units.`;
    } else if (side === 'BUY') {
      if (liveTotal < asset.minInvestment) {
        validationError = `Minimum order amount is ${formatIndianCurrency(asset.minInvestment)}.`;
      } else if (liveTotal > cash) {
        validationError = `Insufficient cash. Order is ${formatIndianCurrency(liveTotal)}, but balance is ${formatIndianCurrency(cash)}.`;
      }
    } else if (side === 'SELL') {
      const owned = userHolding?.quantity ?? 0;
      if (numericQty > owned) {
        validationError = `Insufficient holdings. You only own ${owned} units.`;
      }
    }
  }

  const isFormValid = numericQty > 0 && validationError === null;

  const handleMaxPress = () => {
    if (side === 'BUY') {
      if (!asset.allowFractional) {
        const maxUnits = Math.floor(cash / currentPrice);
        setQuantityStr(maxUnits.toString());
      } else {
        const maxUnits = Math.floor((cash / currentPrice) * 10000) / 10000;
        setQuantityStr(maxUnits.toString());
      }
    } else {
      const owned = userHolding?.quantity ?? 0;
      setQuantityStr(owned.toString());
    }
    onClearServerError();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Buy / Sell Toggle */}
        <View className="flex-row bg-slate-100 p-1 rounded-2xl mb-4 border border-border">
          <Pressable
            onPress={() => {
              setSide('BUY');
              onClearServerError();
            }}
            className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
              side === 'BUY' ? 'bg-primary shadow-sm' : 'active:opacity-75'
            }`}
          >
            <AppText
              variant="body"
              className={`font-bold text-sm ${side === 'BUY' ? 'text-white' : 'text-slate-600'}`}
            >
              Buy {asset.symbol}
            </AppText>
          </Pressable>

          <Pressable
            onPress={() => {
              setSide('SELL');
              onClearServerError();
            }}
            className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
              side === 'SELL' ? 'bg-primary shadow-sm' : 'active:opacity-75'
            }`}
          >
            <AppText
              variant="body"
              className={`font-bold text-sm ${side === 'SELL' ? 'text-white' : 'text-slate-600'}`}
            >
              Sell {asset.symbol}
            </AppText>
          </Pressable>
        </View>

        {/* Market Price & Available */}
        <Card className="p-4 bg-surface border-border mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <View>
              <AppText variant="caption" className="text-muted text-xs">Market Price (LTP)</AppText>
              <AppText variant="h3" className="text-text font-black text-lg">
                {formatIndianCurrency(currentPrice)}
              </AppText>
            </View>

            <View className="items-end">
              <AppText variant="caption" className="text-muted text-xs">
                {side === 'BUY' ? 'Available Cash' : 'Available to Sell'}
              </AppText>
              <AppText variant="body" className="font-bold text-text text-sm">
                {side === 'BUY' ? formatIndianCurrency(cash) : `${userHolding?.quantity || 0} units`}
              </AppText>
            </View>
          </View>

          {asset.minInvestment > 0 && side === 'BUY' ? (
            <AppText variant="caption" className="text-slate-400 text-[11px]">
              Min order: {formatIndianCurrency(asset.minInvestment)} •{' '}
              {asset.allowFractional ? 'Fractional permitted' : 'Whole shares only'}
            </AppText>
          ) : null}
        </Card>

        {/* Quantity Input */}
        <Card className="p-4 bg-surface border-border mb-4">
          <View className="flex-row justify-between items-center mb-1.5">
            <AppText variant="caption" className="font-bold text-slate-700 text-xs">
              Number of Units / Shares
            </AppText>

            <Pressable
              onPress={handleMaxPress}
              className="bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200 active:bg-indigo-100"
            >
              <AppText variant="caption" className="font-bold text-primary text-xs">
                Max
              </AppText>
            </Pressable>
          </View>

          <View className="flex-row items-center bg-slate-100 rounded-input px-3.5 h-[52px] border border-border">
            <TextInput
              value={quantityStr}
              onChangeText={(val) => {
                setQuantityStr(val);
                onClearServerError();
              }}
              placeholder={asset.allowFractional ? '0.00' : '0'}
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              className="flex-1 text-lg font-bold text-text"
              autoFocus
            />
            <AppText variant="caption" className="text-slate-500 font-bold ml-2">
              UNITS
            </AppText>
          </View>

          {validationError ? (
            <AppText variant="caption" className="text-rose-600 text-xs mt-2 font-medium">
              {validationError}
            </AppText>
          ) : null}
        </Card>

        {/* Order Summary */}
        <Card className="p-4 bg-indigo-50/50 border-indigo-200 mb-5">
          <AppText variant="caption" className="font-bold text-primary uppercase text-xs mb-3 tracking-wider">
            Order Summary
          </AppText>

          <View className="gap-2 mb-2">
            <View className="flex-row justify-between items-center">
              <AppText variant="caption" className="text-slate-600">Estimated Total</AppText>
              <AppText variant="body" className="font-extrabold text-text text-base">
                {formatIndianCurrency(liveTotal)}
              </AppText>
            </View>

            <View className="flex-row justify-between items-center">
              <AppText variant="caption" className="text-slate-600">Estimated Balance After Trade</AppText>
              <AppText variant="caption" className="font-bold text-slate-700">
                {side === 'BUY'
                  ? formatIndianCurrency(Math.max(0, cash - liveTotal))
                  : formatIndianCurrency(cash + liveTotal)}
              </AppText>
            </View>
          </View>
        </Card>

        {serverError ? (
          <View className="bg-rose-50 border border-rose-300 rounded-xl p-3.5 mb-4 flex-row items-center gap-2">
            <Ionicons name="alert-circle" size={18} color="#E11D48" />
            <AppText variant="caption" className="text-rose-900 font-medium text-xs flex-1">
              {serverError}
            </AppText>
          </View>
        ) : null}

        <Button
          title={`Confirm ${side} Order`}
          variant="primary"
          loading={isSubmitting}
          disabled={!isFormValid || isSubmitting}
          onPress={() => onSubmit(side, numericQty)}
          className="w-full"
        />

        <View className="items-center py-4">
          <AppText variant="caption" className="text-slate-400 text-[11px] text-center italic">
            Simulated prices for learning. Not real market data.
          </AppText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
