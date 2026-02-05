# 🔄 JOYCOIN SYSTEM FLOW - What Happens Behind the Scenes

## USER JOURNEY & JOYCOIN INTERACTIONS

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        WEBSITE USER JOURNEY                              │
└─────────────────────────────────────────────────────────────────────────┘

[1] HOMEPAGE
    ↓
    🔵 3 colored dots animation (1.8s)
    ↓ fades away
    ↓
    Shows "Happiness" title + buttons
    ↓
    User clicks "Login/Join"

[2] LOGIN MODAL
    ↓
    User enters: admin@happiness.com / password123
    ↓
    Clicks LOGIN button
    ↓
    ✅ FIX #1: Token is set in cookie (not auth_token) ✅
    ↓

[3] API: POST /api/auth/login
    ├─ Receives: email + password
    ├─ Validates against mockData users
    ├─ ✅ FIX #4: Generates token with userId embedded ✅
    ├─ Sets HTTP cookie: 'token' = "eyJ..."
    └─ Returns:
        {
          "user": { name, email, role, joyCoins: 250 },
          "token": "eyJ...",
          "expiresAt": 1707123456
        }

[4] MIDDLEWARE
    ↓
    Checks for 'token' cookie ✅ (FIX #1)
    ↓
    Token found → Allow access
    ↓
    Redirect to /dashboard

[5] DASHBOARD LOADS
    ↓
    Components mount and fetch data
    ├─ GET /api/analytics
    ├─ GET /api/workshops
    └─ JoyCoinWallet component mounts
        └─ Calls GET /api/joycoins/wallet
            ↓
            ✅ FIX #2/#3: Uses authService.getCurrentUser() ✅
            ↓
            Decodes token (embedded userId)
            ↓
            Finds user in mockData
            ↓
            Returns:
            {
              "balance": 250,
              "transactions": [],
              "total": 0
            }

[6] JOYCOINS DISPLAYED
    ↓
    UI Shows:
    ┌─────────────────────────┐
    │   💰 JoyCoin Wallet     │
    │   Balance: 250 coins    │
    │   Earned: 0             │
    │   Transactions: 0       │
    └─────────────────────────┘

[7] USER INTERACTS
    ├─ Browse workshops → Shows coin rewards per workshop
    ├─ View certificates → Shows "+10 coins" next to each
    ├─ Check my bookings → Can see workshop values
    └─ Logout → Token cookie deleted
        ↓
        ✅ Returns to homepage
        ↓
        Can login as different user
        (Different balance appears)
```

---

## JOYCOINS DATA FLOW

```
                    MOCK DATA
                    (mockData.ts)
                         ↓
            ┌────────────────────┐
            │ 11 Users with:     │
            ├────────────────────┤
            │ user1: joyCoins: 250│
            │ user2: joyCoins: 420│
            │ user3: joyCoins: 160│
            │ ... (8 more users)  │
            └────────────────────┘
                      ↓
            (Queried by authService)
                      ↓
        ┌─────────────────────────┐
        │  API Routes             │
        ├─────────────────────────┤
        │ /api/joycoins/wallet    │
        │ • Fetches user data     │
        │ • Returns balance       │
        │ • Returns transactions  │
        └─────────────────────────┘
                      ↓
        ┌─────────────────────────┐
        │  JoyCoinWallet.tsx      │
        │  React Component        │
        ├─────────────────────────┤
        │ • Fetches data          │
        │ • Displays balance      │
        │ • Shows transaction UI  │
        └─────────────────────────┘
                      ↓
        ┌─────────────────────────┐
        │  BROWSER DISPLAY        │
        ├─────────────────────────┤
        │  💰 250 coins           │
        │  Transaction history    │
        │  Ways to earn coins     │
        └─────────────────────────┘
```

---

## TOKEN FLOW (WITH OUR FIXES)

```
┌────────────────────────────────────────────────────────────────┐
│              FIX #1: CORRECT TOKEN NAMING                      │
└────────────────────────────────────────────────────────────────┘

Login Response:
  response.cookies.set('token', session.token, {
    maxAge: 86400000,      // 24 hours
    httpOnly: false,
    sameSite: 'lax',
    secure: false
  })

Middleware Check:
  ❌ OLD: const token = request.cookies.get('auth_token')
  ✅ NEW: const token = request.cookies.get('token')

Why This Matters:
  • Cookie name must match across all files
  • Login sets 'token'
  • Middleware must check 'token'
  • Prevents authentication failures

┌────────────────────────────────────────────────────────────────┐
│         FIX #2 & #3: CONSISTENT JWT PARSING                   │
└────────────────────────────────────────────────────────────────┘

❌ OLD (join/route.ts):
  const payload = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString()
  );
  const user = users.find((u) => u.email === payload.email);
  // Problem: payload.email doesn't exist in token!

✅ NEW (all endpoints):
  const user = await authService.getCurrentUser(token);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

Why This Works:
  • authService centralizes token parsing
  • Handles token payload with embedded userId
  • Consistent across all endpoints
  • Cleaner, less error-prone code

┌────────────────────────────────────────────────────────────────┐
│         FIX #4: TOKEN INCLUDES USERID                          │
└────────────────────────────────────────────────────────────────┘

