# FinSight — Comprehensive QA & Test Runbook

This runbook covers end-to-end verification of FinSight (Backend: Node.js/Express/Prisma/PostgreSQL; Mobile: React Native/Expo SDK 52).

---

## 1. Quality Gates & Architecture Audit

| Audit Area | Criteria | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Strict TypeScript** | `tsc --noEmit` / `npm run build` zero errors | ✅ Passed | Zero errors in mobile and server |
| **Expo Health** | `npx expo-doctor` | ✅ Passed | 18/18 checks clean |
| **Console Logs** | No stray `console.log` | ✅ Passed | Cleaned from application files |
| **File Length** | Every file ~150 lines or modularized | ✅ Passed | Extracted subcomponents for all complex screens |
| **Design System** | Clean light theme, indigo branding `#4F46E5` | ✅ Passed | Token-compliant typography & spacing |
| **Double Padding** | No nested `px-5` + `contentContainerStyle` | ✅ Passed | `paddingHorizontal={false}` on Screen when list pads |

---

## 2. Screen-by-Screen UI & Layout Audit

| # | Screen | Key Elements Verified | Small Screen (360×640) & Scaling | Status |
|---|---|---|---|---|
| 1 | **Welcome** (`(auth)/welcome.tsx`) | Logo glyph, hero tagline, 3 value props, Login & Register CTAs | ScrollView ensures no overflow on small viewports | ✅ Pass |
| 2 | **Login** (`(auth)/login.tsx`) | Email, password visibility toggle, double-tap prevention, keyboard dismiss | KeyboardAvoidingView handles IME smoothly | ✅ Pass |
| 3 | **Register** (`(auth)/register.tsx`) | Name, email, DOB picker, password checklist (8+ chars, upper, lower, number, special) | Live validator updates in real time without jank | ✅ Pass |
| 4 | **Age Group** (`(auth)/age-group.tsx`) | 4 age stage cards with emojis, descriptions, auto-select based on DOB | Single-choice list with checkmark indicators | ✅ Pass |
| 5 | **Home** (`(tabs)/home.tsx`) | Avatar header, streak flame, continue card, stats row, badges, topics 2x2, news card, portfolio card | Zero double-padding; bottom padding 110px prevents tab bar overlap | ✅ Pass |
| 6 | **Learn** (`(tabs)/learn.tsx`) | 4 topic cards with progress bars and lock badges, track descriptions | Pull-to-refresh, smooth scroll, clean headers | ✅ Pass |
| 7 | **Topic Detail** (`topic/[slug].tsx`) | Hero gradient header, back button, lesson timeline with connector lines (completed, available, locked) | Locked lessons show prerequisite toast | ✅ Pass |
| 8 | **Lesson Step 1: Hook** (`lesson/[id].tsx`) | Big emoji, provocative question, context card, Continue CTA | Clean card padding, hardware back button confirmation dialog | ✅ Pass |
| 9 | **Lesson Step 2: Content Cards** | Swiper with indicator dots, bite-sized financial cards, Next/Back | Smooth horizontal swipe, indicator dots | ✅ Pass |
| 10 | **Lesson Step 3: Simulation** | Choice scenario cards or interactive calculator (SIP / Net Salary) | Live dynamic recalculations, interactive step buttons | ✅ Pass |
| 11 | **Lesson Step 4: Quiz** | MCQ / True-False / Fill-in-the-blank options, hint button, submit lock | First try +100 XP, second try +50 XP, hint penalty -10 XP | ✅ Pass |
| 12 | **Lesson Step 5: Reward** | XP breakdown receipt, animated celebration, badge unlocks, level-up modal | Claim / Continue to Next Lesson CTA | ✅ Pass |
| 13 | **Badges** (`badges.tsx`) | Collection progress bar, 3-column category grid, badge detail modal sheet | Normalized categories (`learn`, `streak`, `portfolio`, `news`) | ✅ Pass |
| 14 | **Profile** (`profile.tsx`) | User avatar, level, streak, learning stage card, Edit Stage sheet, Log out | Modals use ModalSheet, confirm logout dialog | ✅ Pass |
| 15 | **Portfolio Tab** (`(tabs)/portfolio.tsx`) | Total net worth, 24h P&L, best/worst performer chips, allocation bar, holdings list, Reset portfolio | Empty state when 0 holdings with "Explore Instruments" CTA | ✅ Pass |
| 16 | **Explore Assets** (`portfolio/explore.tsx`) | Search input, asset filter chips (All, Stocks, ETFs, Mutual Funds, Crypto), price cards | Fast client filtering + debounce search | ✅ Pass |
| 17 | **Asset Detail** (`portfolio/[id].tsx`) | Sparkline chart (1D, 1W, 1M, 1Y), holding position, specifications, Buy/Sell CTAs | Sell button disabled when 0 shares owned | ✅ Pass |
| 18 | **Trade Order** (`portfolio/trade.tsx`) | Buy/Sell toggle, LTP, cash balance, Max button, real-time total, execution receipt | Insufficient cash / whole shares validation, receipt modal | ✅ Pass |
| 19 | **Trade History** (`portfolio/history.tsx`) | Categorized date grouping, Buy/Sell indicators, units, execution prices | Empty state with shortcut to Explore | ✅ Pass |
| 20 | **News Hub** (`(tabs)/news.tsx`) | Category chips, educational badge, article cards with read indicators, pull-to-refresh | Infinite pagination, 100px bottom safe inset | ✅ Pass |
| 21 | **Article Reader** (`news/[id].tsx`) | Category tag, headline, What happened, Why it matters bullets, Related lesson card, Takeaway | 5-second dwell auto-triggers +25 XP read reward | ✅ Pass |

---

## 3. State Audit Matrix

