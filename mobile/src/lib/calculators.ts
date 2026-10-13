export interface CompoundGrowthInput {
  monthlyAmount: number;
  years: number;
  annualRate: number; // In percentage, e.g. 12 for 12%
}

export interface CompoundGrowthResult {
  totalInvested: number;
  wealthGained: number;
  futureValue: number;
}

export interface NetSalaryInput {
  grossSalary: number; // Monthly gross in INR
  basicPercent?: number; // e.g. 50 for 50%
  professionalTax?: number; // default 200
  monthlyTds?: number; // optional manual TDS override
}

export interface NetSalaryResult {
  grossSalary: number;
  basicSalary: number;
  epfDeduction: number;
  professionalTax: number;
  incomeTax: number;
  totalDeductions: number;
  netSalary: number;
}

export function round2(num: number): number {
  return Math.round(num * 100) / 100;
}

/**
 * Pure calculator for SIP Compound Growth.
 * Calculates invested amount, future value, and wealth gained using monthly annuity-due compounding.
 */
export function calculateCompoundGrowth(input: CompoundGrowthInput): CompoundGrowthResult {
  const { monthlyAmount, years, annualRate } = input;
  const safeMonthly = Math.max(0, monthlyAmount);
  const safeYears = Math.max(1, years);
  const safeRate = Math.max(0, annualRate);

  const months = safeYears * 12;
  const totalInvested = Math.round(safeMonthly * months);

  if (safeRate === 0) {
    return {
      totalInvested,
      wealthGained: 0,
      futureValue: totalInvested,
    };
  }

  const monthlyRate = safeRate / 100 / 12;
  // SIP Annuity Due formula: P * [((1 + r)^n - 1) / r] * (1 + r)
  const compoundMultiplier = Math.pow(1 + monthlyRate, months);
  const fv = safeMonthly * ((compoundMultiplier - 1) / monthlyRate) * (1 + monthlyRate);
  const futureValue = Math.round(fv);
  const wealthGained = Math.max(0, futureValue - totalInvested);

  return {
    totalInvested,
    wealthGained,
    futureValue,
  };
}

/**
 * Pure calculator for Net Monthly Salary.
 * Assumes basic = 50% of gross (unless specified), EPF = 12% of basic,
 * professional tax = ₹200, and a simplified income tax illustration.
 */
export function calculateNetSalary(input: NetSalaryInput): NetSalaryResult {
  const grossSalary = Math.max(0, Math.round(input.grossSalary));
  const basicRatio = (input.basicPercent ?? 50) / 100;
  const basicSalary = Math.round(grossSalary * basicRatio);

  // Employee Provident Fund: 12% of Basic
  const epfDeduction = Math.round(basicSalary * 0.12);

  // Professional Tax: standard ₹200/month
  const professionalTax = input.professionalTax !== undefined ? input.professionalTax : 200;

  let incomeTax = 0;
  if (input.monthlyTds !== undefined) {
    incomeTax = Math.max(0, Math.round(input.monthlyTds));
  } else {
    // Simplified Indian tax illustration (annualized)
    const annualGross = grossSalary * 12;
    // Standard rebate applies if annual gross <= 7,00,000 (tax = 0)
    if (annualGross > 700000) {
      const taxable = Math.max(0, annualGross - 75000); // Standard deduction of 75k
      let annualTax = 0;
      if (taxable > 300000) {
        const slab1 = Math.min(taxable - 300000, 300000);
        annualTax += slab1 * 0.05;
      }
      if (taxable > 600000) {
        const slab2 = Math.min(taxable - 600000, 300000);
        annualTax += slab2 * 0.1;
      }
      if (taxable > 900000) {
        const slab3 = Math.min(taxable - 900000, 300000);
        annualTax += slab3 * 0.15;
      }
      if (taxable > 1200000) {
        const slab4 = Math.min(taxable - 1200000, 300000);
        annualTax += slab4 * 0.2;
      }
      if (taxable > 1500000) {
        const slab5 = taxable - 1500000;
        annualTax += slab5 * 0.3;
      }
      // Add 4% Health & Education cess
      annualTax = annualTax * 1.04;
      incomeTax = Math.round(annualTax / 12);
    }
  }

  const totalDeductions = epfDeduction + professionalTax + incomeTax;
  const netSalary = Math.max(0, grossSalary - totalDeductions);

  return {
    grossSalary,
    basicSalary,
    epfDeduction,
    professionalTax,
    incomeTax,
    totalDeductions,
    netSalary,
  };
}

/**
 * Formats an amount into the Indian Numbering System (e.g. ₹1,50,000).
 */
export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) return '₹0';
  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const absStr = Math.abs(rounded).toString();

  if (absStr.length <= 3) {
    return `${isNegative ? '-' : ''}₹${absStr}`;
  }

  const lastThree = absStr.substring(absStr.length - 3);
  const otherNumbers = absStr.substring(0, absStr.length - 3);
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return `${isNegative ? '-' : ''}₹${formattedOther},${lastThree}`;
}
