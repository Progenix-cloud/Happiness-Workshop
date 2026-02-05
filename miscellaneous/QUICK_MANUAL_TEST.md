# 🎯 QUICK START - TEST JOYCOINS NOW!

## 3 EASY STEPS:

### 1️⃣ Open Website
```
http://localhost:3000
```
You'll see 3 animated dots, then "Happiness" title with login button

### 2️⃣ Click "Login/Join" & Enter:
```
Email: admin@happiness.com
Password: password123
```

### 3️⃣ Look for JoyCoin Wallet on Dashboard
```
💰 250 coins displayed in wallet card
```

---

## WHAT YOU'LL SEE:

### Dashboard Top Section:
```
┌─────────────────┬─────────────────┬─────────────────┐
│  Happiness      │  Workshops      │  💰 JoyCoin     │
│  Score: 7.0     │  Booked: 0      │  Wallet: 250    │
└─────────────────┴─────────────────┴─────────────────┘
                            ↑
                    YOU'LL SEE THIS!
```

### JoyCoin Wallet Card Details:
- **Large coin emoji 💰**
- **Balance: 250 coins** (or 420/180/160 for other users)
- **Transaction History** (empty for now - awaiting real workshops)
- **How to Earn** section with info on coin rewards

---

## TEST ALL 4 USERS:

| User | Email | Balance | What to Expect |
|------|-------|---------|---|
| Admin | admin@happiness.com | 250 | Boss role, all permissions |
| Trainer | trainer@happiness.com | 420 | Highest coins (teaches workshops) |
| Participant | participant@happiness.com | 180 | Regular user (attends workshops) |
| Volunteer | volunteer@happiness.com | 160 | Helps coordinate events |

**Password for all:** `password123`

**How to test:**
1. Login as Admin → See 250 coins
2. Logout (top right)
3. Login as Trainer → See 420 coins
4. Repeat for others

---

## VERIFY IT'S WORKING:

### ✅ What Should Work:
- [x] Login successful
- [x] Correct coins per user
- [x] Wallet card visible
- [x] Can navigate dashboard
- [x] Can logout
- [x] Can login again as different user

### ❌ What's Not Yet (Normal):
- Transaction history empty (no real Zoom meetings yet)
- No coin spending shop (coming in next phase)
- No leaderboards (planned feature)

---

## BONUS: DEVELOPER TOOLS

Open **F12** (Developer Tools) and check:

**Network Tab:**
- `POST /api/auth/login` → Shows token in response
- `GET /api/joycoins/wallet` → Shows your balance
- Both should show **200 status** ✅

**Application Tab (Cookies):**
- Look for `token` cookie
- Should exist after login
- Should disappear after logout

**Console Tab:**
- No red errors
- Some yellow warnings OK (Next.js development warnings)

---

## READY?

👉 **Go to http://localhost:3000 right now!**

Backend server is running. Just test the website manually and verify everything looks good.

**Questions?** Check the full guide: [MANUAL_TESTING_JOYCOIN_GUIDE.md](MANUAL_TESTING_JOYCOIN_GUIDE.md)

---

**This is what we just fixed and tested:**
✅ Authentication working
✅ Tokens being set correctly  
✅ All 4 users can login
✅ JoyCoin balances showing correctly
✅ Protected endpoints secure
✅ 10/10 tests passing

**Ready to commit when you say go!** 🚀
