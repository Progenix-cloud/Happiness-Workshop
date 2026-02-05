# 🧪 TESTING GUIDE - Happiness Zoom Integration

## Quick Start (5 minutes)

### Step 1: Start Dev Server
```bash
npm run dev
```
✅ Wait for: `- ready started server on 0.0.0.0:3000`

### Step 2: Test Homepage
```
Open: http://localhost:3000
Expected: 3 smooth loading dots animation → "Happiness" title → buttons
```

### Step 3: Test Login
```
Email: admin@happiness.com
Password: password123
Expected: Redirect to /dashboard
```

---

## Full Testing Workflow

### PHASE 1: Manual Browser Testing

#### 1.1 Landing Page
```
Action: Open http://localhost:3000
Expected Results:
  ✅ 3 colored dots appear (yellow, teal, orange)
  ✅ Dots animate smoothly 
  ✅ After 1.8 seconds: dots fade, "Happiness" title appears
  ✅ Two buttons visible: "Login/Join" and "Explore Workshops"
```

#### 1.2 Authentication
```
Action: Click "Login / Join"
Expected Results:
  ✅ Modal opens with email/password fields
  ✅ Prefilled email appears when selecting role

Test Logins (all password: password123):
  ✅ admin@happiness.com → Admin dashboard
  ✅ trainer@happiness.com → Trainer dashboard
  ✅ participant@happiness.com → Participant dashboard
  ✅ volunteer@happiness.com → Volunteer dashboard
```

#### 1.3 Dashboard Access
```
Action: Login as admin@happiness.com
Expected Results:
  ✅ Redirected to /dashboard
  ✅ Sidebar visible with navigation
  ✅ Dashboard overview page loads
```

---

### PHASE 2: API Testing (using cURL or Postman)

#### 2.1 Test Without Authentication
```bash
# Should return 401 Unauthorized
curl -X GET http://localhost:3000/api/workshops/attended

# Expected Response:
# {"error":"Unauthorized"}
```

#### 2.2 Test Attended Workshops Endpoint
```bash
# Login first to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@happiness.com","password":"password123"}'

# Extract token from response (it's in the token field)
# Then test the endpoint with the token:

curl -X GET http://localhost:3000/api/workshops/attended \
  -H "Cookie: token=YOUR_TOKEN_HERE"

# Expected Response:
# {
#   "workshops": [],
#   "total": 0
# }
# (Empty because no workshops attended yet)
```

#### 2.3 Test JoyCoin Wallet Endpoint
```bash
curl -X GET http://localhost:3000/api/joycoins/wallet \
  -H "Cookie: token=YOUR_TOKEN_HERE"

# Expected Response:
# {
#   "balance": 250,
#   "transactions": [],
#   "total": 0
# }
```

---

### PHASE 3: File Verification

Check all required files exist:

```bash
# Zoom Integration
✅ lib/zoom/types.ts
✅ lib/zoom/zoomService.ts
✅ lib/services/joyCoinService.ts

# API Routes
✅ app/api/webhooks/zoom/route.ts
✅ app/api/workshops/[id]/join/route.ts
✅ app/api/workshops/attended/route.ts
✅ app/api/joycoins/wallet/route.ts
✅ app/api/certificates/download/[workshopId]/route.ts

# Dashboard Pages & Components
✅ app/dashboard/attended-workshops/page.tsx
✅ components/dashboard/JoyCoinWallet.tsx

# Database
✅ lib/mongodb/schemas.ts (updated with joyCoins, IWorkshopParticipant, etc)
✅ lib/mongodb/mockData.ts (updated with joyCoins arrays)
```

---

### PHASE 4: TypeScript Compilation Check

```bash
npx tsc --noEmit

# Should show:
# - Some existing errors from old code (OK)
# - NO errors in new Zoom integration files (✅ CRITICAL)
```

**Check specific files:**
```bash
# If there are errors, check they're not from our new code
npx tsc --noEmit lib/zoom/types.ts        # Should have 0 errors
npx tsc --noEmit lib/zoom/zoomService.ts   # Should have 0 errors
npx tsc --noEmit lib/services/joyCoinService.ts  # Should have 0 errors
```

---

### PHASE 5: Mock Data Verification

```bash
# Check JoyCoin fields exist
grep -n "joyCoins" lib/mongodb/mockData.ts

# Expected output: Multiple lines showing joyCoins values
# Example:
# 21:    joyCoins: 250, // 💰 Initial balance
# 40:    joyCoins: 420, // 💰 Initial balance
# ...
```

---

### PHASE 6: Component Testing (Optional)

