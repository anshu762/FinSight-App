import { type LessonContent } from '../../src/modules/learn/content.schema.js';
import { type LessonSeed } from './stocks.js';

export const taxesLessons: LessonSeed[] = [
  {
    slug: 'understanding-salary',
    topicSlug: 'taxes',
    order: 1,
    title: 'Understanding Salary',
    content: {
      hook: {
        emoji: '💼',
        title: 'Your First Paycheck Surprise',
        question: 'If your offer letter says ₹6,00,000 CTC, will you actually receive ₹50,000 in your bank account every month?',
        subtitle: 'Learn how CTC breaks down into basic pay, allowances, and mandatory deductions.',
      },
      cards: [
        {
          emoji: '📜',
          title: 'CTC vs Take-Home',
          body: 'CTC (Cost to Company) is the total amount an employer spends on you each year. Your actual in-hand salary is always lower due to taxes and retirement savings.',
          keyTerms: [
            { term: 'CTC', definition: 'Cost to Company: total annual expense incurred by company on an employee.' },
            { term: 'In-Hand Salary', definition: 'The actual net amount credited to your bank account every month.' },
          ],
        },
        {
          emoji: '🏦',
          title: 'The Core Components',
          body: 'Your salary consists of Basic Pay (the taxable core), House Rent Allowance (HRA), Special Allowance, and employer contributions to your Provident Fund.',
          keyTerms: [
            { term: 'Basic Pay', definition: 'The fixed base salary component, typically 40-50% of CTC.' },
            { term: 'HRA', definition: 'House Rent Allowance provided to help meet rent expenses.' },
          ],
        },
        {
          emoji: '🛡️',
          title: 'EPF: Forced Savings',
          body: '12% of your basic pay is deducted each month for Employee Provident Fund (EPF), matched equally by your employer. It builds a tax-free retirement corpus.',
          keyTerms: [
            { term: 'EPF', definition: 'Employee Provident Fund: government retirement savings scheme overseen by EPFO.' },
          ],
        },
      ],
      simulation: {
        type: 'calculator',
        title: 'CTC to Monthly In-Hand Calculator',
        intro: 'Estimate your monthly bank credit after mandatory EPF and professional tax deductions.',
        kind: 'net_salary',
        inputs: [
          {
            key: 'annualCtc',
            label: 'Annual CTC',
            min: 250000,
            max: 2000000,
            step: 25000,
            defaultValue: 600000,
            prefix: '₹',
          },
          {
            key: 'basicPercent',
            label: 'Basic Pay Ratio',
            min: 30,
            max: 60,
            step: 5,
            defaultValue: 40,
            suffix: '%',
          },
          {
            key: 'deductions',
            label: 'Monthly EPF + Professional Tax',
            min: 1500,
            max: 10000,
            step: 500,
            defaultValue: 2600,
            prefix: '₹',
          },
        ],
      },
      quiz: {
        type: 'mcq',
        question: 'Why is your monthly in-hand salary usually lower than your CTC divided by 12?',
        options: [
          'Companies retain 30% of your earnings as a security deposit',
          'Mandatory deductions like EPF, taxes, and insurance reduce take-home pay',
          'Banks deduct substantial transaction fees on direct salary credits',
          'Only executive leaders are eligible to receive 100% of their CTC',
        ],
        correctIndex: 1,
        explanation: 'CTC includes total employer costs such as employer EPF contributions, bonuses, and gratuity, while deductions like employee EPF and TDS reduce in-hand salary.',
      },
    },
  },
  {
    slug: 'gross-vs-net-income',
    topicSlug: 'taxes',
    order: 2,
    title: 'Gross vs Net Income',
    content: {
      hook: {
        emoji: '🧾',
        title: 'Where Did The Money Go?',
        question: 'Why does your payslip show two very different figures: Gross Pay and Net Pay?',
        subtitle: 'Master payslip deductions, Professional Tax, and Income Tax TDS.',
      },
      cards: [
        {
          emoji: '📊',
          title: 'Gross Income Defined',
          body: 'Gross income is your total earnings before any deductions or taxes. It adds together your basic pay, HRA, bonuses, and all monthly cash allowances.',
          keyTerms: [
            { term: 'Gross Income', definition: 'Total compensation earned prior to any statutory or voluntary deductions.' },
          ],
        },
        {
          emoji: '✂️',
          title: 'Net Income (Take-Home)',
          body: 'Net income is what actually arrives in your bank account. Net = Gross Income minus statutory deductions (EPF, Professional Tax, and TDS income tax).',
          keyTerms: [
            { term: 'Net Income', definition: 'Your take-home pay after all tax and retirement deductions.' },
            { term: 'Professional Tax', definition: 'A state-level tax on salaried individuals (usually up to ₹200/month in India).' },
          ],
        },
        {
          emoji: '🏛️',
          title: 'TDS: Tax Deducted at Source',
          body: 'Employers deduct estimated income tax in advance each month from your salary and deposit it with the government under your PAN. This is TDS.',
          keyTerms: [
            { term: 'TDS', definition: 'Tax Deducted at Source: advance tax deducted directly by the payer.' },
            { term: 'Form 16', definition: 'Annual certificate from your employer showing total salary paid and TDS deducted.' },
          ],
        },
      ],
      simulation: {
        type: 'calculator',
        title: 'Gross to Net Pay Breakdown',
        intro: 'Calculate how monthly TDS and statutory deductions impact your monthly bank transfer.',
        kind: 'net_salary',
        inputs: [
          {
            key: 'grossSalary',
            label: 'Monthly Gross Salary',
            min: 25000,
            max: 200000,
            step: 5000,
            defaultValue: 55000,
            prefix: '₹',
          },
          {
            key: 'monthlyEpf',
            label: 'Monthly EPF Deduction',
            min: 1800,
            max: 12000,
            step: 200,
            defaultValue: 2400,
            prefix: '₹',
          },
          {
            key: 'monthlyTds',
            label: 'Estimated Monthly TDS',
            min: 0,
            max: 30000,
            step: 500,
            defaultValue: 3500,
            prefix: '₹',
          },
        ],
      },
      quiz: {
        type: 'fill_blank',
        question: 'Net Income is calculated as Gross Income minus ___ (such as EPF, Professional Tax, and TDS).',
        options: ['Deductions', 'Allowances', 'Profits', 'Dividends'],
        correctIndex: 0,
        explanation: 'Net Income = Gross Income - Deductions. Deductions include taxes, provident fund contributions, and insurance.',
      },
    },
  },
  {
    slug: 'direct-and-indirect-taxes',
    topicSlug: 'taxes',
    order: 3,
    title: 'Direct and Indirect Taxes',
    content: {
      hook: {
        emoji: '🏛️',
        title: 'Taxes on What You Earn vs Spend',
        question: 'Did you know you pay taxes to the government even if you do not have a salary?',
        subtitle: 'Explore the difference between Income Tax and GST in India.',
      },
      cards: [
        {
          emoji: '🎯',
          title: 'Direct Taxes: On What You Earn',
          body: 'Direct taxes are paid directly by the individual to the government based on income or wealth. Income tax and capital gains tax are key examples.',
          keyTerms: [
            { term: 'Direct Tax', definition: 'A tax levied directly on personal or corporate income, non-transferable to others.' },
            { term: 'Income Tax Slab', definition: 'Progressive tax rates where higher income brackets pay higher percentages.' },
          ],
        },
        {
          emoji: '🛒',
          title: 'Indirect Taxes: On What You Spend',
          body: 'Indirect taxes are collected by sellers on goods and services, then paid to the government. Every time you buy a phone or burger, you pay GST.',
          keyTerms: [
            { term: 'GST', definition: 'Goods and Services Tax: a unified indirect tax across India.' },
            { term: 'GST Slabs', definition: 'Standard tax rates (e.g. 5%, 12%, 18%, 28%) applied based on category.' },
          ],
        },
        {
          emoji: '🛣️',
          title: 'Where Does Tax Money Go?',
          body: 'Taxes fund roads, railways, airports, national defense, healthcare, and education. Paying taxes is your civic contribution to building national infrastructure.',
          keyTerms: [
            { term: 'Public Goods', definition: 'Infrastructure and services provided to all citizens without exclusion.' },
          ],
        },
      ],
      simulation: {
        type: 'choice_scenario',
        title: 'Café Bill Tax Audit',
        intro: 'You and your friends dine at a restaurant in Mumbai. The food total is ₹1,000. The bill lists extra charges.',
        steps: [
          {
            prompt: 'Step 1: The restaurant adds 5% GST (2.5% CGST + 2.5% SGST) and an optional 10% Service Charge. What do you do?',
            options: [
              {
                label: 'Pay GST; request removal of mandatory Service Charge',
                outcome: 'Legally accurate! GST is a mandatory government tax, but service charges are voluntary tips per consumer guidelines.',
                isGood: true,
              },
              {
                label: 'Refuse to pay GST to save money',
                outcome: 'Incorrect! Businesses are legally obligated to charge and remit GST on commercial food sales.',
                isGood: false,
              },
            ],
          },
          {
            prompt: 'Step 2: You receive your year-end bank statement showing ₹40,000 in FD interest. The bank did not deduct TDS. What is your duty?',
            options: [
              {
                label: 'Report FD interest on your annual ITR and pay applicable tax',
                outcome: 'Excellent! All income must be declared accurately on your Income Tax Return (ITR) to maintain financial compliance.',
                isGood: true,
              },
              {
                label: 'Ignore it because the bank did not deduct TDS',
                outcome: 'Risky! Undisclosed bank interest can trigger tax notices, penalties, and interest charges from the Income Tax Department.',
                isGood: false,
              },
            ],
          },
        ],
      },
      quiz: {
        type: 'true_false',
        question: 'Goods and Services Tax (GST) is an example of a direct tax because you pay it directly to the Income Tax Department.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False! GST is an indirect tax collected by merchants on goods and services, not paid directly as an income tax.',
      },
    },
  },
];
