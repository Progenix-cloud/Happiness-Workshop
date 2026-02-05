Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  COMPREHENSIVE WEBSITE TEST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Homepage (without login)
Write-Host "TEST 1: Homepage (http://localhost:3000)" -ForegroundColor Yellow
Write-Host "Expected: Should show animations, login button, no errors" -ForegroundColor Gray
Write-Host "Status: Manual - Open in browser and verify" -ForegroundColor Green
Write-Host ""

# Test 2: Login flow
Write-Host "TEST 2: Login Flow" -ForegroundColor Yellow
Write-Host "Testing login with admin@happiness.com..." -ForegroundColor Gray

try {
  $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
  
  # Login
  $loginResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body (@{ email = "admin@happiness.com"; password = "password123" } | ConvertTo-Json) `
    -UseBasicParsing `
    -WebSession $session `
    -ErrorAction Stop
  
  if ($loginResponse.StatusCode -eq 200) {
    $loginData = $loginResponse.Content | ConvertFrom-Json
    Write-Host "✅ Login successful" -ForegroundColor Green
    Write-Host "   Token received: $($loginData.token.Substring(0, 20))..." -ForegroundColor Green
    Write-Host "   User: $($loginData.user.name)" -ForegroundColor Green
    Write-Host "   Expected: Dashboard should load with content and coin balance" -ForegroundColor Gray
    Write-Host ""
  }
} catch {
  Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host ""
}

# Test 3: Wallet endpoint
Write-Host "TEST 3: Wallet Endpoint (while logged in)" -ForegroundColor Yellow
try {
  $walletResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/joycoins/wallet" `
    -Method GET `
    -UseBasicParsing `
    -WebSession $session `
    -ErrorAction Stop
  
  if ($walletResponse.StatusCode -eq 200) {
    $walletData = $walletResponse.Content | ConvertFrom-Json
    Write-Host "✅ Wallet endpoint works" -ForegroundColor Green
    Write-Host "   Balance: $($walletData.balance) JoyCoins" -ForegroundColor Green
    Write-Host "   Expected: 250 for admin" -ForegroundColor Gray
    if ($walletData.balance -eq 250) {
      Write-Host "   ✅ BALANCE CORRECT!" -ForegroundColor Green
    } else {
      Write-Host "   ❌ BALANCE MISMATCH!" -ForegroundColor Red
    }
    Write-Host ""
  }
} catch {
  Write-Host "❌ Wallet endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host ""
}

# Test 4: Logout flow
Write-Host "TEST 4: Logout Flow" -ForegroundColor Yellow
Write-Host "Testing logout API endpoint..." -ForegroundColor Gray

try {
  $logoutResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/logout" `
    -Method POST `
    -ContentType "application/json" `
    -UseBasicParsing `
    -WebSession $session `
    -ErrorAction Stop
  
  if ($logoutResponse.StatusCode -eq 200) {
    Write-Host "✅ Logout API call successful" -ForegroundColor Green
    Write-Host "   Expected: Token cookie should be cleared" -ForegroundColor Gray
    Write-Host "   Expected: User should be redirected to /" -ForegroundColor Gray
    Write-Host ""
  }
} catch {
  Write-Host "❌ Logout API failed: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host ""
}

# Test 5: Dashboard access without token
Write-Host "TEST 5: Dashboard Access Without Token" -ForegroundColor Yellow
Write-Host "Testing /dashboard access after logout..." -ForegroundColor Gray