#### 6.1 Test JoyCoinWallet Component
```
Note: This component isn't yet added to the dashboard
To test it, add this to app/dashboard/page.tsx:

import { JoyCoinWallet } from '@/components/dashboard/JoyCoinWallet';

export default function Dashboard() {
  return (
    <div>
      <JoyCoinWallet />
      {/* rest of dashboard */}
    </div>
  );
}

Then refresh dashboard and you should see:
  ✅ Large balance display (e.g., "250 JoyCoins")
  ✅ Stats cards (Earned this month, total earned)
  ✅ Transaction history (empty for now)
  ✅ Rewards marketplace teaser
```

#### 6.2 Test Attended Workshops Page
```
1. Navigate to http://localhost:3000/dashboard/attended-workshops
2. Expected to see:
   ✅ "Attended Workshops" heading
   ✅ 3 stats cards (Total Attended, Certificates, Avg Attendance)
   ✅ "No workshops yet" message (since no attendance data)
```

---

### PHASE 7: Integration Testing (Requires Zoom Setup)

#### Prerequisites:
1. Get Zoom OAuth credentials:
   - Go to https://marketplace.zoom.us
   - Create Server-to-Server OAuth app
   - Save: Client ID, Client Secret, Account ID
   - Set webhook secret token

2. Create test workshop with Zoom meeting:
   ```
   {
     title: "Test Workshop",
     zoomMeetingId: "123456789",  // Your test meeting ID
     zoomPassword: "password123",
     duration: 60,
     joyCoinsReward: 20
   }
   ```

3. Register webhook URL with Zoom:
   ```
   Webhook URL: https://yourdomain.com/api/webhooks/zoom
   (Or http://localhost:3000/api/webhooks/zoom for local testing)
   ```

#### 7.1 Simulate Participant Join
```bash
# Send mock webhook event to your local server
curl -X POST http://localhost:3000/api/webhooks/zoom \
  -H "Content-Type: application/json" \
  -H "x-zm-signature: v0=FAKE_SIGNATURE" \
  -H "x-zm-request-timestamp: $(date +%s)000" \
  -d '{
    "event": "meeting.participant_joined",
    "payload": {
      "account_id": "test",
      "object": {
        "id": "123456789",
        "host_id": "user_id",
        "participant": {
          "user_name": "John Doe__UID_1",
          "join_time": "2024-02-05T10:00:00Z"
        }
      }
    }
  }'

# Check server logs - should see:
# ✅ "participant_joined" event processed
# ✅ "Participant joined: User 1 in Meeting 123456789"
```

#### 7.2 Test Post-Meeting Processing
```
Expected flow:
1. Meeting ends → meeting_ended webhook received
2. Server schedules processing after 15 minutes
3. Zoom API is called to get attendance report
4. Attendance % calculated
5. If 75%+:
   - Certificate unlocked
   - JoyCoins awarded (+20)
6. User can see in dashboard:
   - Attended workshop listed
   - Certificate available for download
   - JoyCoins added to wallet
```

---

## 🔍 Debugging Guide

### Issue: "Module not found" errors
**Solution:**
```bash
# Clear Next.js cache
rm -rf .next node_modules
npm install
npm run dev
```

### Issue: TypeScript errors on new files
**Solution:**
```bash
# Check if there are actual errors in new code
npx tsc lib/zoom/zoomService.ts --noEmit

# If errors persist, check:
# 1. File imports are correct
# 2. All types are imported from schemas.ts
# 3. Environment variables are defined
```

### Issue: API returns 401 Unauthorized
**Solution:**
```
Check:
1. Token is passed in Cookie header: Cookie: token=YOUR_TOKEN
2. Token format is correct (from login response)
3. User exists in mockData
```

### Issue: Webhook signature verification fails
**Solution:**
```
1. Get actual webhook secret from Zoom app settings
2. Set ZOOM_WEBHOOK_SECRET environment variable
3. Check signature format: v0=HASH
```

### Check Server Logs
```bash
# Server running in terminal should show:
✅ "ready started server on 0.0.0.0:3000"
✅ "GET / 200" when accessing homepage
✅ "POST /api/auth/login 200" when logging in
✅ "[Webhook] participant_joined" when processing webhooks
```

---

## 📊 What to Check

