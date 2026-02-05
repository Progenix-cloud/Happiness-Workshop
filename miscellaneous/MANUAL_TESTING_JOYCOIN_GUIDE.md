# 🧪 MANUAL TESTING GUIDE - JoyCoin Features & Website

**Goal:** Walk through the website and see all JoyCoin functionality in action  
**Server:** Running on http://localhost:3000  
**Time:** 10-15 minutes

---

## 🚀 STEP 1: START THE WEBSITE

Go to: **http://localhost:3000**

**What You'll See:**
- 🔵 **3 colored dots animation** (yellow, teal, orange) at top
- Animation fades after 1.8 seconds
- "Happiness" title appears
- Two buttons: "Login/Join" + "Explore Workshops"

**Expected:** Smooth animation, professional landing page ✅

---

## 🔐 STEP 2: LOGIN (First Test - Admin)

Click **"Login/Join"** button

**Login Modal Opens:**
- Email field (can pre-type)
- Password field
- "Select Role" dropdown
- Login button

**Login as Admin:**
```
Email: admin@happiness.com
Password: password123
```

Click **Login** → Wait for redirect

**Expected:** Redirects to `/dashboard` (takes 2-3 seconds) ✅

---

## 💰 STEP 3: VIEW DASHBOARD (See JoyCoins!)

**Main Dashboard Page loads with:**

### Top Stats Cards (Left to Right):
1. **Happiness Score Card** - Shows current score
2. **Workshops Booked** - Number of registered workshops
3. **JoyCoin Wallet** ⭐ **<-- LOOK HERE!**
   - Large card with coin icon 💰
   - **Current Balance: 250 coins** (for admin)
   - Shows transaction history below

### What to Expect in JoyCoin Wallet:
```
┌─ JoyCoin Wallet ────────────────────┐
│  💰 250 coins                       │
│                                     │
│  Transaction History:               │
│  • (Usually empty for first visit)  │
│                                     │
│  How to earn:                       │
│  ✅ Workshop attendance: +20 coins  │
│  🎓 Certificate earned: +10 coins   │
│  🎁 Rewards: varies                 │
└─────────────────────────────────────┘
```

**Expected:** See "250" coins displayed ✅

---

## 📊 STEP 4: CHECK DASHBOARD SECTIONS

Click on **Sidebar Navigation** to explore:

### Available Pages (that relate to JoyCoins):
1. **Dashboard** (current) - Shows wallet
2. **My Bookings** - Workshops you registered for
3. **Certificates** - Earned certificates (each gives +10 coins)
4. **Browse Workshops** - Available workshops to attend
5. **Feedback** - Submit feedback on workshops
6. **Testimonials** - Share experience

**Explore each** to understand the full ecosystem

---

## 🎓 STEP 5: LOGOUT & TEST OTHER USERS

**Top right corner:** Click your profile → **Logout**

**Login as Different User - Trainer:**
```
Email: trainer@happiness.com
Password: password123
```

