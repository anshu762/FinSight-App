# FINSIGHT – PROJECT RULES (READ BEFORE EVERY TASK)

## Product
FinSight is a financial-literacy mobile app for ages 13-25 (India). Users learn through 5-step lessons (Hook, Micro lesson, Simulation, Quiz, Reward), earn XP/levels/badges, practice in a virtual portfolio simulator (Rs 10,00,000 virtual cash), and read finance news with links to related lessons. This is a student MVP: keep it simple, but polished and bug-free. No feature outside the plan.

## Tech stack (do not change, do not add libraries without asking)
- Backend: Node + Express + TypeScript, Prisma 6.x (pin it, do NOT upgrade to Prisma 7), NeonDB PostgreSQL, zod, bcryptjs, jsonwebtoken, helmet, cors, express-rate-limit, dotenv.
- Mobile: Expo + React Native + TypeScript, expo-router, NativeWind v4 + Tailwind CSS 3.4.x, @tanstack/react-query, zustand, axios, react-hook-form + zod, expo-secure-store, react-native-reanimated, react-native-gesture-handler, react-native-safe-area-context, react-native-svg, expo-haptics, @react-native-community/datetimepicker, @react-native-community/netinfo, @expo/vector-icons (Ionicons only).
- Install Expo-related packages ONLY with `npx expo install <pkg>` so versions match the SDK. Run `npx expo-doctor` after installs. Must run in Expo Go (no custom native modules, no dev build).

## Architecture rules
- TypeScript strict. No `any`. No `// @ts-ignore`. No TODO, no lorem ipsum, no dummy data in UI, no console.log left behind.
- Small files: a component/file over ~150 lines must be split. One responsibility per file.
- Mobile layers: screens (app/) are thin and only compose components. UI primitives in src/components/ui. Feature components in src/components/<feature>. Data access only through src/api + react-query hooks in src/hooks. No fetch/axios calls inside components.
- Backend layers: routes -> controller -> service -> prisma. Controllers never contain business logic. All input validated with zod. All responses use the envelope below.
- API envelope: success `{ "success": true, "data": ... }`, failure `{ "success": false, "error": { "code": "STRING", "message": "Human readable", "fields": { "email": "msg" } } }`.
- Money is Float rounded to 2 decimals on the server. Dates in ISO strings. Streak/day logic uses Asia/Kolkata timezone.
- Secrets only in .env. Provide .env.example. Never commit .env.
- Business logic lives ONLY on the server (XP, level, streak, badges, trades). The app displays what the server returns.

## Design tokens (use these only, via tailwind.config.js)
- Primary #4F46E5 (indigo), primary-dark #4338CA, primary-soft #EEF2FF
- Topic colors: stocks #3B82F6, investing #10B981, taxes #F59E0B, crypto #8B5CF6
- Background #F8FAFC, surface #FFFFFF, text #0F172A, muted #64748B, border #E2E8F0
- Success #10B981, danger #EF4444, warning #F59E0B
- Spacing on a 4-point scale (4, 8, 12, 16, 20, 24, 32). Screen horizontal padding 20. Card radius 16, button/input radius 14, chip radius 999.
- Button height 52, input height 52, minimum touch target 44x44.
- Typography (system font): title 28/bold, h2 22/bold, h3 18/semibold, body 16/regular, caption 13/medium. Never go below 13.
- Light theme only (set userInterfaceStyle to "light").

## UI/UX QUALITY GATE (applies to EVERY screen and component)
1. Layout: wrap every screen in the shared Screen component (SafeAreaView, correct top/bottom insets, background). No fixed heights that clip content. Works on a 360x640 phone and a large phone. Long text wraps or truncates with numberOfLines; nothing overflows or overlaps. Test with large system font size.
2. Alignment: buttons in a row have equal height and consistent gaps; text and icons are vertically centered; consistent paddings from the token scale. Primary actions are full-width at the bottom of the content with safe-area padding.
3. Touch: every tappable thing is a Pressable with visible pressed feedback (opacity or scale via Reanimated), 44x44 minimum hit area (use hitSlop for small icons), light haptic on important taps, disabled state styled, loading state with spinner, and double-tap protection (ignore taps while a request/navigation is running).
4. Keyboard: every screen with inputs uses the shared KeyboardScreen component (KeyboardAvoidingView + ScrollView, keyboardShouldPersistTaps="handled", keyboardDismissMode="on-drag", extra bottom padding). The focused input and the submit button are NEVER hidden by the keyboard on iOS or Android. Inputs have correct keyboardType, returnKeyType (next/done), autoCapitalize, autoComplete/textContentType, and "next" moves focus to the next input; "done" submits.
5. Data screens must have all four states, built with shared components: loading (skeleton, not a lone spinner), empty (icon + message + action), error (message + Retry button), success. Lists support pull-to-refresh. Show an OfflineBanner when there is no connection. Network errors show a friendly message, never raw error text.
6. Forms: validate on blur and on submit with zod; inline error text under the field in danger color; disable the submit button while submitting; map server field errors to the matching inputs; password show/hide toggle; trim emails.
7. Navigation: Android hardware back works everywhere; no way to go back to auth screens after login or back to the app after logout; leaving a lesson asks for confirmation; no duplicate screens from rapid taps; headers have a visible 44x44 back button; deep screens never show a blank flash.
8. Bottom tab bar (4 tabs: Home, Learn, Portfolio, News): custom tab buttons that feel like a real app: icon swaps outline/filled, active label + active color, small scale animation + light haptic on press, active indicator, safe-area bottom padding, height ~64 plus inset, no layout jump, tab state is preserved when switching, tapping the active tab scrolls its list to top. Tab bar hides while the keyboard is open.
9. Animations: 150-300ms, use Reanimated, never block taps, respect that the UI must still be usable if animation fails.
10. Accessibility: accessibilityLabel on icon-only buttons, color contrast AA, no information by color alone.
11. Never leave a screen "coming soon". Every visible button must do something real.

## BACKEND QUALITY GATE
- Every endpoint: auth (where needed), zod validation, correct HTTP status codes (400/401/403/404/409/422/500), consistent envelope, no stack traces to client.
- Idempotent rewards: XP can never be granted twice for the same action (unique refKey per user).
- Use prisma transactions for multi-step writes (trades, lesson completion).
- Rate-limit auth routes. Passwords hashed with bcryptjs (cost 10). JWT expiry 7 days.
- Provide a `requests.http` file (or curl list) to test every endpoint.

## WORKFLOW RULES FOR THE AGENT
- Work only on the current phase. Do not start the next phase.
- First print a short plan (file list). Then implement. Create files one by one; do not paste giant files.
- After finishing: run `npx tsc --noEmit` (and lint if configured) in the changed project and fix all errors.
- End with: (1) files created/changed, (2) commands to run, (3) "Your test checklist" for the user to verify on a real phone, (4) anything you could not finish (be honest).