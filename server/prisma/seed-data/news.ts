import { NewsCategory } from '@prisma/client';

export interface NewsSeed {
  slug: string;
  category: NewsCategory;
  title: string;
  summary: string;
  whatHappened: string;
  whyItMatters: string[];
  keyTakeaway: string;
  readMinutes: number;
  hoursAgo: number; // For spreading over the last 3 days (0 to 72 hours)
  relatedLessonSlug: string;
}

export const newsSeedData: NewsSeed[] = [
  // --- STOCK_MARKET (3 Articles) ---
  {
    slug: 'tech-enterprise-issues-fresh-equity-shares',
    category: NewsCategory.STOCK_MARKET,
    title: 'Technology Firms Weigh Fresh Equity Issuance to Fund Long-Term Growth',
    summary: 'When expanding companies need capital without borrowing from commercial banks, issuing equity shares offers a pathway to raise public funds.',
    whatHappened:
      'Several rapidly expanding enterprise tech software companies have explored issuing fresh equity shares to institutional and retail investors. Rather than taking on high-interest commercial bank debt, companies frequently opt to sell fractional ownership stakes through initial public offerings or follow-on public offers. Market observers note that while this brings in substantial non-repayable capital, it simultaneously dilutes existing shareholders by expanding the total share pool.',
    whyItMatters: [
      'Equity financing does not burden a company with mandatory monthly interest payments or debt servicing costs.',
      'Purchasing shares provides retail investors with proportional claims on potential future company earnings and voting rights.',
      'Existing ownership percentages dilute when new shares are created, meaning profit per share may temporarily spread thinner.',
      'Understanding equity issuance helps investors distinguish between business expansion and balance sheet overleveraging.',
    ],
    keyTakeaway:
      'Buying an equity share makes you a fractional co-owner of a real enterprise, sharing in its long-term fortunes rather than simply lending it money.',
    readMinutes: 3,
    hoursAgo: 2, // 2 hours ago
    relatedLessonSlug: 'what-is-a-stock',
  },
  {
    slug: 'stock-exchanges-transition-to-faster-clearing-cycles',
    category: NewsCategory.STOCK_MARKET,
    title: 'How Stock Exchanges Match Millions of Orders Through Electronic Order Books',
    summary: 'Behind every instantaneous stock trade lies an intricate electronic order matching engine and clearinghouse framework.',
    whatHappened:
      'Modern stock exchanges continuously match bids and offers from millions of individual accounts in fractions of a second. When an investor clicks "Buy", the exchange matching engine scans the central limit order book to locate a matching seller willing to part with shares at that agreed price. Once matched, regulated clearing corporations step in to ensure custody transfer and settlement occur smoothly without default risk.',
    whyItMatters: [
      'Order books provide liquidity by transparently displaying supply and demand across various price points.',
      'Clearing corporations eliminate counterparty risk so buyers receive their securities even if a seller defaults.',
      'Modern automated trade cycles dramatically lower trading fees compared to physical share certificates of past decades.',
      'Market orders execute immediately at prevailing prices, whereas limit orders only execute at your desired threshold.',
    ],
    keyTakeaway:
      'Stock exchanges act as neutral digital meeting places where transparent rule engines match buyers with sellers under strict regulatory protection.',
    readMinutes: 3,
    hoursAgo: 14, // 14 hours ago
    relatedLessonSlug: 'how-stock-markets-work',
  },
  {
    slug: 'market-volatility-spikes-following-macroeconomic-updates',
    category: NewsCategory.STOCK_MARKET,
    title: 'Why Stock Prices Swing When New Economic Information Emerges',
    summary: 'Price fluctuations reflect the collective repricing of future corporate cash flows whenever fresh economic data surprises the market.',
    whatHappened:
      'Broad market indices experienced noticeable volatility this week as unexpected economic growth and inflation figures were published. Financial analysts observed sharp sector divergence: interest-rate-sensitive stocks declined, while export-oriented firms gained strength. Price movement was driven by instantaneous recalibration of discount rates and earnings forecasts by institutional algorithmic models.',
    whyItMatters: [
      'Stock prices are forward-looking mechanisms that price expected future earnings rather than past accomplishments.',
      'Sudden price swings usually stem from the difference between reported numbers and what market participants had previously anticipated.',
      'Short-term price noise is dominated by collective emotional sentiment and liquidity flows rather than fundamental business value changes.',
      'Disciplined investors use volatility to accumulate quality assets rather than panicking over daily paper markdowns.',
    ],
    keyTakeaway:
      'In the short term the market acts as a sentimental voting machine, but over long horizons it behaves as an accurate weighing machine of real profitability.',
    readMinutes: 4,
    hoursAgo: 28, // ~1 day ago
    relatedLessonSlug: 'why-prices-move',
  },

  // --- INVESTING (3 Articles) ---
  {
    slug: 'household-savings-habits-evolve-beyond-traditional-cash',
    category: NewsCategory.INVESTING,
    title: 'Saving vs. Investing: Why Keeping All Your Money in Cash Leaves You Vulnerable',
    summary: 'While bank accounts provide safety for emergency buffers, long-term wealth creation requires allocating capital into productive assets.',
    whatHappened:
      'A recent national consumer survey revealed that many first-time earners hold over seventy percent of their monthly surplus in zero-risk liquid savings accounts. Financial planners pointed out that while emergency funds are vital for sudden life contingencies, keeping long-term wealth solely in cash guarantees purchasing power loss over multi-year horizons due to inflation and taxation.',
    whyItMatters: [
      'Saving preserves nominal capital for predictable short-term needs and emergencies within a six-month window.',
      'Investing deploys surplus money into productive engines like businesses or real estate to outpace inflation.',
      'Holding excess savings in low-interest accounts incurs an invisible opportunity cost that compounds negatively over decades.',
      'A balanced financial plan separates liquid emergency funds from long-duration growth portfolios.',
    ],
    keyTakeaway:
      'Saving defends your present peace of mind with liquidity, but investing builds your future freedom by growing real purchasing power.',
    readMinutes: 3,
    hoursAgo: 6, // 6 hours ago
    relatedLessonSlug: 'saving-vs-investing',
  },
  {
    slug: 'consumer-price-indices-demonstrate-the-invisible-tax-of-inflation',
    category: NewsCategory.INVESTING,
    title: 'Understanding Inflation: How Everyday Price Pressures Quietly Erode Purchasing Power',
    summary: 'Inflation silently decreases what your cash can purchase over time, requiring investments to generate positive real returns.',
    whatHappened:
      'Consumer expenditure reports across urban centers showed gradual price increases across groceries, healthcare, and educational tuition. While salary earners often notice nominal wage increases, financial analysts emphasize calculating "real income"—the actual quantity of goods and services their income can buy after adjusting for the prevailing consumer inflation rate.',
    whyItMatters: [
      'Inflation acts as an invisible deduction that reduces what a fixed unit of currency buys each successive year.',
      'A nominal 6% return on a deposit with 6% annual inflation yields a real return of approximately zero percent.',
      'Essential living expenses tend to inflate faster than generic headline indices, disproportionately affecting young savers.',
      'Equities and productive assets historically deliver real positive returns by allowing businesses to raise prices alongside inflation.',
    ],
    keyTakeaway:
      'Beating inflation is not a luxury for aggressive traders; it is a fundamental survival requirement for any long-term savings plan.',
    readMinutes: 2,
    hoursAgo: 20, // 20 hours ago
    relatedLessonSlug: 'inflation',
  },
  {
    slug: 'the-mathematical-edge-of-starting-your-investment-journey-early',
    category: NewsCategory.INVESTING,
    title: 'The Compound Growth Advantage: Why Time in the Market Beats Timing the Market',
    summary: 'A look at the compounding curve illustrates how reinvested gains generate exponential returns when given enough time.',
    whatHappened:
      'Simulations comparing two fictional investors highlighted that an individual investing modest sums in their early twenties often ends up with significantly larger nest eggs than someone investing triple the amount starting in their late thirties. The deciding factor is the compounding cycle—where returns earn returns on top of previous returns over uninterrupted decades.',
    whyItMatters: [
      'Compounding returns are non-linear; the majority of growth happens in the final chapters of the holding period.',
      'Starting five years earlier requires drastically lower monthly capital commitments to achieve identical retirement goals.',
      'Frequent portfolio trading and premature profit withdrawal reset the compounding clock and incur tax drags.',
      'Consistency and patience remain far more reliable predictors of wealth accumulation than speculative stock picks.',
    ],
    keyTakeaway:
      'Your single greatest financial asset in youth is not high salary or secret market tips—it is the sheer number of compounding years ahead of you.',
    readMinutes: 3,
    hoursAgo: 38, // ~1.5 days ago
    relatedLessonSlug: 'compound-growth',
  },

  // --- TAXES (3 Articles) ---
  {
    slug: 'decoding-employee-salary-slips-and-statutory-deductions',
    category: NewsCategory.TAXES,
    title: 'Demystifying Cost to Company: Why Your In-Hand Salary Differs from CTC',
    summary: 'First-time job seekers often experience surprises on payday; understanding allowances and mandatory deductions clarifies your pay slip.',
    whatHappened:
      'Human resource consultancies reported widespread confusion among early-career professionals regarding the gap between their offered Cost-to-Company (CTC) package and net salary credited to their bank accounts. Mandatory contributions to provident funds, gratuity provisions, professional taxes, and withholding taxes account for the structural difference.',
    whyItMatters: [
      'CTC includes indirect employer costs and long-term retirement benefits that are never paid out as monthly cash.',
      'Basic pay forms the baseline calculation for provident fund contributions and gratuity reserves.',
      'Special allowances are typically fully taxable unless backed by recognized exemption claims.',
      'Budgeting monthly living expenses based on gross CTC rather than actual in-hand salary leads to severe cash flow deficits.',
    ],
    keyTakeaway:
      'Always base your rent and monthly lifestyle budgets on your guaranteed net bank credit, not on the headline CTC written on your offer letter.',
    readMinutes: 3,
    hoursAgo: 10, // 10 hours ago
    relatedLessonSlug: 'understanding-salary',
  },
  {
    slug: 'navigating-gross-income-and-allowable-statutory-deductions',
    category: NewsCategory.TAXES,
    title: 'Gross Income vs. Taxable Net Income: How Tax Calculations Actually Work',
    summary: 'Paying tax only applies to income remaining after statutory deductions, standard exemptions, and eligible tax relief provisions.',
    whatHappened:
      'Tax authorities frequently publish updated guidelines detailing standard deductions and revised slab rates. Financial advisors noted that many taxpayers mistakenly assume their entire earnings are taxed at the highest bracket rate, misunderstanding both the difference between gross versus net income and the tiered nature of progressive taxation slabs.',
    whyItMatters: [
      'Gross income encompasses all incoming receipts before any allowances, exemptions, or expenses are subtracted.',
      'Net taxable income represents the true figure against which applicable tax slab rates are evaluated.',
      'Progressive tax slabs ensure that only earnings within a specific bracket are taxed at that bracket rate, not the entire paycheck.',
      'Proper record-keeping of tax-saving investments ensures you do not inadvertently overpay through withholding taxes.',
    ],
    keyTakeaway:
      'Taxes are evaluated on taxable net income rather than total gross pay, and higher tax slabs only levy their rates on marginal dollars within that tier.',
    readMinutes: 3,
    hoursAgo: 32, // ~1.3 days ago
    relatedLessonSlug: 'gross-vs-net-income',
  },
  {
    slug: 'examining-the-structural-balance-between-direct-and-indirect-taxes',
    category: NewsCategory.TAXES,
    title: 'Direct vs. Indirect Taxes: How Governments Fund Public Infrastructure',
    summary: 'Every citizen contributes to national revenue through direct income taxes and indirect consumption levies on purchases.',
    whatHappened:
      'A parliamentary fiscal briefing highlighted the annual revenue composition derived from direct taxes (corporate and personal income taxes) alongside indirect taxes (goods and services levies). Economists reiterated that while direct taxes apply proportionally based on earning capacity, indirect taxes are paid uniformly by everyone purchasing taxable goods and services.',
    whyItMatters: [
      'Direct taxes are progressive and paid straight to the revenue department based on personal earnings and corporate profits.',
      'Indirect taxes are built into product price tags, collected by merchants, and remitted along supply chains.',
      'Even individuals earning below the taxable income threshold contribute substantially to national development via indirect taxes.',
      'Fiscal policy balances these mechanisms to finance roads, defense, civil healthcare, and public welfare schemes.',
    ],
    keyTakeaway:
      'Even if your income falls below the filing threshold, every retail transaction you complete contributes to public infrastructure through indirect taxation.',
    readMinutes: 4,
    hoursAgo: 50, // ~2 days ago
    relatedLessonSlug: 'direct-and-indirect-taxes',
  },

  // --- CRYPTO (3 Articles) ---
  {
    slug: 'analyzing-the-mechanics-and-speculation-of-digital-currencies',
    category: NewsCategory.CRYPTO,
    title: 'What Is Cryptocurrency? Distinguishing Technology Innovations from Market Hype',
    summary: 'A look into peer-to-peer digital assets reveals novel cryptographic engineering alongside extreme price volatility and regulatory scrutiny.',
    whatHappened:
      'Global tech conferences highlighted increasing experimentation with digital tokens and programmable smart contracts. Financial regulators, however, reminded retail participants that unlike sovereign currencies backed by central banks or corporate equities backed by balance sheet cash flows, the value of cryptocurrencies is driven primarily by speculative supply, demand, and technological adoption.',
    whyItMatters: [
      'Cryptocurrencies operate on decentralized digital ledgers without reliance on a single central bank custodian.',
      'Sovereign legal tender currencies are backed by governments, whereas private tokens have no statutory redemption guarantee.',
      'High price volatility means crypto assets experience rapid capital drawdowns during market risk-off cycles.',
      'Learning the cryptographic architecture is valuable, but speculative token trading demands strict risk boundaries.',
    ],
    keyTakeaway:
      'Cryptocurrencies represent an interesting experiment in cryptographic scarcity, but their lack of intrinsic cash flows makes them highly volatile speculative assets.',
    readMinutes: 3,
    hoursAgo: 4, // 4 hours ago
    relatedLessonSlug: 'what-is-cryptocurrency',
  },
  {
    slug: 'exploring-distributed-ledger-technology-and-consensus-models',
    category: NewsCategory.CRYPTO,
    title: 'Blockchain Basics: How Distributed Ledgers Maintain Trust Without Intermediaries',
    summary: 'Cryptographic hashing and distributed consensus mechanisms allow independent computer nodes to agree on a shared transaction history.',
    whatHappened:
      'Enterprise logistics groups and trade finance institutions conducted pilots demonstrating transparent supply chain tracking using immutable distributed ledgers. Computer scientists explained how cryptographic hashing chains transactional blocks sequentially, making historical records virtually impossible to modify without consensus from network participants.',
    whyItMatters: [
      'A blockchain is an append-only digital database replicated across a decentralized peer-to-peer network.',
      'Cryptographic hashes ensure that altering a single past entry invalidates all subsequent connected blocks.',
      'Consensus algorithms allow independent machines to reach binding agreement without trusting a central administrator.',
      'Blockchain technology has practical applications in supply provenance and identity verification beyond speculative coins.',
    ],
    keyTakeaway:
      'The true innovation of blockchain is mathematical trust—enabling multiple untrusted parties to verify shared state without an intermediary.',
    readMinutes: 3,
    hoursAgo: 24, // 1 day ago
    relatedLessonSlug: 'blockchain-basics',
  },
  {
    slug: 'regulators-highlight-red-flags-in-unregulated-crypto-schemes',
    category: NewsCategory.CRYPTO,
    title: 'Guarding Against Crypto Scams: Identifying Phishing, Rug Pulls, and False Promises',
    summary: 'Irreversible blockchain transfers and pseudonymity make digital token markets prime targets for fraudulent high-yield schemes.',
    whatHappened:
      'Cybersecurity divisions and financial consumer watchdogs issued coordinated advisories cautioning retail users against online groups promising guaranteed daily returns on automated crypto bots. Authorities highlighted that because blockchain transactions cannot be reversed or refunded by a bank manager, victims of fraudulent smart contracts rarely recover lost funds.',
    whyItMatters: [
      'Any platform promising guaranteed fixed returns in crypto is almost certainly fraudulent or operating an unsustainable scheme.',
      'Sharing private keys or seed phrases gives attackers irreversible control over all digital wallet balances.',
      'Unregulated token launches ("rug pulls") frequently see anonymous creators drain liquidity pools overnight.',
      'Unlike insured bank savings accounts, crypto wallets possess zero government deposit insurance or chargeback protection.',
    ],
    keyTakeaway:
      'On a decentralized blockchain, you are your own bank—which means if you sign a malicious contract or give away your keys, no customer support team can reverse the loss.',
    readMinutes: 4,
    hoursAgo: 62, // ~2.5 days ago
    relatedLessonSlug: 'crypto-risks-and-scams',
  },
];
