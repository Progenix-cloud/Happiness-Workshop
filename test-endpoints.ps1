# Complete API Testing Script
# Run this in a separate terminal after npm run dev is running

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  API TESTING - Happiness Workshop" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Test users with their expected JoyCoins
$testUsers = @(
    @{ email = "admin@happiness.com"; password = "password123"; name = "Admin User"; expectedCoins = 250 },
    @{ email = "trainer@happiness.com"; password = "password123"; name = "Dr. Sarah Johnson"; expectedCoins = 420 },
    @{ email = "participant@happiness.com"; password = "password123"; name = "Emma Wilson"; expectedCoins = 180 },
    @{ email = "volunteer@happiness.com"; password = "password123"; name = "John Smith"; expectedCoins = 160 }
)

$passedTests = 0
$failedTests = 0

Write-Host "`n" + ("="*40) -ForegroundColor Yellow
Write-Host "PHASE 1: Authentication Tests" -ForegroundColor Yellow
Write-Host ("="*40) -ForegroundColor Yellow

foreach ($user in $testUsers) {
    Write-Host "`nTesting: $($user.name) ($($user.email))" -ForegroundColor Cyan
    
    try {
        # Create session for this user
        $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
        
        # Login
        $loginResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
            -Method POST `
            -ContentType "application/json" `
            -Body (@{ email = $user.email; password = $user.password } | ConvertTo-Json) `
            -UseBasicParsing `
            -WebSession $session `
            -ErrorAction Stop
        
        $loginData = $loginResponse.Content | ConvertFrom-Json
        
        if ($loginResponse.StatusCode -eq 200) {
            Write-Host "  ✅ Login successful" -ForegroundColor Green
            Write-Host "     User: $($loginData.user.name)" -ForegroundColor Green
            $passedTests++
        } else {
            Write-Host "  ❌ Login failed (Status: $($loginResponse.StatusCode))" -ForegroundColor Red
            $failedTests++
            continue
        }
        
        # Test Wallet
        try {
            $walletResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/joycoins/wallet" `
                -Method GET `
                -UseBasicParsing `
                -WebSession $session `
                -ErrorAction Stop
            
            $walletData = $walletResponse.Content | ConvertFrom-Json
            
            if ($walletResponse.StatusCode -eq 200) {
                Write-Host "  ✅ Wallet endpoint works" -ForegroundColor Green
                Write-Host "     Balance: $($walletData.balance) JoyCoins" -ForegroundColor Green
                
                if ($walletData.balance -eq $user.expectedCoins) {
                    Write-Host "     ✅ Balance matches expected: $($user.expectedCoins)" -ForegroundColor Green
                    $passedTests++
                } else {
                    Write-Host "     ⚠️  Balance mismatch (expected: $($user.expectedCoins), got: $($walletData.balance))" -ForegroundColor Yellow
                }
            }
        } catch {
            Write-Host "  ❌ Wallet endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
            $failedTests++
        }
        
        # Test Attended Workshops
        try {
            $workshopResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/workshops/attended" `
                -Method GET `
                -UseBasicParsing `
                -WebSession $session `
                -ErrorAction Stop
            
            $workshopData = $workshopResponse.Content | ConvertFrom-Json
            
            if ($workshopResponse.StatusCode -eq 200) {
                Write-Host "  ✅ Attended workshops endpoint works" -ForegroundColor Green
                Write-Host "     Total attended: $($workshopData.total)" -ForegroundColor Green
                $passedTests++
            }
        } catch {
            Write-Host "  ❌ Attended workshops endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
            $failedTests++
        }
        
    } catch {
        Write-Host "  ❌ Request failed: $($_.Exception.Message)" -ForegroundColor Red
        $failedTests++
    }
}

Write-Host "`n" + ("="*40) -ForegroundColor Yellow
Write-Host "PHASE 2: Authentication Rejection Tests" -ForegroundColor Yellow
Write-Host ("="*40) -ForegroundColor Yellow

# Test without authentication
Write-Host "`nTesting endpoint without token..." -ForegroundColor Cyan
try {
    $noAuthResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/joycoins/wallet" `
        -Method GET `
        -UseBasicParsing `
        -ErrorAction Stop
    
    Write-Host "  ❌ Endpoint allowed unauthenticated access!" -ForegroundColor Red
    $failedTests++
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "  ✅ Correctly rejected unauthenticated request (401)" -ForegroundColor Green
        $passedTests++
    } else {
        Write-Host "  ❌ Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
        $failedTests++
    }
}

Write-Host "`n" + ("="*40) -ForegroundColor Yellow
Write-Host "TEST SUMMARY" -ForegroundColor Yellow
Write-Host ("="*40) -ForegroundColor Yellow
Write-Host "✅ Passed: $passedTests" -ForegroundColor Green
Write-Host "❌ Failed: $failedTests" -ForegroundColor $(if ($failedTests -gt 0) { "Red" } else { "Green" })

if ($failedTests -eq 0) {
    Write-Host "`n🎉 ALL TESTS PASSED!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Check the logs above." -ForegroundColor Yellow
}

Write-Host "`n" + ("="*40) -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "- Check server logs in Terminal 1" -ForegroundColor Cyan
Write-Host "- Review API_TESTING_GUIDE.md for more details" -ForegroundColor Cyan
Write-Host ("="*40) -ForegroundColor Cyan
