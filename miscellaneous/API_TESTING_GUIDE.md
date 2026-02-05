# 🔌 API Testing Guide - Get Token & Test Endpoints

## Quick Summary

1. **Login** → Get token
2. **Use token** → Test authenticated endpoints

---

## Method 1: Using PowerShell (Windows)

### Step 1: Get Login Token

```powershell
# Login and save response
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body @{
    email = "admin@happiness.com"
    password = "password123"
  } | ConvertFrom-Json

# Show response
$response | ConvertTo-Json

# Extract token
$token = $response.token
Write-Host "Token: $token"
```

**Expected Response:**
```json
{
  "user": {
    "id": "admin",
    "email": "admin@happiness.com",
    "name": "Admin User",
    "role": "admin",
    "joyCoins": 250
  },
  "token": "eyJhbGc..."
}
```

### Step 2: Test Attended Workshops Endpoint

```powershell
# Get token (from step 1)
$token = "YOUR_TOKEN_HERE"

# Test endpoint
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/workshops/attended" `
  -Method GET `
  -Headers @{
    "Cookie" = "token=$token"
  }

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

**Expected Response:**
```json
{
  "workshops": [],
  "total": 0
}
```

### Step 3: Test JoyCoin Wallet Endpoint

```powershell
$token = "YOUR_TOKEN_HERE"

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/joycoins/wallet" `
  -Method GET `
  -Headers @{
    "Cookie" = "token=$token"
  }

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

**Expected Response:**
```json
{
  "balance": 250,
  "transactions": [],
  "total": 0
}
```

### Complete PowerShell Test Script

Save this as `test-api.ps1`:

```powershell
# ===== API Testing Script =====
# Test login, then authenticated endpoints

# Colors for output
$success = "Green"
$error = "Red"
$info = "Cyan"

Write-Host "🔌 API Testing Script" -ForegroundColor $info
Write-Host "=====================" -ForegroundColor $info

# Step 1: Login
Write-Host "`n1️⃣  Logging in..." -ForegroundColor $info

