import {
  calculateCompoundGrowth,
  calculateNetSalary,
  formatIndianCurrency,
} from './calculators';

describe('Financial Calculators', () => {
  describe('calculateCompoundGrowth', () => {
    it('calculates compound growth correctly for 10 years at 12% with ₹3,000 monthly SIP', () => {
      const result = calculateCompoundGrowth({
        monthlyAmount: 3000,
        years: 10,
        annualRate: 12,
      });

      expect(result.totalInvested).toBe(360000);
      expect(result.futureValue).toBeGreaterThan(690000);
      expect(result.wealthGained).toBe(result.futureValue - result.totalInvested);
    });

    it('handles 0% annual rate safely', () => {
      const result = calculateCompoundGrowth({
        monthlyAmount: 1000,
        years: 5,
        annualRate: 0,
      });

      expect(result.totalInvested).toBe(60000);
      expect(result.futureValue).toBe(60000);
      expect(result.wealthGained).toBe(0);
    });
  });

  describe('calculateNetSalary', () => {
    it('calculates net salary for ₹50,000 monthly gross under standard parameters', () => {
      const result = calculateNetSalary({
        grossSalary: 50000,
        basicPercent: 50,
        professionalTax: 200,
      });

      expect(result.grossSalary).toBe(50000);
      expect(result.basicSalary).toBe(25000); // 50%
      expect(result.epfDeduction).toBe(3000); // 12% of 25,000
      expect(result.professionalTax).toBe(200);
      expect(result.incomeTax).toBe(0); // Under ₹7L annualized
      expect(result.totalDeductions).toBe(3200);
      expect(result.netSalary).toBe(46800);
    });

    it('respects manual monthly TDS override', () => {
      const result = calculateNetSalary({
        grossSalary: 100000,
        basicPercent: 50,
        monthlyTds: 5000,
      });

      expect(result.basicSalary).toBe(50000);
      expect(result.epfDeduction).toBe(6000);
      expect(result.incomeTax).toBe(5000);
      expect(result.professionalTax).toBe(200);
      expect(result.totalDeductions).toBe(11200);
      expect(result.netSalary).toBe(88800);
    });
  });

  describe('formatIndianCurrency', () => {
    it('formats Indian numbering properly', () => {
      expect(formatIndianCurrency(500)).toBe('₹500');
      expect(formatIndianCurrency(5000)).toBe('₹5,000');
      expect(formatIndianCurrency(50000)).toBe('₹50,000');
      expect(formatIndianCurrency(150000)).toBe('₹1,50,000');
      expect(formatIndianCurrency(1000000)).toBe('₹10,00,000');
      expect(formatIndianCurrency(12345678)).toBe('₹1,23,45,678');
    });

    it('handles negative and 0 values safely', () => {
      expect(formatIndianCurrency(0)).toBe('₹0');
      expect(formatIndianCurrency(-5000)).toBe('-₹5,000');
    });
  });
});