Every data-driven screen in FinSight adheres to the 5 standard states:

| Screen | Loading (Skeleton) | Empty State | Error State (with Retry) | Pull to Refresh | Offline Banner / 401 |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Home** | ✅ Card skeletons | N/A (Always shows seed topics) | ✅ ErrorState + Retry | ✅ Integrated | ✅ 401 clears auth, redirect to Welcome |
| **Learn** | ✅ 4 Card skeletons | N/A | ✅ ErrorState + Retry | ✅ Integrated | ✅ Offline alert on network drop |
| **Topic Detail** | ✅ Timeline skeletons | N/A | ✅ ErrorState + Retry | ✅ Integrated | ✅ Handled |
| **Lesson Screen**| ✅ Full skeleton | N/A | ✅ ErrorState + Retry | N/A (Flow step) | ✅ Handled |
| **Badges** | ✅ Grid skeletons | ✅ 0 badges unlocked | ✅ ErrorState + Retry | ✅ Integrated | ✅ Handled |
| **Portfolio Tab**| ✅ Metric skeletons | ✅ Zero holdings prompt | ✅ ErrorState + Retry | ✅ Integrated | ✅ Handled |
| **Explore Assets**| ✅ Asset row skeletons| ✅ "No matching assets" | ✅ ErrorState + Retry | ✅ Integrated | ✅ Handled |
| **Asset Detail** | ✅ Chart skeleton | ✅ "No position owned" | ✅ "Asset not found" | ✅ Integrated | ✅ Handled |
| **Trade History**| ✅ Row skeletons | ✅ "No trades executed" | ✅ ErrorState + Retry | ✅ Integrated | ✅ Handled |
| **News Tab** | ✅ Card skeletons | ✅ "No articles in category"| ✅ ErrorState + Retry | ✅ Integrated | ✅ Handled |
| **Article Screen**| ✅ Content skeleton | N/A | ✅ "Article not found" | N/A | ✅ Handled |

---

## 4. End-to-End Flow Scenarios

### Flow 1: New User Onboarding & First Lesson
1. Launch app -> Tap **Get Started** on Welcome screen.
2. Fill Register form: Name "Aarav Sharma", Email "aarav@example.com", DOB (pick 2005-06-15), Password `Password@123`.
   - *Verification*: Password checklist shows all 4 checkmarks in green.
3. Tap **Create Account**. User is navigated to Age Group selection screen with **Young Adult (19–21 yrs)** pre-selected.
4. Tap **Confirm & Start Learning**. User lands on Home Tab.
5. Tap **Continue Learning** or open Learn tab -> Topic 1: **Stock Market Basics** -> Lesson 1: **What is a Share?**.
6. Step 1 (Hook): Read question -> Tap **Begin Lesson**.
7. Step 2 (Cards): Swipe through 3 cards -> Tap **Start Simulation**.
8. Step 3 (Simulation): Tap options -> See immediate contextual feedback -> Tap **Proceed to Quiz**.
9. Step 4 (Quiz): Select correct answer on first try -> Tap **Submit Answer**.
10. Step 5 (Reward):
    - *Verification*: +350 XP awarded, Level 2 Level-Up Modal appears.
    - Badges unlocked: "First Steps" (Micro Lesson completion).
11. Tap **Claim Rewards**. User is returned to Topic page; Lesson 2 is now unlocked!

### Flow 2: Portfolio Trading & Reset
1. Open Portfolio Tab. Initial virtual cash: **₹10,00,000**.
2. Tap **Explore Instruments** -> Select **RELIANCE** (Stock).
3. Tap **Buy** -> On Trade screen:
   - Type quantity `10`. Verify estimated total and post-trade cash balance update in real time.
   - Tap **Confirm Buy Order**.
   - *Verification*: Order receipt confirms instant execution, +150 XP awarded (First Trade bonus), "First Trade" badge unlocked.
4. Tap **View Portfolio**.
   - *Verification*: Reliance appears in Holdings list, Asset Allocation bar reflects Equity vs Cash.
5. Tap on **RELIANCE** holding -> Tap **Sell** -> Tap **Max** -> Tap **Confirm Sell Order**.
   - *Verification*: All units sold, cash balance restored to ₹10,00,000.
6. Tap **Reset Portfolio** in actions bar -> Confirm dialog warning appears.
   - Tap **Confirm Reset** -> Toast confirms reset; 7-day cooldown timer starts.

### Flow 3: News Hub Reading & Daily XP Cap
1. Open News Tab.
2. Select category chip **Stock Market**.
3. Tap on article: *"Understanding Market Corrections: Why Stocks Pull Back"*.
4. Read through headline, "What happened?", "Why it matters", and "Key Takeaway".
5. Wait 5 seconds on screen or scroll to end.
   - *Verification*: Screen triggers read event -> XP toast "+25 XP earned!" appears.
   - "Related Lesson" card links to "Market Trends & Indexes".
6. Repeat reading 5 articles in the same calendar day.
   - *Verification*: After 5 reads (125 XP cap), subsequent reads complete silently without server errors.

### Flow 4: Error Handling & Negative Test Cases
1. **Network Disconnected**: Turn on Airplane mode -> Pull to refresh on News.
   - *Verification*: Offline banner / friendly ErrorState appears with working "Retry" button.
2. **Expired / Invalid Token**: Simulate 401 response -> App automatically clears stored token and returns to Welcome screen.
3. **Invalid Asset ID in Route**: Deep link to `/portfolio/invalid-id-999`.
   - *Verification*: Shows "Instrument Not Found" ErrorState with a back button to safety.
4. **Android Hardware Back**: Press Android Back button on Lesson Step 3.
   - *Verification*: ConfirmDialog prompts "Exit Lesson? Your progress in this lesson will be lost" with Cancel and Exit options.