try {
  $unauthorizedResponse = Invoke-WebRequest -Uri "http://localhost:3000/dashboard" `
    -Method GET `
    -UseBasicParsing `
    -ErrorAction Stop
  
  if ($unauthorizedResponse.StatusCode -eq 200) {
    # Check if redirected to home
    if ($unauthorizedResponse.BaseResponse.RequestMessage.RequestUri -match "/$") {
      Write-Host "✅ Correctly redirected to home page" -ForegroundColor Green
    } else {
      Write-Host "❌ Did not redirect to home: $($unauthorizedResponse.BaseResponse.RequestMessage.RequestUri)" -ForegroundColor Red
    }
    Write-Host ""
  }
} catch {
  Write-Host "⚠️  Response: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
  Write-Host ""
}

# Test 6: API endpoints without authentication
Write-Host "TEST 6: API Endpoints Without Authentication" -ForegroundColor Yellow
Write-Host "Testing wallet endpoint without token (should get 401)..." -ForegroundColor Gray

try {
  $unauthorizedApi = Invoke-WebRequest -Uri "http://localhost:3000/api/joycoins/wallet" `
    -Method GET `
    -UseBasicParsing `
    -ErrorAction Stop
  
  Write-Host "❌ Should have been rejected but got 200" -ForegroundColor Red
} catch {
  if ($_.Exception.Response.StatusCode -eq 401) {
    Write-Host "✅ Correctly rejected with 401 Unauthorized" -ForegroundColor Green
  } else {
    Write-Host "❌ Got wrong status code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
  }
  Write-Host ""
}

# Test 7: Multiple user logins
Write-Host "TEST 7: Multiple User Logins" -ForegroundColor Yellow

$testUsers = @(
  @{ email = "admin@happiness.com"; name = "Admin"; expectedCoins = 250 },
  @{ email = "trainer@happiness.com"; name = "Trainer"; expectedCoins = 420 },
  @{ email = "participant@happiness.com"; name = "Participant"; expectedCoins = 180 },
  @{ email = "volunteer@happiness.com"; name = "Volunteer"; expectedCoins = 160 }
)

foreach ($user in $testUsers) {
  try {
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
      -Method POST `
      -ContentType "application/json" `
      -Body (@{ email = $user.email; password = "password123" } | ConvertTo-Json) `
      -UseBasicParsing `
      -WebSession $session `
      -ErrorAction Stop
    
    if ($loginResponse.StatusCode -eq 200) {
      $loginData = $loginResponse.Content | ConvertFrom-Json
      
      # Get wallet
      $walletResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/joycoins/wallet" `
        -Method GET `
        -UseBasicParsing `
        -WebSession $session `
        -ErrorAction Stop
      
      $walletData = $walletResponse.Content | ConvertFrom-Json
      
      if ($walletData.balance -eq $user.expectedCoins) {
        Write-Host "✅ $($user.name): $($walletData.balance) coins (CORRECT)" -ForegroundColor Green
      } else {
        Write-Host "❌ $($user.name): Got $($walletData.balance), expected $($user.expectedCoins)" -ForegroundColor Red
      }
    }
  } catch {
    Write-Host "❌ $($user.name): Error - $($_.Exception.Message)" -ForegroundColor Red
  }
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MANUAL VERIFICATION NEEDED" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please test these in your browser:" -ForegroundColor Yellow
Write-Host "1. Go to http://localhost:3000" -ForegroundColor Gray
Write-Host "2. Verify: Happy animations play, login button visible" -ForegroundColor Gray
Write-Host "3. Click 'Login/Join' and login with admin@happiness.com / password123" -ForegroundColor Gray
Write-Host "4. Verify: Dashboard loads with content, sidebar visible, coin balance = 250" -ForegroundColor Gray
Write-Host "5. Find the Logout button (should be at bottom of sidebar)" -ForegroundColor Gray
Write-Host "6. Click Logout" -ForegroundColor Gray
Write-Host "7. Verify: Redirected to home page (/), NOT to blank dashboard" -ForegroundColor Gray
Write-Host "8. Refresh page - should still be on home page, not dashboard" -ForegroundColor Gray
Write-Host "9. Try to manually go to http://localhost:3000/dashboard - should redirect to /" -ForegroundColor Gray
Write-Host ""
Write-Host "If any of these fail, tell me exactly what you see!" -ForegroundColor Yellow
