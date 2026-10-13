import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Button, Card } from '../ui';
import { type CalculatorSim as CalculatorSimType } from '../../api/types';
import { useLessonMachine } from '../../features/lesson/lessonMachine';
import {
  calculateCompoundGrowth,
  calculateNetSalary,
  formatIndianCurrency,
} from '../../lib/calculators';
import { CompoundGrowthChart } from './CompoundGrowthChart';
import { SalaryBreakdownCard } from './SalaryBreakdownCard';

export interface CalculatorSimProps {
  simulation: CalculatorSimType;
  topicColor?: string;
  onContinue: () => void;
}

export const CalculatorSim: React.FC<CalculatorSimProps> = ({
  simulation,
  topicColor = '#4F46E5',
  onContinue,
}) => {
  const calculatorInputs = useLessonMachine((s) => s.calculatorInputs);
  const calculatorHasInteracted = useLessonMachine((s) => s.calculatorHasInteracted);
  const setCalculatorInput = useLessonMachine((s) => s.setCalculatorInput);

  const defaultValues: Record<string, number> = {};
  simulation.inputs.forEach((input) => {
    defaultValues[input.key] = input.defaultValue;
  });

  const handleStepChange = (key: string, delta: number, min: number, max: number) => {
    const current = calculatorInputs[key] ?? defaultValues[key] ?? min;
    const next = Math.min(max, Math.max(min, current + delta));
    setCalculatorInput(key, next);
  };

  let compoundResult: ReturnType<typeof calculateCompoundGrowth> | null = null;
  let salaryResult: ReturnType<typeof calculateNetSalary> | null = null;

  if (simulation.kind === 'compound_growth') {
    const monthly =
      calculatorInputs['monthlyInvestment'] ??
      calculatorInputs['monthlyAmount'] ??
      defaultValues['monthlyInvestment'] ??
      3000;
    const rate =
      calculatorInputs['annualReturnRate'] ??
      calculatorInputs['annualRate'] ??
      defaultValues['annualReturnRate'] ??
      12;
    const years =
      calculatorInputs['timeHorizonYears'] ??
      calculatorInputs['years'] ??
      defaultValues['timeHorizonYears'] ??
      15;
    compoundResult = calculateCompoundGrowth({
      monthlyAmount: monthly,
      annualRate: rate,
      years,
    });
  } else if (simulation.kind === 'net_salary') {
    const ctc = calculatorInputs['annualCtc'] ?? defaultValues['annualCtc'] ?? 900000;
    salaryResult = calculateNetSalary({ grossSalary: Math.round(ctc / 12) });
  }

  const formatInputValue = (val: number, prefix?: string, suffix?: string) => {
    if (prefix === '₹') return formatIndianCurrency(val);
    if (prefix) return `${prefix}${val}`;
    if (suffix) return `${val} ${suffix}`;
    return val.toString();
  };

  return (
    <View className="flex-1 justify-between">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24 }}
      >
        <Card className="p-4 bg-surface border-border mb-4">
          <View className="flex-row items-center gap-2 mb-1.5">
            <AppText className="text-xl">🧮</AppText>
            <AppText variant="h3" className="text-lg font-bold text-text">
              {simulation.title}
            </AppText>
          </View>
          <AppText variant="body" className="text-muted text-xs leading-4">
            {simulation.intro}
          </AppText>
        </Card>

        {compoundResult && (
          <CompoundGrowthChart
            totalDeposited={compoundResult.totalInvested}
            totalGrowth={compoundResult.wealthGained}
            futureValue={compoundResult.futureValue}
            years={calculatorInputs['timeHorizonYears'] ?? 15}
          />
        )}

        {salaryResult && (
          <SalaryBreakdownCard
            grossMonthly={salaryResult.grossSalary}
            epfDeduction={salaryResult.epfDeduction}
            taxDeduction={salaryResult.incomeTax}
            inHandMonthly={salaryResult.netSalary}
          />
        )}

        <View className="gap-3 mb-4">
          {simulation.inputs.map((inp) => {
            const val = calculatorInputs[inp.key] ?? defaultValues[inp.key] ?? inp.defaultValue;
            const displayVal = formatInputValue(val, inp.prefix, inp.suffix);

            return (
              <Card key={inp.key} className="p-3 bg-surface border-border">
                <View className="flex-row items-center justify-between mb-2">
                  <AppText variant="caption" className="font-semibold text-text text-xs">
                    {inp.label}
                  </AppText>
                  <AppText variant="caption" className="font-bold text-primary text-xs">
                    {displayVal}
                  </AppText>
                </View>

                <View className="flex-row items-center gap-2">
                  <Pressable
                    onPress={() => handleStepChange(inp.key, -inp.step, inp.min, inp.max)}
                    className="w-10 h-10 rounded-xl bg-slate-100 items-center justify-center active:bg-slate-200"
                    accessibilityLabel={`Decrease ${inp.label}`}
                  >
                    <Ionicons name="remove" size={18} color="#0F172A" />
                  </Pressable>

                  <View className="flex-1 h-10 bg-slate-50 rounded-xl items-center justify-center border border-slate-100">
                    <AppText variant="caption" className="font-bold text-text text-sm">
                      {displayVal}
                    </AppText>
                  </View>

                  <Pressable
                    onPress={() => handleStepChange(inp.key, inp.step, inp.min, inp.max)}
                    className="w-10 h-10 rounded-xl bg-slate-100 items-center justify-center active:bg-slate-200"
                    accessibilityLabel={`Increase ${inp.label}`}
                  >
                    <Ionicons name="add" size={18} color="#0F172A" />
                  </Pressable>
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>

      <View className="p-5 bg-surface border-t border-border">
        <Button
          title={calculatorHasInteracted ? 'Continue to Quiz →' : 'Adjust Any Input to Continue'}
          variant="primary"
          disabled={!calculatorHasInteracted}
          onPress={onContinue}
        />
      </View>
    </View>
  );
};