| Component | Status Check | Expected Result |
|-----------|--------------|-----------------|
| Files | All 11 files exist | ✅ |
| TypeScript | No errors in new code | ✅ |
| Mock Data | joyCoins field present | ✅ 250-600 coins/user |
| API Endpoints | Respond to requests | ✅ 401 without auth, 200 with auth |
| Authentication | Login works | ✅ Token issued |
| JoyCoin Wallet | API returns balance | ✅ Returns user balance |
| Attended Workshops | API returns empty list | ✅ Empty until workshops attended |
| Zoom Webhooks | Can receive events | ⏳ Requires Zoom setup |
| End-to-End | Full flow works | ⏳ Requires real meeting |

---

## ✅ Successful Test Indicators

### Phase 1 Complete ✅
```
✅ Homepage loads with 3 dots animation
✅ Login works with test credentials
✅ Dashboard accessible
```

### Phase 2 Complete ✅
```
✅ API endpoints respond (401 without auth, 200 with auth)
✅ Mock data shows JoyCoin balances
✅ JoyCoin wallet returns user balance
✅ Attended workshops returns empty list
```

### Phase 3 Complete ✅
```
✅ All 11 files present
✅ TypeScript compilation passes (no errors in new code)
✅ Mock data properly formatted
```

### Phase 4 Complete ✅
```
✅ Webhook endpoint responds to POST requests
✅ Signature verification works
✅ Events are logged in console
```

### Phase 5 Complete ✅
```
✅ Post-meeting processing executes
✅ Attendance % calculated correctly
✅ Certificates unlocked at 75%+
✅ JoyCoins awarded to user
✅ Dashboard shows attended workshops
```

---

## 🎯 Testing Checklist

- [ ] Dev server starts successfully
- [ ] Homepage loads with animation
- [ ] Can login with all 11 test accounts
- [ ] Dashboard accessible after login
- [ ] API endpoints exist and require auth
- [ ] Mock data has JoyCoin support
- [ ] TypeScript has no new errors
- [ ] All 11 files present
- [ ] Webhook endpoint responds to POST
- [ ] (Optional) Attended workshops page loads
- [ ] (Optional) JoyCoin wallet component displays
- [ ] (Advanced) Zoom OAuth configured
- [ ] (Advanced) Webhook URL registered
- [ ] (Advanced) Test workshop created with Zoom ID
- [ ] (Advanced) Webhook events logged successfully
- [ ] (Advanced) Post-meeting processing works
- [ ] (Advanced) Certificates generated
- [ ] (Advanced) JoyCoins awarded

---

## 🚀 Quick Test Commands

```bash
# 1. Start dev server
npm run dev

# 2. Open in browser
# http://localhost:3000

# 3. Test login
# Email: admin@happiness.com, Password: password123

# 4. Check TypeScript
npx tsc --noEmit

# 5. Test API (get token first)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@happiness.com","password":"password123"}'

# 6. Extract token and test endpoint
curl -X GET http://localhost:3000/api/workshops/attended \
  -H "Cookie: token=YOUR_TOKEN"

# 7. Test JoyCoin wallet
curl -X GET http://localhost:3000/api/joycoins/wallet \
  -H "Cookie: token=YOUR_TOKEN"
```

---

## 📝 Test Results Template

Save this and fill out as you test:

```
Test Date: _______________
Tester: ___________________

Phase 1: Manual Browser Testing
  [ ] Landing page animation works
  [ ] Login modal opens
  [ ] Can login as admin
  [ ] Dashboard loads after login
  Result: PASS / FAIL

Phase 2: API Testing
  [ ] Endpoints require authentication
  [ ] Attended workshops returns data
  [ ] JoyCoin wallet returns balance
  Result: PASS / FAIL

Phase 3: File & Code
  [ ] All 11 files exist
  [ ] TypeScript compiles
  [ ] Mock data has JoyCoin support
  Result: PASS / FAIL

Phase 4: Integration (if Zoom configured)
  [ ] Webhook receives events
  [ ] Attendance is tracked
  [ ] Certificates are unlocked
  [ ] JoyCoins are awarded
  Result: PASS / FAIL

Overall: PASS / FAIL
Notes: ____________________
```

---

## Need Help?

Check files:
- [ZOOM_IMPLEMENTATION_SUMMARY.md](ZOOM_IMPLEMENTATION_SUMMARY.md) - Technical overview
- [ZOOM_IMPLEMENTATION_STATUS_FINAL.md](ZOOM_IMPLEMENTATION_STATUS_FINAL.md) - Final status
- Individual source files have inline comments

Environment variables needed:
```bash
ZOOM_CLIENT_ID=your_id
ZOOM_CLIENT_SECRET=your_secret
ZOOM_ACCOUNT_ID=your_account_id
ZOOM_WEBHOOK_SECRET=your_webhook_secret
```

**All test credentials use password: `password123`**
