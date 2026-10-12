import { type LessonContent } from '../../src/modules/learn/content.schema.js';

export interface LessonSeed {
  slug: string;
  topicSlug: string;
  order: number;
  title: string;
  content: LessonContent;
}

export const stocksLessons: LessonSeed[] = [
  {
    slug: 'what-is-a-stock',
    topicSlug: 'stocks',
    order: 1,
    title: 'What is a Stock?',
    content: {
      hook: {
        emoji: '🍕',
        title: 'Owning a Piece of the Pie',
        question: 'Did you know you can become a part-owner of giants like Tata or Infosys with just ₹500?',
        subtitle: 'Learn how everyday businesses share their ownership.',
      },
      cards: [
        {
          emoji: '🏢',
          title: 'A Slice of Ownership',
          body: 'A stock (or share) represents partial ownership in a real company. When you own a share of Infosys, you own a tiny slice of that business.',
          keyTerms: [
            { term: 'Stock / Share', definition: 'A unit of ownership in a corporation.' },
            { term: 'Shareholder', definition: 'Anyone who owns at least one share in a company.' },
          ],
        },
        {
          emoji: '🚀',
          title: 'Why Companies Issue Shares',
          body: 'Building new factories or tech requires capital. Instead of borrowing from banks at high interest, companies sell shares to the public to raise funds.',
          keyTerms: [
            { term: 'Capital', definition: 'Money used by companies to expand and produce goods.' },
            { term: 'IPO', definition: 'Initial Public Offering: when a company sells shares to the public for the first time.' },
          ],
        },
        {
          emoji: '💵',
          title: 'How You Make Money',
          body: 'You make money when the company grows and share price rises (capital appreciation), or when they distribute profits directly to you as dividends.',
          keyTerms: [
            { term: 'Dividend', definition: 'A cash payout of corporate profits directly to shareholders.' },
            { term: 'Capital Appreciation', definition: 'A rise in the market value of your shares.' },
          ],
        },
      ],
      simulation: {
        type: 'choice_scenario',
        title: 'Chai Startup Challenge',
        intro: 'Rohan runs a popular tea stall in Bengaluru and wants to open 5 new outlets. He offers you a 10% stake for ₹50,000.',
        steps: [
          {
            prompt: 'Step 1: Rohan asks whether you want a fixed loan or an equity share in his business.',
            options: [
              {
                label: 'Take Equity (Shares)',
                outcome: 'Great choice! If Rohan expands across India, your ₹50,000 equity could grow exponentially as business value surges.',
                isGood: true,
              },
              {
                label: 'Give a Fixed Loan',
                outcome: 'Safe, but you only earn fixed interest. You miss out on the immense upside if Rohan becomes a nationwide brand.',
                isGood: false,
              },
            ],
          },
          {
            prompt: 'Step 2: After year 1, profits jump 40%. Rohan asks what to do with the profit.',
            options: [
              {
                label: 'Reinvest in 3 more stalls',
                outcome: 'Smart move! Reinvesting profits fuels faster expansion, making each of your shares significantly more valuable.',
                isGood: true,
              },
              {
                label: 'Withdraw all cash immediately',
                outcome: 'You get quick cash, but stall expansion halts and your company ownership fails to grow in value.',
                isGood: false,
              },
            ],
          },
        ],
      },
      quiz: {
        type: 'mcq',
        question: 'What does owning a share of a publicly listed company actually mean?',
        options: [
          'You are lending money to the government',
          'You own a fractional portion of that business',
          'You become a direct manager of daily operations',
          'You receive a guaranteed monthly salary',
        ],
        correctIndex: 1,
        explanation: 'A share represents fractional ownership of the company, giving you rights to future business growth and potential dividends.',
      },
    },
  },
  {
    slug: 'how-stock-markets-work',
    topicSlug: 'stocks',
    order: 2,
    title: 'How Stock Markets Work',
    content: {
      hook: {
        emoji: '🏛️',
        title: 'The Digital Supermarket',
        question: 'Where do millions of Indians buy and sell shares within milliseconds?',
        subtitle: 'Step inside the National Stock Exchange and BSE.',
      },
      cards: [
        {
          emoji: '🛒',
          title: 'Stock Exchanges',
          body: 'A stock exchange is a regulated digital marketplace connecting buyers and sellers. In India, the two primary exchanges are NSE and BSE.',
          keyTerms: [
            { term: 'NSE', definition: 'National Stock Exchange, India’s largest modern exchange.' },
            { term: 'BSE', definition: 'Bombay Stock Exchange, Asia’s oldest stock exchange.' },
          ],
        },
        {
          emoji: '📱',
          title: 'The Role of Brokers',
          body: 'Individual retail investors cannot trade directly on exchange floors. You place orders through registered brokers like Zerodha, Groww, or banks.',
          keyTerms: [
            { term: 'Stockbroker', definition: 'A licensed intermediary that executes trade orders on exchanges.' },
            { term: 'Demat Account', definition: 'An account holding your securities in electronic dematerialized format.' },
          ],
        },
        {
          emoji: '📊',
          title: 'Market Indices',
          body: 'Instead of tracking thousands of individual stocks, indices like Nifty 50 and Sensex track top companies to show overall market health.',
          keyTerms: [
            { term: 'Nifty 50', definition: 'Benchmark index tracking India’s top 50 large-cap companies.' },
            { term: 'Sensex', definition: 'Benchmark index tracking 30 well-established companies on BSE.' },
          ],
        },
      ],
      simulation: {
        type: 'choice_scenario',
        title: 'Placing Your First Order',
        intro: 'You open your trading app to buy 5 shares of an Indian consumer tech company currently priced at ₹200.',
        steps: [
          {
            prompt: 'Step 1: Choose your order type.',
            options: [
              {
                label: 'Market Order',
                outcome: 'Executed instantly at the best available current market price. Fast, though price can move slightly.',
                isGood: true,
              },
              {
                label: 'Limit Order at ₹190',
                outcome: 'Your order will wait until the price drops to ₹190. If it stays above ₹190, the trade never executes.',
                isGood: false,
              },
            ],
          },
          {
            prompt: 'Step 2: Choose where your electronic shares will be deposited upon settlement.',
            options: [
              {
                label: 'Demat Account',
                outcome: 'Correct! Depositories like CDSL and NSDL hold your electronic shares safely in your Demat account.',
                isGood: true,
              },
              {
                label: 'Physical Paper Vault',
                outcome: 'Incorrect. Physical share certificates have been replaced in India by secure digital Demat accounts.',
                isGood: false,
              },
            ],
          },
        ],
      },
      quiz: {
        type: 'mcq',
        question: 'What does the Nifty 50 index represent?',
        options: [
          'The 50 cheapest penny stocks in India',
          'A benchmark of 50 top-performing, large companies on the NSE',
          'A fixed government savings interest rate',
          'The 50 oldest companies founded in Mumbai',
        ],
        correctIndex: 1,
        explanation: 'Nifty 50 tracks 50 of the largest and most liquid Indian stocks on the National Stock Exchange, reflecting broad market sentiment.',
      },
    },
  },
  {
    slug: 'why-prices-move',
    topicSlug: 'stocks',
    order: 3,
    title: 'Why Prices Move',
    content: {
      hook: {
        emoji: '⚖️',
        title: 'The Battle of Supply and Demand',
        question: 'Why did a stock shoot up 12% today while another plummeted?',
        subtitle: 'Uncover the invisible forces moving prices every second.',
      },
      cards: [
        {
          emoji: '📦',
          title: 'Supply and Demand',
          body: 'Stock prices change due to supply and demand. If more people want to buy a share than sell it, the price rises. When sellers dominate, the price falls.',
          keyTerms: [
            { term: 'Demand', definition: 'The quantity of buyers willing to purchase shares.' },
            { term: 'Supply', definition: 'The quantity of shares that owners are willing to sell.' },
          ],
        },
        {
          emoji: '📰',
          title: 'Earnings and News',
          body: 'Quarterly financial results, product innovations, government policies, and global events heavily influence whether investors feel optimistic or cautious.',
          keyTerms: [
            { term: 'Quarterly Results', definition: 'Financial reports released every 3 months revealing company revenue and profits.' },
          ],
        },
        {
          emoji: '🧠',
          title: 'Market Psychology',
          body: 'Short-term prices are driven by human emotions: fear and greed. Long-term prices always follow the true earnings and fundamentals of the business.',
          keyTerms: [
            { term: 'Bull Market', definition: 'A period of rising stock prices and strong investor confidence.' },
            { term: 'Bear Market', definition: 'A prolonged drop in market prices accompanied by widespread pessimism.' },
          ],
        },
      ],
      simulation: {
        type: 'choice_scenario',
        title: 'Quarterly Results Shock',
        intro: 'A prominent Indian car manufacturer announces that EV battery sales doubled, beating analyst forecasts by 30%.',
        steps: [
          {
            prompt: 'Step 1: How will the stock price likely react right at market open?',
            options: [
              {
                label: 'Jump higher due to strong demand',
                outcome: 'Spot on! Eager buyers flood the order book, driving share prices upward in reaction to stellar earnings.',
                isGood: true,
              },
              {
                label: 'Crash as investors lose interest',
                outcome: 'Unlikely. High profits and surprise growth attract institutional funds, boosting buying pressure.',
                isGood: false,
              },
            ],
          },
          {
            prompt: 'Step 2: Two months later, a brief rumor claims a supplier delay. The stock dips 4%. What is your prudent reaction?',
            options: [
              {
                label: 'Check fundamentals and stay calm',
                outcome: 'Wise! Strong businesses often recover quickly from short-term rumors when long-term cash flow remains solid.',
                isGood: true,
              },
              {
                label: 'Panic sell all your holdings instantly',
                outcome: 'Impulsive selling on unverified noise locks in unnecessary losses.',
                isGood: false,
              },
            ],
          },
        ],
      },
      quiz: {
        type: 'true_false',
        question: 'Over the long term, stock prices primarily reflect a company’s earnings and business growth rather than daily news rumors.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'While short-term prices fluctuate with daily sentiment, long-term share prices closely track underlying corporate revenue and profit growth.',
      },
    },
  },
];
