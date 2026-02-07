# 🧪 Testing Guide - Quick Reference

## ✅ Changes Made

### 1. Sidebar Cleanup
**Removed** from Participant & Volunteer sidebars:
- ❌ "Booked"
- ❌ "Attended"  
- ❌ "Interested"

**Why?** These are now tabs in the Browse Workshops page itself!

### 2. Clipboard Error Fixed
**Error**: `NotAllowedError: The Clipboard API has been blocked`

**Solution**: Added fallback mechanism:
1. First tries native Web Share API
2. If unavailable, tries Clipboard API
3. If blocked, uses hidden textarea + `document.execCommand('copy')` fallback
4. If all fail, shows alert with URL to copy manually

**Result**: Share button now works in all browsers and security contexts! 🎉

---

## 🎓 NEW Test Workshop Added!

### Workshop Details:
**Workshop ID**: `4`  
**Title**: "Positive Psychology in Practice"  
**Date**: March 10, 2026  
**Time**: 4:00 PM  
**Location**: San Francisco, CA  
**Mode**: Hybrid  
**Capacity**: 35 (8 already registered)  

### Why This Workshop?
- ✅ **NOT registered** by user ID '4' (participant@happiness.com)
- ✅ Has all **new enhanced features**:
  - Poster image
  - Trainer contact info (email & phone)
  - Location with map link
  - High rating: 4.9/5 (22 reviews)
  - Feedback comments visible
  - 4 likes, 12 shares
  - Zoom link included
- ✅ **Future date** (March 10, 2026) so you can test registration
- ✅ **Available spots** (27 remaining)

### How to Test:
1. Login as **participant@happiness.com** / password
2. Go to **Browse Workshops**
3. Look for **"Positive Psychology in Practice"** card
4. You should see:
   - ✅ Poster image
   - ✅ Trainer: Dr. Sarah Johnson (with contact buttons)
   - ✅ Location: San Francisco, CA + map link
   - ✅ Rating: ⭐⭐⭐⭐⭐ 4.9/5 (22 reviews)
   - ✅ Feedback preview from John Smith
   - ✅ **"Register Now" button** (NOT "✅ Registered")
5. Click **"Register Now"**
6. Fill the auto-populated form
7. Submit and test!

---

## 📝 Member Application Testing Guide

### How to Test Volunteer Application

#### Step 1: Navigate
- Click **"Become Member"** in sidebar
- Click **"Become a Volunteer"** card

#### Step 2: Fill the Form

**Personal Information** (Required):
```
Full Name: Sarah Martinez
Email: sarah.volunteer@test.com
Phone: +1 (555) 987-6543
Age: 28
Gender: Female
Address: 456 Community Drive
City: Austin
State: Texas
Country: USA
```

**Professional Information**:
```
Current Occupation: Community Organizer
Organization: Austin Social Impact Hub (optional)
Designation: Program Coordinator (optional)
```

**Volunteer Details**:
```
Availability: Weekends

Preferred Activities (select 3-4):
☑ Event Organization
☑ Community Outreach
☑ Content Creation
☑ Participant Support

Previous Volunteering Experience:
"I have volunteered with local food banks for 3 years and organized community wellness events. I love bringing people together and creating positive experiences."

Motivation:
"I'm passionate about mental health and well-being. I want to help make happiness workshops accessible to underserved communities."
```

**Common Fields**:
```
Reason for Applying:
"I believe in the power of collective well-being. This organization's mission aligns perfectly with my personal values of spreading joy and building resilient communities."

Expected Contribution:
"I can contribute 10-15 hours per month helping with event coordination, social media engagement, and participant onboarding. I have strong organizational skills and experience with community building."

References:
Reference 1:
  Name: Maria Rodriguez
  Contact: maria.r@example.com
  Relationship: Former Supervisor

Reference 2:
  Name: James Chen
  Contact: james.chen@example.com
  Relationship: Community Partner
```

**CV Upload**:
- Upload any PDF file (max 5MB)
- Or skip for testing (remove validation temporarily)

#### Step 3: Submit
- Click **"Submit Application"**
- You should see confirmation
- Navigate to **"Member Application"** in sidebar
- See your application tracker with timeline

---

### How to Test Trainer Application

#### Step 1: Navigate
- Click **"Become Member"** in sidebar
- Click **"Become a Trainer"** card

#### Step 2: Fill the Form

**Personal Information** (Required):
```
Full Name: Dr. Michael Chen
Email: michael.trainer@test.com
Phone: +1 (555) 234-5678
Age: 35
Gender: Male
Address: 789 Wellness Boulevard
City: Seattle
State: Washington
Country: USA
```

**Professional Information**:
```
Current Occupation: Wellness Coach
Organization: Mindful Living Institute
Designation: Senior Trainer & Consultant
```