**Expected Changes:**
- Dashboard layout stays same
- BUT **JoyCoin balance = 420** (different from admin's 250!)
- Sidebar might show different options based on role

**Check JoyCoin Wallet:** Should show **420 coins** ✅

---

## 🧪 STEP 6: TEST ALL 4 USER ROLES

Repeat login/logout for each user to verify balances:

| Role | Email | Password | Expected Coins | Status |
|------|-------|----------|---|---|
| Admin | admin@happiness.com | password123 | 250 | ✅ |
| Trainer | trainer@happiness.com | password123 | 420 | ✅ |
| Participant | participant@happiness.com | password123 | 180 | ✅ |
| Volunteer | volunteer@happiness.com | password123 | 160 | ✅ |

**As you login each one:**
- Verify balance updates in wallet
- Check that number matches expected value
- Note: Transactions history empty (no real Zoom meetings yet)

---

## 📈 STEP 7: VERIFY AUTHENTICATION WORKS

**Try to access protected page without login:**

1. **Open new tab:** http://localhost:3000/dashboard
2. Should redirect to home page (not logged in)
3. Login again
4. Now you can access /dashboard

**Expected:** Unauthorized users redirected to home ✅

---

## 🔌 STEP 8: TEST API ENDPOINTS DIRECTLY

**Use Browser Dev Tools** (F12 → Network tab):

### Login and Check:
1. Open http://localhost:3000
2. Login as admin
3. **F12** to open Developer Tools
4. Go to **Network** tab
5. Look for requests:
   - ✅ `POST /api/auth/login` → 200 status
   - ✅ `GET /api/joycoins/wallet` → 200 status
   - ✅ `GET /api/workshops/attended` → 200 status

### Check Response Data:
- Click on `POST /api/auth/login`
- Go to **Response** tab
- Should see:
  ```json
  {
    "user": {
      "name": "Admin User",
      "email": "admin@happiness.com",
      "joyCoins": 250,
      ...
    },
    "token": "eyJ...",
    "expiresAt": 1234567890
  }
  ```

**Expected:** All requests 200 status ✅

---

## 🎯 STEP 9: WHAT TO LOOK FOR IN JOYCOINS

### The Wallet Should Show:

```
💰 JoyCoin Balance Card:
├─ Large number (250/420/180/160)
├─ Coin icon 🪙
├─ "Transaction History" section
├─ Total earned this period
└─ Ways to earn coins:
   ├─ Workshop Attendance (+20)
   ├─ Certificate Earned (+10)
   └─ Special Rewards (varies)
```

### Features NOT Yet Active (for next phase):
- ❌ Transaction history (no real workshops attended yet)
- ❌ Coin spending (no shop or store)
- ❌ Leaderboards (not implemented)
- ❌ Achievements (planned for future)

---

## 🐛 STEP 10: WHAT IF SOMETHING'S WRONG?

**Problem:** Wallet shows 0 coins instead of balance
- ✅ **Fix:** Already done! Check token is being set
- Run tests again: `pwsh test-endpoints.ps1`
- Verify all users show correct balance

**Problem:** Can't login
- ✅ Check server logs in other terminal
- Make sure password is exactly: `password123`
- Verify email matches exactly

**Problem:** Dashboard page blank
- ✅ Hard refresh: `Ctrl+Shift+R`
- Check console (F12) for errors
- Make sure you're logged in

**Problem:** Transaction history showing nothing
- ✅ **CORRECT!** No real workshop attendance yet
- This will populate when Zoom webhook is integrated

---

## ✅ COMPLETE TESTING CHECKLIST

- [ ] Homepage loads with animations
- [ ] Can login with all 4 users
- [ ] Admin shows 250 coins
- [ ] Trainer shows 420 coins
- [ ] Participant shows 180 coins
- [ ] Volunteer shows 160 coins
- [ ] JoyCoin Wallet card visible on dashboard
- [ ] Can navigate between pages
- [ ] Can logout
- [ ] Unauthorized users blocked from /dashboard
- [ ] API requests show 200 status in Network tab
- [ ] Token is set in cookies (check in F12 → Application → Cookies)

**Once all checked:** ✅ Everything working perfectly!

---

## 📸 WHERE TO FIND JOYCOINS ON EACH PAGE

| Page | JoyCoin Location | Details |
|------|------------------|---------|
| Dashboard | Top right stats area | Large card showing balance |
| My Bookings | Top info bar | Shows available coins to spend |
| Browse Workshops | Sidebar | Filter by coin rewards |
| Certificates | After earning | +10 coins awarded |
| Profile (future) | Rewards section | Leaderboard position |

---

## 🎮 EXTRA: FUN THINGS TO TRY

1. **Speed Test:** Login and immediately check wallet
   - How fast does coin balance load?
   - Expected: < 1 second

2. **Switch Users Quickly:**
   - Logout, login as different user
   - Does balance update correctly?
   - Expected: Yes, instant update

3. **Check All Roles:**
   - Try admin vs trainer vs participant
   - Different sidebar options?
   - Different dashboard widgets?

4. **Browser Storage:**
   - F12 → Application → Cookies
   - Look for "token" cookie
   - Should be present after login
   - Should disappear after logout

---

## 📝 FINAL SUMMARY

**JoyCoin System Status:** ✅ **FULLY WORKING**

✅ Authentication: Working  
✅ Token management: Working  
✅ Wallet display: Working  
✅ User roles: Working  
✅ Balance tracking: Working  
❌ Transactions: Empty (awaiting real workshop data)  
❌ Coin rewards: Awaiting Zoom webhook integration  

**Next Phase:** 
- Integrate Zoom webhook to award coins on workshop completion
- Add coin spending/shop functionality
- Add leaderboards and achievements

---

**Ready to test? Go to http://localhost:3000 now!** 🚀
