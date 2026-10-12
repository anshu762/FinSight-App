import { type LessonContent } from '../../src/modules/learn/content.schema.js';
import { type LessonSeed } from './stocks.js';

export const investingLessons: LessonSeed[] = [
  {
    slug: 'saving-vs-investing',
    topicSlug: 'investing',
    order: 1,
    title: 'Saving vs Investing',
    content: {
      hook: {
        emoji: '🌱',
        title: 'Making Money Work For You',
        question: 'If you save ₹2,000 every month in a piggy bank for 10 years, will it make you rich?',
        subtitle: 'Understand the critical difference between saving cash and growing wealth.',
      },
      cards: [
        {
          emoji: '🏦',
          title: 'Saving: Preserving Capital',
          body: 'Saving means parking money safely in bank accounts or fixed deposits. It provides security and quick liquidity, but returns barely match price rises.',
          keyTerms: [
            { term: 'Liquidity', definition: 'How easily an asset can be converted into cash without loss.' },
            { term: 'Fixed Deposit (FD)', definition: 'A bank deposit offering a fixed interest rate for a lock-in period.' },
          ],
        },
        {
          emoji: '📈',
          title: 'Investing: Building Wealth',
          body: 'Investing buys productive assets like shares, mutual funds, or real estate. Your money actively compounds, giving you potential for higher long-term wealth.',
          keyTerms: [
            { term: 'Mutual Fund', definition: 'A pool of money from many investors managed by professional fund managers.' },
            { term: 'Index Fund', definition: 'A low-cost fund tracking benchmarks like the Nifty 50.' },
          ],
        },
        {
          emoji: '⚖️',
          title: 'The Risk-Return Balance',
          body: 'Higher potential returns always carry short-term fluctuations. Young investors have time on their side to endure volatility and reap substantial compounding.',
          keyTerms: [
            { term: 'Volatility', definition: 'Short-term ups and downs in market value.' },
          ],
        },
      ],
      simulation: {
        type: 'calculator',
        title: 'Wealth Growth Simulator',
        intro: 'Compare how monthly savings in a low-interest account compare against a diversified equity index fund over time.',
        kind: 'compound_growth',
        inputs: [
          {
            key: 'monthlyInvestment',
            label: 'Monthly SIP Amount',
            min: 500,
            max: 25000,
            step: 500,
            defaultValue: 3000,
            prefix: '₹',
          },
          {
            key: 'annualReturnRate',
            label: 'Expected Annual Return',
            min: 4,
            max: 18,
            step: 0.5,
            defaultValue: 12,
            suffix: '%',
          },
          {
            key: 'years',
            label: 'Time Horizon',
            min: 1,
            max: 30,
            step: 1,
            defaultValue: 10,
            suffix: ' yrs',
          },
        ],
      },
      quiz: {
        type: 'mcq',
        question: 'Why is keeping all your long-term money in a standard savings account risky?',
        options: [
          'Banks frequently lose customer deposits',
          'Inflation gradually erodes the real purchasing power of idle cash',
          'You are prohibited from withdrawing savings before retirement',
          'Savings accounts charge high management fees every month',
        ],
        correctIndex: 1,
        explanation: 'While savings accounts offer safety, their interest rarely beats inflation, meaning your idle money actually loses purchasing power over time.',
      },
    },
  },
  {
    slug: 'inflation',
    topicSlug: 'investing',
    order: 2,
    title: 'Inflation: The Silent Thief',
    content: {
      hook: {
        emoji: '📉',
        title: 'The Shrinking Rupee',
        question: 'Why did a movie ticket cost ₹50 fifteen years ago, but costs ₹300 today?',
        subtitle: 'Uncover why prices continually rise and how to protect your future.',
      },
      cards: [
        {
          emoji: '🛒',
          title: 'What Is Inflation?',
          body: 'Inflation measures the rate at which general prices of goods and services rise. When inflation hits 6%, your basket of groceries costs 6% more next year.',
          keyTerms: [
            { term: 'Inflation', definition: 'The gradual increase in prices and fall in purchasing value of money.' },
            { term: 'Purchasing Power', definition: 'The quantity of goods or services one unit of money can buy.' },
          ],
        },
        {
          emoji: '🔥',
          title: 'The Real Return Concept',
          body: 'If your bank FD gives 6% interest and inflation is 5.5%, your real post-tax gain is near zero. To truly grow wealth, your investments must beat inflation.',
          keyTerms: [
            { term: 'Real Return', definition: 'Nominal investment return minus the rate of inflation.' },
          ],
        },
        {
          emoji: '🛡️',
          title: 'Beating The Price Surge',
          body: 'Equities and diversified index funds historically outpace consumer inflation across long horizons by participating directly in economic and corporate growth.',
          keyTerms: [
            { term: 'Inflation Hedge', definition: 'An investment that protects against declining purchasing power.' },
          ],
        },
      ],
      simulation: {
        type: 'choice_scenario',
        title: 'College Fund Inflation Battle',
        intro: 'You inherit ₹1,00,000 for your higher studies planned 5 years from now. Inflation is averaging 6% per annum.',
        steps: [
          {
            prompt: 'Step 1: Where will you keep your ₹1,00,000 for the next 5 years?',
            options: [
              {
                label: 'Cash in a home locker',
                outcome: 'Catastrophic! With 6% inflation, your ₹1,00,000 loses over 26% of purchasing power. College fees will outstrip your cash.',
                isGood: false,
              },
              {
                label: 'A balanced portfolio beating inflation',
                outcome: 'Smart move! Earning an 8-11% average return beats 6% inflation, preserving and expanding your real college fund.',
                isGood: true,
              },
            ],
          },
          {
            prompt: 'Step 2: A friend advises you to buy high-risk speculative crypto to "triple" the fund in 2 weeks.',
            options: [
              {
                label: 'Reject speculation and stick to your plan',
                outcome: 'Wise discipline! For goals within 5 years, gambling your education fund on extreme speculation exposes you to total capital loss.',
                isGood: true,
              },
              {
                label: 'Bet the entire fund on the tip',
                outcome: 'Disaster! High volatility could wipe out 50% of your money in days, leaving you unable to pay tuition.',
                isGood: false,
              },
            ],
          },
        ],
      },
      quiz: {
        type: 'fill_blank',
        question: 'If your investment makes 9% return and inflation is 6%, your real return is ___%.',
        options: ['3', '15', '0', '6'],
        correctIndex: 0,
        explanation: 'Real return = Nominal Return (9%) - Inflation (6%) = 3%. This is the true increase in your purchasing power.',
      },
    },
  },
  {
    slug: 'compound-growth',
    topicSlug: 'investing',
    order: 3,
    title: 'Compound Growth: The 8th Wonder',
    content: {
      hook: {
        emoji: '🚀',
        title: 'The Compounding Flywheel',
        question: 'Would you rather have ₹1 crore today, or a magical ₹1 coin that doubles every day for 30 days?',
        subtitle: 'Discover how patience and exponential math turn small savings into millions.',
      },
      cards: [
        {
          emoji: '❄️',
          title: 'The Snowball Effect',
          body: 'Simple interest only pays on your principal. Compound interest earns interest on your interest, creating an exponential snowball effect as time passes.',
          keyTerms: [
            { term: 'Principal', definition: 'The original sum of money lent or invested.' },
            { term: 'Compound Interest', definition: 'Interest calculated on both initial principal and accumulated interest.' },
          ],
        },
        {
          emoji: '⏳',
          title: 'Time Is Your Superpower',
          body: 'Starting early matters far more than starting big. Investing ₹2,000 a month starting at 18 yields more by 50 than starting with ₹6,000 a month at 30.',
          keyTerms: [
            { term: 'SIP', definition: 'Systematic Investment Plan: investing a fixed sum regularly into funds.' },
          ],
        },
        {
          emoji: '🎯',
          title: 'The Rule of 72',
          body: 'Divide 72 by your expected annual return rate to estimate how many years it takes to double your money. At 12% return, your capital doubles every 6 years!',
          keyTerms: [
            { term: 'Rule of 72', definition: 'A shortcut mental math formula: Years to double = 72 / Return %.' },
          ],
        },
      ],
      simulation: {
        type: 'calculator',
        title: 'Early Starter vs Late Starter',
        intro: 'See firsthand the immense leverage of starting an investment SIP early in your career.',
        kind: 'compound_growth',
        inputs: [
          {
            key: 'monthlyInvestment',
            label: 'Monthly SIP',
            min: 1000,
            max: 50000,
            step: 1000,
            defaultValue: 5000,
            prefix: '₹',
          },
          {
            key: 'annualReturnRate',
            label: 'Estimated Nifty 50 Return',
            min: 6,
            max: 16,
            step: 0.5,
            defaultValue: 12,
            suffix: '%',
          },
          {
            key: 'years',
            label: 'Years Invested',
            min: 5,
            max: 35,
            step: 1,
            defaultValue: 20,
            suffix: ' yrs',
          },
        ],
      },
      quiz: {
        type: 'true_false',
        question: 'According to the Rule of 72, an investment growing at 12% per year will double in approximately 6 years.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! 72 divided by 12 equals 6 years. With consistent compounding, your wealth doubles every 6 years.',
      },
    },
  },
];