**Trainer Details**:
```
Areas of Expertise (select 4-5):
☑ Mindfulness & Meditation
☑ Positive Psychology
☑ Stress Management
☑ Emotional Intelligence
☑ Work-Life Balance

Years of Experience: 5-10 years

Certifications & Qualifications:
"M.A. in Psychology (Stanford University), Certified Life Coach (ICF), Mindfulness-Based Stress Reduction (MBSR) Instructor, Positive Psychology Practitioner Certificate"

Training & Facilitation Experience:
"I have facilitated over 150 workshops for corporate clients, educational institutions, and community organizations. Experience includes group facilitation (5-100 participants), one-on-one coaching, and online/hybrid session delivery."

Previous Workshops Conducted:
"Led workshops for Google, Microsoft, and various nonprofits. Topics include mindfulness in the workplace, resilience building, emotional intelligence for leaders, and happiness at work. Consistently rated 4.8/5+ by participants."
```

**Common Fields**:
```
Reason for Applying:
"I want to expand my impact by reaching communities who might not otherwise have access to evidence-based well-being programs. Your organization's mission resonates deeply with my personal commitment to democratizing mental health resources."

Expected Contribution:
"I can lead 2-3 workshops per month, develop new curriculum content, mentor volunteer facilitators, and contribute to program evaluation and improvement. I bring expertise in both traditional and innovative delivery methods."

References:
Reference 1:
  Name: Dr. Lisa Thompson
  Contact: lisa.t@stanford.edu
  Relationship: Academic Supervisor

Reference 2:
  Name: Robert Kim
  Contact: robert.kim@mindful.org
  Relationship: Professional Colleague
```

**CV Upload**:
- Upload any PDF file (max 5MB)
- Or skip for testing

#### Step 3: Submit
- Click **"Submit Application"**
- Check confirmation email (console in dev mode)
- View application tracker

---

## 🔐 Testing Admin Approval Flow

### As Admin:
1. Login as **admin@happiness.com**
2. Click **"Member Applications"** in sidebar
3. See the submitted application
4. Click **"View Details"**
5. Click **"Approve"** button

### What Happens Automatically:
✅ **New user account created**  
✅ **Role**: 'trainer' or 'volunteer'  
✅ **Random 12-char password** generated  
✅ **TWO emails sent**:
   1. Approval congratulations
   2. Login credentials with temp password  
✅ **Application locked** (no more edits)  
✅ **Timeline updated**  

### Testing the New Account:
1. Check console for generated password
2. Logout from admin
3. Login with:
   - Email: `{the email from application}`
   - Password: `{temp password from console}`
4. System should prompt to change password
5. After changing, you'll see trainer/volunteer dashboard!

---

## 🐛 Troubleshooting

### "Workshop not showing"
- Make sure you're logged in as **participant@happiness.com** (user ID '4')
- Check the **"All Workshops"** tab
- Workshop title: "Positive Psychology in Practice"

### "Registration form not auto-filling"
- Verify user profile has data (name, email, phone)
- Check browser console for errors
- Try refreshing the page

### "Share button still erroring"
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- The fix uses 3 fallback methods, should work now
- Check browser console for specific error

### "Member application form errors"
- Age must be 18+ for volunteers, 21+ for trainers
- Email must be valid format
- Phone should include area code
- All required (*) fields must be filled

---

## ✨ Quick Test Checklist

### Browse Workshops Features:
- [ ] See 4 workshops (including new test one)
- [ ] Tabs show correct counts (Booked: 3, Attended: 1, Interested: 0)
- [ ] Search filter works
- [ ] Mode filter works
- [ ] Category filter works
- [ ] Workshop cards show trainer info
- [ ] "View on Map" link works
- [ ] Star ratings visible
- [ ] Feedback comments shown
- [ ] Like button works (heart turns red)
- [ ] Share button works (no error)
- [ ] "Register Now" opens form
- [ ] Form auto-fills name, email, phone
- [ ] Registration succeeds
- [ ] Workshop moves to "Booked" tab

### Member Application Features:
- [ ] "Become Member" page loads
- [ ] Two cards: Trainer & Volunteer
- [ ] Volunteer form opens
- [ ] All fields present
- [ ] CV upload works
- [ ] Submit succeeds
- [ ] Tracker shows timeline
- [ ] Can view application details
- [ ] Can edit (if not yet approved)

### Admin Approval Features:
- [ ] Admin sees pending applications
- [ ] Can view full details
- [ ] Approve button works
- [ ] Credentials email sent (check console)
- [ ] Application status updates
- [ ] Timeline shows approval
- [ ] New user can login

---

**Updated**: February 7, 2026  
**Status**: ✅ All fixes applied, test data ready!

Happy Testing! 🎉
