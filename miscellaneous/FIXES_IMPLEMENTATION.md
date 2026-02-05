# 🔧 CODEBASE FIXES - Implementation Guide

**Status:** Ready to implement  
**Estimated Time:** 1 hour for all fixes  
**After Completion:** Ready for `git commit`

---

## 🔴 PHASE 1: CRITICAL FIXES (30 minutes)

### FIX #1: Token Name Mismatch in middleware.ts
**File:** [middleware.ts](middleware.ts)  
**Current:** Line 5 checks for `'auth_token'`  
**Issue:** Login sets `'token'`, not `'auth_token'`

**BEFORE:**
```typescript
const token = request.cookies.get('auth_token');
```

**AFTER:**
```typescript
const token = request.cookies.get('token');
```

**Why:** Makes middleware match login endpoint cookie name

---

### FIX #2: Replace Manual JWT Parsing - join/route.ts
**File:** [app/api/workshops/[id]/join/route.ts](app/api/workshops/[id]/join/route.ts)  
**Current:** Lines 18-30 manually parse JWT  
**Issue:** Uses non-existent `payload.email` field; token has `payload.userId`

**COMPLETE REPLACEMENT (lines 18-30):**

**BEFORE:**
```typescript
    // 🔐 Step 1: Get authenticated user (from token/session)
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode token to get user
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    const user = users.find((u) => u.email === payload.email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
```

**AFTER:**
```typescript
    // 🔐 Step 1: Get authenticated user (from token/session)
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await authService.getCurrentUser(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
```

**Also add at top of file:**
```typescript
import { authService } from '@/lib/auth/authService';
```

---

### FIX #3: Replace Manual JWT Parsing - certificates/route.ts
**File:** [app/api/certificates/download/[workshopId]/route.ts](app/api/certificates/download/[workshopId]/route.ts)  
**Current:** Lines 18-30  
**Issue:** Same as FIX #2

**BEFORE:**
```typescript
    // Get authenticated user
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    const user = users.find((u) => u.email === payload.email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
```

**AFTER:**
```typescript
    // Get authenticated user
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await authService.getCurrentUser(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
```

**Also add at top of file:**
```typescript
import { authService } from '@/lib/auth/authService';
```

---

### FIX #4: Fix Signup Token Generation
**File:** [lib/auth/authService.ts](lib/auth/authService.ts)  
**Current:** Line 81 doesn't pass userId  
**Issue:** Signup tokens won't have userId in payload

**BEFORE:**
```typescript
    const token = generateMockToken();
```

**AFTER:**
```typescript
    const token = generateMockToken(newUser._id.toString());
```

---

## 🟠 PHASE 2: MAJOR FIXES (20 minutes)

### FIX #5: Standardize HTTP Status Codes

All endpoints should use consistent codes:
- **401 Unauthorized** - No/invalid token
- **403 Forbidden** - Valid auth but no permission  
- **404 Not Found** - Resource doesn't exist
- **400 Bad Request** - Invalid parameters

**Files to Check:**
- [app/api/joycoins/wallet/route.ts](app/api/joycoins/wallet/route.ts) ✅ Already correct
- [app/api/workshops/attended/route.ts](app/api/workshops/attended/route.ts) ✅ Already correct
- [app/api/auth/login/route.ts](app/api/auth/login/route.ts) - Check line 14

**No changes needed** - endpoints already follow pattern after FIX #2 and #3

---

### FIX #6: Delete Unused Role Services (Optional)

These 10 files are never imported:
```
lib/auth/services/adminService.ts
lib/auth/services/trainerService.ts
lib/auth/services/volunteerService.ts
lib/auth/services/participantService.ts
lib/auth/services/donorService.ts
lib/auth/services/directorService.ts
lib/auth/services/partnerService.ts
lib/auth/services/phdService.ts
lib/auth/services/rwaService.ts
lib/auth/services/coAdminService.ts
```

**Option A: Delete (Recommended)**
```bash
rm lib/auth/services/adminService.ts
rm lib/auth/services/trainerService.ts
# ... etc for all 10 files
```

**Option B: Keep but Document**
Add comment to [lib/auth/services/README.md](lib/auth/services/README.md):
```markdown
# Deprecated Role Services

These files are legacy code from earlier project phase.
Current implementation uses authService with role-based access in middleware.

⚠️ Marked for removal in next cleanup pass.
```

**Recommendation:** **Delete them** - they're not used and add maintenance overhead

---

### FIX #7: Delete JoyCoinService (Or Integrate)

**File:** [lib/services/joyCoinService.ts](lib/services/joyCoinService.ts)  
**Issue:** Service created but never called anywhere

**Option A: Delete**
```bash
rm lib/services/joyCoinService.ts
```

