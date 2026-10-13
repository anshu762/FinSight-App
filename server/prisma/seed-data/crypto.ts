import { type LessonContent } from '../../src/modules/learn/content.schema.js';
import { type LessonSeed } from './stocks.js';

export const cryptoLessons: LessonSeed[] = [
  {
    slug: 'what-is-cryptocurrency',
    topicSlug: 'crypto',
    order: 1,
    title: 'What is Cryptocurrency?',
    content: {
      hook: {
        emoji: '🪙',
        title: 'Money Without a Bank',
        question: 'Can money exist purely as computer code without any central bank or government backing it?',
        subtitle: 'Understand digital tokens and decentralized peer-to-peer networks.',
      },
      cards: [
        {
          emoji: '💻',
          title: 'Digital and Decentralized',
          body: 'Cryptocurrency is digital money secured by cryptography. Unlike traditional Indian Rupees issued by the RBI, most cryptocurrencies operate without any single central authority.',
          keyTerms: [
            { term: 'Cryptocurrency', definition: 'A digital currency secured by cryptography and distributed consensus.' },
            { term: 'Fiat Currency', definition: 'Government-issued currency like the Indian Rupee (INR) or US Dollar.' },
          ],
        },
        {
          emoji: '🤝',
          title: 'Peer-to-Peer Transfers',
          body: 'When you transfer crypto, transactions happen directly between participants across the internet without routing through an intermediary bank or clearing house.',
          keyTerms: [
            { term: 'P2P (Peer-to-Peer)', definition: 'Direct exchange between two parties without intermediaries.' },
            { term: 'Digital Wallet', definition: 'Software that stores private keys used to send and receive digital tokens.' },
          ],
        },
        {
          emoji: '⚖️',
          title: 'Currency or Speculative Asset?',
          body: 'Few businesses in India accept crypto for everyday payments due to price swings. In practice, most people trade it as a high-risk speculative digital asset.',
          keyTerms: [
            { term: 'Speculation', definition: 'Buying assets hoping for quick profit from unpredictable price swings.' },
          ],
        },
      ],
      simulation: {
        type: 'choice_scenario',
        title: 'Cross-Border Transfer Scenario',
        intro: 'You want to send emergency funds to a sibling studying overseas on a Sunday evening.',
        steps: [
          {
            prompt: 'Step 1: Traditional banks are closed for the weekend. What payment rails do you evaluate?',
            hint: 'Regulated channels protect you against permanent loss even if settlement takes slightly longer.',
            options: [
              {
                label: 'A regulated international remittance service or bank wire',
                outcome: 'Secure and legally protected! Even if it processes on Monday, foreign exchange and regulatory compliance are fully guaranteed.',
                isGood: true,
              },
              {
                label: 'An anonymous unregulated crypto transfer to an unverified address',
                outcome: 'Risky! If you make a single typo in the wallet address, the transaction cannot be reversed by any bank or authority.',
                isGood: false,
              },
            ],
          },
          {
            prompt: 'Step 2: You receive an unsolicited link claiming you can convert crypto with 0% tax in India. How do you respond?',
            hint: 'In India, Virtual Digital Assets are subject to mandatory 30% tax and 1% TDS by law.',
            options: [
              {
                label: 'Ignore the link and comply with Indian 30% VDA tax laws',
                outcome: 'Safe and law-abiding! Indian tax law mandates a 30% tax plus 1% TDS on Virtual Digital Asset transfers.',
                isGood: true,
              },
              {
                label: 'Connect your wallet to evade taxes',
                outcome: 'Dangerous! Phishing sites drain wallets instantly, and tax evasion carries severe legal penalties.',
                isGood: false,
              },
            ],
          },
        ],
      },
      quiz: {
        type: 'mcq',
        question: 'What is the primary difference between fiat currency (like Indian Rupees) and cryptocurrencies like Bitcoin?',
        options: [
          'Fiat currency is backed and regulated by a central government or bank',
          'Cryptocurrencies can be printed physically at any neighborhood bank',
          'Fiat currency cannot be transferred electronically',
          'Cryptocurrencies guarantee a fixed 10% annual interest rate',
        ],
        correctIndex: 0,
        explanation: 'Fiat currency is issued and regulated by central banks (like the Reserve Bank of India), whereas decentralized crypto runs on distributed networks without central control.',
      },
    },
  },
  {
    slug: 'blockchain-basics',
    topicSlug: 'crypto',
    order: 2,
    title: 'Blockchain Basics',
    content: {
      hook: {
        emoji: '⛓️',
        title: 'The Unhackable Notebook',
        question: 'Imagine a shared ledger where everyone has a duplicate copy and once a record is written, no one can erase or alter it.',
        subtitle: 'Learn how distributed blocks, cryptographic hashes, and consensus work.',
      },
      cards: [
        {
          emoji: '📦',
          title: 'Blocks Chained Together',
          body: 'A blockchain is an open digital ledger. Transactions are grouped into blocks. Each new block contains cryptographic data linking it tightly to the previous block.',
          keyTerms: [
            { term: 'Block', definition: 'A digital bundle of verified transaction records.' },
            { term: 'Hash', definition: 'A unique digital fingerprint created by a cryptographic algorithm.' },
          ],
        },
        {
          emoji: '🔒',
          title: 'Immutability: No Changing History',
          body: 'Because each block references the fingerprint of the previous one, changing even one digit in an old block invalidates the entire chain across every computer.',
          keyTerms: [
            { term: 'Immutability', definition: 'The inability for recorded data to be modified, edited, or erased.' },
          ],
        },
        {
          emoji: '🌐',
          title: 'Reaching Consensus',
          body: 'Thousands of independent nodes verify every transaction through consensus protocols, ensuring everyone agrees on the exact state of the ledger without a boss.',
          keyTerms: [
            { term: 'Consensus Protocol', definition: 'The mathematical mechanism used by distributed computers to agree.' },
            { term: 'Node', definition: 'An individual computer running the blockchain network software.' },
          ],
        },
      ],
      simulation: {
        type: 'choice_scenario',
        title: 'University Degree Verification Ledger',
        intro: 'A state university wants to eliminate fake degrees using distributed ledger technology.',
        steps: [
          {
            prompt: 'Step 1: An unauthorized hacker tries to alter student grades directly on one single server.',
            hint: 'In a blockchain, thousands of independent nodes check every block hash and reject modifications.',
            options: [
              {
                label: 'Rely on distributed nodes to reject the fraudulent hash',
                outcome: 'Brilliant! Thousands of other validator nodes instantly identify the invalid hash and reject the manipulated record.',
                isGood: true,
              },
              {
                label: 'Trust a single centralized database password',
                outcome: 'Vulnerable! If a central database is breached, the attacker can silently modify marks and issue counterfeit degrees.',
                isGood: false,
              },
            ],
          },
          {
            prompt: 'Step 2: An employer wants to verify a job applicant’s degree credential.',
            hint: 'Cryptographic hashes stored on a decentralized ledger provide tamper-proof public proof.',
            options: [
              {
                label: 'Verify the student certificate hash against the public blockchain',
                outcome: 'Instant proof! The hash confirms the authentic degree was issued by the university without contacting anyone manually.',
                isGood: true,
              },
              {
                label: 'Rely solely on an unverified PDF sent over WhatsApp',
                outcome: 'Insecure! PDFs and scanned papers can be easily doctored with basic graphic editing software.',
                isGood: false,
              },
            ],
          },
        ],
      },
      quiz: {
        type: 'true_false',
        question: 'Once a block is verified and added to a decentralized blockchain, its transaction history can be easily edited by any administrator.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False! Blockchains are immutable. Modifying any block breaks the cryptographic chain and will be rejected by the network nodes.',
      },
    },
  },
  {
    slug: 'crypto-risks-and-scams',
    topicSlug: 'crypto',
    order: 3,
    title: 'Crypto Risks and Scams',
    content: {
      hook: {
        emoji: '🚨',
        title: 'Protecting Your Capital',
        question: 'If someone on Telegram promises guaranteed 20% weekly returns on crypto trading, what is actually happening?',
        subtitle: 'Spot Ponzi schemes, rug pulls, extreme volatility, and fake crypto exchanges.',
      },
      cards: [
        {
          emoji: '🌪️',
          title: 'Extreme Volatility',
          body: 'Crypto values can drop 40% in a single day. Unlike bank deposits, there is no deposit insurance (like DICGC) and no SEBI ombudsman to recover lost funds.',
          keyTerms: [
            { term: 'Volatility Risk', definition: 'Chance of severe, rapid price declines in short periods.' },
          ],
        },
        {
          emoji: '🎣',
          title: 'Common Traps and Scams',
          body: 'Scammers exploit FOMO (fear of missing out). Watch out for fake pump-and-dump groups, bogus initial offerings, and impersonator Telegram "advisors".',
          keyTerms: [
            { term: 'Rug Pull', definition: 'When project creators hype a token, take investor funds, and vanish.' },
            { term: 'Ponzi Scheme', definition: 'Paying early investors with funds collected from newer investors.' },
          ],
        },
        {
          emoji: '🔑',
          title: 'Custody and Security',
          body: 'Never share your seed phrase or private keys with anyone. If you lose your keys or share them, your digital assets are gone permanently.',
          keyTerms: [
            { term: 'Seed Phrase', definition: 'A 12-to-24 word master recovery phrase that grants access to all wallet funds.' },
          ],
        },
      ],
      simulation: {
        type: 'choice_scenario',
        title: 'Spotting The Telegram Crypto Trap',
        intro: 'You receive a direct message from "FinExpert Official" offering an exclusive automated crypto trading pool.',
        steps: [
          {
            prompt: 'Step 1: The DM promises: "Deposit ₹5,000 today, get guaranteed ₹15,000 every Friday. 100% risk-free!" How do you react?',
            hint: 'High guaranteed returns with "zero risk" is the classic signature of an investment scam.',
            options: [
              {
                label: 'Block and report the account as an obvious Ponzi scam',
                outcome: 'Spot on! No legitimate financial investment guarantees high fixed weekly returns. This is classic fraud.',
                isGood: true,
              },
              {
                label: 'Send ₹5,000 to "test" if it works',
                outcome: 'Trapped! They will show fake screenshots of profit, then demand higher deposits to "unlock withdrawals" before disappearing.',
                isGood: false,
              },
            ],
          },
          {
            prompt: 'Step 2: A website asks you to enter your 12-word seed phrase to "claim a ₹10,000 airdrop". What should you do?',
            hint: 'Your 12-word seed phrase gives complete control over your wallet; never share it with anyone or any website.',
            options: [
              {
                label: 'Close the site immediately; never share your seed phrase',
                outcome: 'Crucial save! Legitimate platforms never ask for your private seed phrase. Submitting it empties your entire wallet.',
                isGood: true,
              },
              {
                label: 'Enter the phrase to receive the free coins',
                outcome: 'Devastating! Attackers will drain every token from your wallet within seconds using automated scripts.',
                isGood: false,
              },
            ],
          },
        ],
      },
      quiz: {
        type: 'fill_blank',
        question: 'Any online scheme that promises ___ returns in crypto is almost certainly a scam.',
        options: ['guaranteed', 'volatile', 'variable', 'fluctuating'],
        correctIndex: 0,
        explanation: 'Crypto is inherently unpredictable and volatile. Any promise of guaranteed returns is a hallmark of fraud.',
      },
    },
  },
];