try {
  $loginResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body (@{
      email = "admin@happiness.com"
      password = "password123"
    } | ConvertTo-Json) `
    -ErrorAction Stop

  $loginData = $loginResponse.Content | ConvertFrom-Json
  $token = $loginData.token
  
  Write-Host "✅ Login successful!" -ForegroundColor $success
  Write-Host "User: $($loginData.user.name) ($($loginData.user.email))" -ForegroundColor $info
  Write-Host "JoyCoins: $($loginData.user.joyCoins)" -ForegroundColor $info
  Write-Host "Token: $($token.Substring(0, 20))..." -ForegroundColor $info
}
catch {
  Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor $error
  exit
}

# Step 2: Test Attended Workshops
Write-Host "`n2️⃣  Testing /api/workshops/attended..." -ForegroundColor $info

try {
  $workshopResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/workshops/attended" `
    -Method GET `
    -Headers @{
      "Cookie" = "token=$token"
    } `
    -ErrorAction Stop

  $workshopData = $workshopResponse.Content | ConvertFrom-Json
  
  Write-Host "✅ Attended Workshops endpoint works!" -ForegroundColor $success
  Write-Host "Total attended: $($workshopData.total)" -ForegroundColor $info
  Write-Host "Response: $($workshopResponse.Content)" -ForegroundColor $info
}
catch {
  Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor $error
}

# Step 3: Test JoyCoin Wallet
Write-Host "`n3️⃣  Testing /api/joycoins/wallet..." -ForegroundColor $info

try {
  $walletResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/joycoins/wallet" `
    -Method GET `
    -Headers @{
      "Cookie" = "token=$token"
    } `
    -ErrorAction Stop

  $walletData = $walletResponse.Content | ConvertFrom-Json
  
  Write-Host "✅ JoyCoin Wallet endpoint works!" -ForegroundColor $success
  Write-Host "Balance: $($walletData.balance) JoyCoins" -ForegroundColor $info
  Write-Host "Total transactions: $($walletData.total)" -ForegroundColor $info
  Write-Host "Response: $($walletResponse.Content)" -ForegroundColor $info
}
catch {
  Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor $error
}

# Step 4: Test Without Authentication (should fail)
Write-Host "`n4️⃣  Testing without authentication (should fail)..." -ForegroundColor $info

try {
  $noAuthResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/workshops/attended" `
    -Method GET `
    -ErrorAction Stop
  
  Write-Host "⚠️  WARNING: Endpoint allowed unauthenticated access!" -ForegroundColor $error
}
catch {
  if ($_.Exception.Response.StatusCode -eq 401) {
    Write-Host "✅ Correctly rejected unauthenticated request (401)" -ForegroundColor $success
  } else {
    Write-Host "❌ Unexpected error: $($_.Exception.Message)" -ForegroundColor $error
  }
}

Write-Host "`n✅ Testing Complete!" -ForegroundColor $success
```

**Run it:**
```powershell
.\test-api.ps1
```

---

## Method 2: Using cURL (Command Line)

### Step 1: Get Login Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@happiness.com",
    "password": "password123"
  }' \
  -s | jq .
```

**Extract token in PowerShell:**
```powershell
$response = curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "email": "admin@happiness.com",
    "password": "password123"
  }' -s | ConvertFrom-Json

$token = $response.token
Write-Host "Token: $token"
```

### Step 2: Test Attended Workshops with Token

```bash
TOKEN="your_token_here"

curl -X GET http://localhost:3000/api/workshops/attended \
  -H "Cookie: token=$TOKEN" \
  -s | jq .
```

### Step 3: Test JoyCoin Wallet

```bash
TOKEN="your_token_here"

curl -X GET http://localhost:3000/api/joycoins/wallet \
  -H "Cookie: token=$TOKEN" \
  -s | jq .
```

---

## Method 3: Using Postman (GUI - Easiest)

### Setup:

1. **Download Postman** from https://www.postman.com/downloads/
2. **Create new workspace** (or use existing)

### Test Login:

1. Create **New Request** → POST
2. **URL:** `http://localhost:3000/api/auth/login`
3. **Headers:** 
   - Key: `Content-Type`, Value: `application/json`
4. **Body** (raw JSON):
   ```json
   {
     "email": "admin@happiness.com",
     "password": "password123"
   }
   ```
5. Click **Send**
6. **Copy token** from response under `token` field

### Test Attended Workshops:

1. Create **New Request** → GET
2. **URL:** `http://localhost:3000/api/workshops/attended`
3. **Cookies:**
   - Name: `token`, Value: `[paste token from login]`
4. Click **Send**
5. **Expected:** Empty workshops array `{ "workshops": [], "total": 0 }`

### Test JoyCoin Wallet:

1. Create **New Request** → GET
2. **URL:** `http://localhost:3000/api/joycoins/wallet`
3. **Cookies:**
   - Name: `token`, Value: `[paste token from login]`
4. Click **Send**
5. **Expected:** User balance `{ "balance": 250, "transactions": [], "total": 0 }`

---

## Test All Users

Test with these login credentials (all use password: `password123`):

```
Admin:
  Email: admin@happiness.com
  JoyCoins: 250

Trainer:
  Email: trainer@happiness.com
  JoyCoins: 420

Participant:
  Email: participant@happiness.com
  JoyCoins: 180

Volunteer:
  Email: volunteer@happiness.com
  JoyCoins: 320

Donor:
  Email: donor@happiness.com
  JoyCoins: 600

Director:
  Email: director@happiness.com
  JoyCoins: 500

Basiak:
  Email: basiak@happiness.com
  JoyCoins: 160

Partner:
  Email: partner@happiness.com
  JoyCoins: 280

RWA:
  Email: rwa@happiness.com
  JoyCoins: 240

PhD:
  Email: phd@happiness.com
  JoyCoins: 550

Coadmin:
  Email: coadmin@happiness.com
  JoyCoins: 380
```

Each user should return their own balance when testing the wallet endpoint.

---

## API Endpoints to Test

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/login` | POST | ❌ | Get login token |
| `/api/workshops/attended` | GET | ✅ | List attended workshops |
| `/api/joycoins/wallet` | GET | ✅ | Get JoyCoin balance |
| `/api/webhooks/zoom` | POST | ❌ | Receive Zoom webhooks |

---

## Debugging Tips

### Check if server is running:
```powershell
# If getting connection refused, server isn't running
# Start with: npm run dev
```

### Token format:
- Tokens are JWT format: `eyJ...` (long string)
- Can decode at https://jwt.io to verify contents

### Cookie format:
```
Cookie: token=YOUR_TOKEN_VALUE
```
Don't include `Bearer` prefix - it's a cookie not a Bearer token.

### Test Invalid Token:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/workshops/attended" `
  -Method GET `
  -Headers @{
    "Cookie" = "token=invalid_token"
  }

# Should return 401 Unauthorized
```

### Test No Token:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/workshops/attended" `
  -Method GET

# Should return 401 Unauthorized
```

---

## Expected Test Results

✅ **Login successful** → Returns user object + token  
✅ **Attended workshops** → Returns empty array (no attendance yet)  
✅ **JoyCoin wallet** → Returns user's JoyCoin balance  
✅ **No token** → Returns 401 Unauthorized  
✅ **Invalid token** → Returns 401 Unauthorized  

---

## Quick Copy-Paste Commands

### PowerShell One-Liner Login:
```powershell
$r = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@happiness.com","password":"password123"}'; ($r.Content | ConvertFrom-Json) | ConvertTo-Json
```

### PowerShell Test Wallet (replace TOKEN):
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/joycoins/wallet" -Method GET -Headers @{"Cookie"="token=TOKEN"} | Select-Object -ExpandProperty Content
```

### cURL Login:
```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@happiness.com","password":"password123"}' -s
```

### cURL Test Wallet (replace TOKEN):
```bash
curl -X GET http://localhost:3000/api/joycoins/wallet -H "Cookie: token=TOKEN" -s
```

---

## Common Issues & Solutions

**Issue:** `Connection refused`
- **Solution:** Make sure dev server is running (`npm run dev`)

**Issue:** `401 Unauthorized`
- **Solution:** Check token is included in Cookie header
- Try re-logging in to get fresh token

**Issue:** `400 Bad Request` on login
- **Solution:** Check email/password spelling
- Verify JSON format is valid

**Issue:** Token shows as `undefined`
- **Solution:** Login response format may have changed
- Check response body structure with browser DevTools

**Issue:** Endpoint returns `404 Not Found`
- **Solution:** Check URL spelling
- Verify endpoint is implemented in code

---

## Next Steps

1. ✅ Run dev server: `npm run dev`
2. ✅ Test login endpoint (get token)
3. ✅ Test attended workshops (with token)
4. ✅ Test wallet (with token)
5. ✅ Verify 401 without token
6. ✅ Test with different user accounts

Once all endpoints work, you're ready for Phase 3 of the testing guide!