**Option B: Integrate (Better)**
Use in webhook handler when user completes workshop:
1. GET `/api/webhooks/zoom` - receives attendance data
2. Award coins: `await joyCoinService.awardCoins(userId, 20, 'workshop_completion', ...)`
3. Update user.joyCoins in mock data

**Recommendation:** **Integrate** - it's well-designed and needed for full feature

---

## 🟡 PHASE 3: NICE TO HAVE (10 minutes)

### FIX #8: Fix HERO_SECTION_GUIDE.md Markdown

**Issue:** 50+ linting errors (formatting)

**Solution:** Add blank lines:
- Before/after headings (`### Heading` needs blank line below)
- Before/after lists (`- Item` needs blank line)
- Before/after code blocks (``` needs blank line)

**Quick Fix:** Don't spend time on this - markdown errors don't affect functionality

---

### FIX #9: Add Null Checks

**File:** [app/api/workshops/[id]/join/route.ts](app/api/workshops/[id]/join/route.ts)  
**Around:** Line 35 after finding user

**ADD:**
```typescript
    if (!user?.name) {
      return NextResponse.json({ error: 'User name is missing' }, { status: 400 });
    }
```

**Same for:** [app/api/certificates/download/[workshopId]/route.ts](app/api/certificates/download/[workshopId]/route.ts)

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Critical (MUST DO)
- [ ] FIX #1: Change `auth_token` → `token` in middleware.ts
- [ ] FIX #2: Replace JWT parsing in join/route.ts, add authService import
- [ ] FIX #3: Replace JWT parsing in certificates/route.ts, add authService import  
- [ ] FIX #4: Add userId to signup token generation

**Estimated Time:** 10 minutes

### Phase 2: Major (SHOULD DO)
- [ ] FIX #5: Verify HTTP status codes (should be automatic after Phase 1)
- [ ] FIX #6: Delete 10 unused role service files OR document as deprecated
- [ ] FIX #7: Delete joyCoinService OR integrate into webhook

**Estimated Time:** 15 minutes

### Phase 3: Polish (NICE TO DO)
- [ ] FIX #8: Fix markdown formatting (optional)
- [ ] FIX #9: Add null checks for safety

**Estimated Time:** 5 minutes

---

## 🧪 VALIDATION AFTER FIXES

**Step 1: TypeScript Check**
```bash
npx tsc --noEmit
```

**Expected:** 0 errors

**Step 2: Run Test Suite**
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run tests
pwsh test-endpoints.ps1
```

**Expected:** 39/39 tests passing

**Step 3: Manual Smoke Test**
```bash
# Test each endpoint manually:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@happiness.com","password":"password123"}'

# Response should include "token" in JSON and Set-Cookie header
```

---

## 🚀 GIT COMMIT AFTER ALL FIXES

```bash
git add .
git commit -m "Fix critical auth issues: token naming, JWT parsing, unused code cleanup

- Fix middleware cookie name (auth_token → token)
- Replace manual JWT parsing with authService.getCurrentUser()
- Fix signup token generation (add userId)
- Remove unused role service files
- Remove unused joyCoinService (or integrate later)
- All tests passing 39/39
- TypeScript: 0 errors"
```

---

## 📝 FILES AFFECTED BY FIXES

### Modified:
- ✏️ middleware.ts (1 line change)
- ✏️ app/api/workshops/[id]/join/route.ts (1 import + 10 lines)
- ✏️ app/api/certificates/download/[workshopId]/route.ts (1 import + 10 lines)
- ✏️ lib/auth/authService.ts (1 line change)

### Deleted:
- 🗑️ lib/auth/services/adminService.ts
- 🗑️ lib/auth/services/trainerService.ts
- 🗑️ lib/auth/services/volunteerService.ts
- 🗑️ lib/auth/services/participantService.ts
- 🗑️ lib/auth/services/donorService.ts
- 🗑️ lib/auth/services/directorService.ts
- 🗑️ lib/auth/services/partnerService.ts
- 🗑️ lib/auth/services/phdService.ts
- 🗑️ lib/auth/services/rwaService.ts
- 🗑️ lib/auth/services/coAdminService.ts

### Optional Delete:
- 🗑️ lib/services/joyCoinService.ts (if not integrating)

---

## ⏱️ TIMELINE

| Phase | Fixes | Time | Status |
|-------|-------|------|--------|
| 1 | FIX #1-4 | 10 min | READY |
| 2 | FIX #5-7 | 15 min | READY |
| 3 | FIX #8-9 | 5 min | OPTIONAL |
| Testing | TypeScript + Tests | 5 min | READY |
| Commit | Git push | 2 min | READY |
| **TOTAL** | **All** | **40 min** | **GO!** |

---

**Next Step:** Begin with Phase 1 fixes (10 minutes) ⏰