Token Payload Structure:
  {
    "userId": "user1",    // ← Embedded for lookup
    "iat": 1707123456,
    "exp": 1707209856
  }

Why This Matters:
  • Can find user from token alone
  • Survives hot reload (in-memory loss)
  • Fallback in case tokenStore is cleared
  • Works across server restarts
```

---

## AUTHENTICATION FLOW WITH COOKIE

```
[1] USER LOGIN
    ↓
    POST /api/auth/login
    { email, password }
    ↓

[2] SERVER RESPONSE
    ├─ Status: 200
    ├─ Body: { user, token, expiresAt }
    └─ Headers: Set-Cookie: token=eyJ...
                  ^
              (HTTP Header automatically sent)
    ↓

[3] BROWSER RECEIVES
    ├─ Parses JSON: Gets user data + token string
    └─ Stores cookie: token=eyJ... (automatic!)
       └─ httpOnly: false → Accessible to JS
       └─ maxAge: 24hrs → Expires tomorrow
       └─ sameSite: lax → Sent on same-site requests
    ↓

[4] NEXT REQUEST (GET /api/joycoins/wallet)
    ├─ Browser sends request
    ├─ Automatically includes cookies in request
    └─ Server receives:
        {
          Cookies: {
            "token": "eyJ..."
          }
        }
    ↓

[5] SERVER VALIDATES
    ├─ Reads token from cookies
    ├─ Uses authService.getCurrentUser(token)
    ├─ Finds user from token
    └─ Returns user's JoyCoin balance
    ↓

[6] RESPONSE SENT TO BROWSER
    └─ { balance: 250, transactions: [], total: 0 }
```

---

## WHAT HAPPENS ON EACH PAGE

### Homepage (/):
```
No auth needed
├─ Shows animation
├─ Shows login button
└─ No API calls
```

### Login Modal:
```
POST /api/auth/login
├─ Validates credentials
├─ Generates token with userId
├─ Sets cookie
└─ Returns user data
```

### Dashboard (/dashboard):
```
Middleware checks: Is token in cookies?
├─ Yes → Allow access
└─ No → Redirect to home

Once loaded:
├─ GET /api/analytics
├─ GET /api/workshops  
├─ GET /api/joycoins/wallet ← Uses token cookie
└─ Displays everything
```

### Other Dashboard Pages (My Bookings, Certificates, etc):
```
Middleware check (same as dashboard)
├─ Token required
└─ All fetch requests include token automatically
```

### After Logout:
```
Removes token cookie
├─ Next request: No token
├─ Middleware check fails
└─ Redirect to home
```

---

## SEQUENCE DIAGRAM

```
User                Browser             Server            Database
 |                    |                   |                  |
 |--[1] Click Login---|                   |                  |
 |                    |--POST /login----->|                  |
 |                    |                   |--Query user----->|
 |                    |                   |<--User found-----|
 |                    |<--Set-Cookie------|                  |
 |                    |<--200 + user------|                  |
 |                    |[Stores token]     |                  |
 |                    |                   |                  |
 |--[2] Redirect-----|                   |                  |
 |    to /dashboard   |                   |                  |
 |                    |--GET /api/data--->|                  |
 |                    |[+Cookie: token]   |--Validate token->|
 |                    |                   |<--User valid-----|
 |                    |<--200 + data------|                  |
 |<--[3] Show data----|                   |                  |
 |   with balance     |                   |                  |
 |                    |                   |                  |
 |--[4] Click Logout-|                   |                  |
 |                    |[Remove cookie]    |                  |
 |<--Redirect home----|                   |                  |
```

---

## JOYCOIN VALUE CHART

```
How Users Earn JoyCoin (When Features Activated):

┌──────────────────┬───────┬─────────────────────────┐
│ Action           │ Coins │ Status                  │
├──────────────────┼───────┼─────────────────────────┤
│ Join Workshop    │ +20   │ 🔄 Awaiting Zoom webhook│
│ Earn Certificate │ +10   │ 🔄 Awaiting Zoom data   │
│ Complete Survey  │ +5    │ 🔄 Awaiting feature     │
│ Share Feedback   │ +3    │ 🔄 Awaiting feature     │
│ Refer Friend     │ +50   │ 🔄 Awaiting feature     │
├──────────────────┼───────┼─────────────────────────┤
│ Spend on Merch   │ -100  │ 🔄 Shop not built yet   │
│ Spend on Course  │ -50   │ 🔄 Shop not built yet   │
└──────────────────┴───────┴─────────────────────────┘

Current Status: Users can VIEW balances ✅
              Users can't earn coins yet (no workshops)
              Users can't spend coins yet (no shop)
```

---

## TESTING REFERENCE

```
What We Tested:
✅ Login endpoint works
✅ Token is generated correctly
✅ Token is set in cookie
✅ Wallet endpoint retrieves balance
✅ All 4 users have correct balances
✅ Unauthorized requests blocked (401)

What Still Needs Testing (Phase 2):
🔄 Zoom webhook integration
🔄 Coin awards on workshop completion
🔄 Certificate generation
🔄 Coin spending
🔄 Leaderboards
🔄 Achievements
```

---

This is the complete system! All the pieces work together to show JoyCoin balances on the dashboard. ✅
