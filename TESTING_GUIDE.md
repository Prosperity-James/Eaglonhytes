# 🧪 Testing Guide - Role-Based Access Control

## Step-by-Step Testing Instructions

---

## 📋 Pre-Testing Checklist

Before you start testing, ensure:
- ✅ Database migration has been run (`add_role_system_safe.sql`)
- ✅ XAMPP Apache and MySQL are running
- ✅ Frontend dev server is running (`npm run dev`)
- ✅ All files have been saved

---

## 🔴 PART 1: Super Admin Testing

### Step 1: Verify Database Migration
1. Open **phpMyAdmin** (http://localhost/phpmyadmin)
2. Select `eaglonhytes` database
3. Click on **users** table
4. Verify you see a new `role` column
5. Find your admin account (`admin@eaglonhytes.com`)
6. Verify `role` = `super_admin`

**Expected Result:** ✅ Role column exists and your account is super_admin

---

### Step 2: Logout Current Session
1. If you're currently logged in, **logout completely**
2. Close all browser tabs for the application
3. Clear browser cache (Ctrl+Shift+Delete)
   - Select "Cookies and other site data"
   - Select "Cached images and files"
   - Click "Clear data"

**Why?** Old session doesn't have the `role` field

---

### Step 3: Login as Super Admin
1. Open browser to: http://localhost:5173
2. Click **Login**
3. Enter credentials:
   - **Email:** `admin@eaglonhytes.com`
   - **Password:** `admin123` (or your password)
4. Click **Login**

**Expected Result:** ✅ You should be redirected to `/admin`

---

### Step 4: Verify Super Admin Dashboard Loads
1. After login, you should see the **SuperAdminDashboard**
2. Check the sidebar - you should see:
   - ✅ Dashboard
   - ✅ Lands
   - ✅ Users
   - ✅ Applications
   - ✅ Messages
   - ✅ Reports
   - ✅ Settings

**Expected Result:** ✅ Full navigation menu with all 7 tabs

---

### Step 5: Check Browser Console for Role
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Type: `JSON.parse(localStorage.getItem('user'))`
4. Press Enter
5. Look for `role: "super_admin"`

**Expected Result:** ✅ User object contains `role: "super_admin"`

---

### Step 6: Test Users Tab (Super Admin Only)
1. Click on **Users** tab in sidebar
2. You should see a list of all users
3. Check if you can see:
   - ✅ Regular users (role: 'user')
   - ✅ Admin users (role: 'admin') if any exist
   - ❌ Your own super admin account should NOT appear in the list

**Expected Result:** ✅ All users visible including admins, EXCEPT yourself

---

### Step 7: Test Lands Management (Full Access)
1. Click on **Lands** tab
2. You should see:
   - ✅ "Add Land" button (top right)
   - ✅ All existing lands
   - ✅ Edit button on each land
   - ✅ Delete button on each land
3. Click **Add Land** button
4. Verify modal opens with full form

**Expected Result:** ✅ Full land management capabilities

---

### Step 8: Test Applications Management
1. Click on **Applications** tab
2. You should see all land applications
3. Click **Approve** on any pending application
4. Verify you can approve it
5. Click **Reject** on another application
6. Verify you can reject it with reason

**Expected Result:** ✅ Full application management

---

### Step 9: Test Reports Tab (Super Admin Only)
1. Click on **Reports** tab
2. You should see revenue reports and statistics
3. Verify you can see financial data

**Expected Result:** ✅ Revenue reports visible

---

### Step 10: Test Settings Tab (Super Admin Only)
1. Click on **Settings** tab
2. You should see system settings
3. Verify you have access to configuration

**Expected Result:** ✅ System settings accessible

---

## 🟡 PART 2: Create and Test Admin Account

### Step 11: Create a Test Admin Account

#### Option A: Using API Directly (Recommended for testing)
1. Open **Postman** or use browser console
2. Make a POST request to: `http://localhost/Eaglonhytes/api/create_admin.php`
3. Set headers:
   ```
   Content-Type: application/json
   ```
4. Set body (raw JSON):
   ```json
   {
     "full_name": "Test Admin",
     "email": "testadmin@eaglonhytes.com",
     "password": "testadmin123",
     "phone": "08012345678"
   }
   ```
5. Send request

**Expected Result:** ✅ Response: `{"success": true, "message": "Admin account created successfully!"}`

#### Option B: Using Browser Console
1. While logged in as Super Admin, open Console (F12)
2. Paste this code:
```javascript
fetch('http://localhost/Eaglonhytes/api/create_admin.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    full_name: 'Test Admin',
    email: 'testadmin@eaglonhytes.com',
    password: 'testadmin123',
    phone: '08012345678'
  })
})
.then(r => r.json())
.then(data => console.log('Result:', data));
```
3. Press Enter
4. Check console for result

**Expected Result:** ✅ Admin account created

---

### Step 12: Verify Admin Account in Database
1. Go to **phpMyAdmin**
2. Select `eaglonhytes` database
3. Click on **users** table
4. Find `testadmin@eaglonhytes.com`
5. Verify:
   - ✅ `role` = `admin`
   - ✅ `is_admin` = `1`

**Expected Result:** ✅ New admin exists with correct role

---

### Step 13: Logout as Super Admin
1. Click **Logout** button
2. Verify you're redirected to home page
3. Clear browser cache again (optional but recommended)

---

### Step 14: Login as Regular Admin
1. Go to Login page
2. Enter credentials:
   - **Email:** `testadmin@eaglonhytes.com`
   - **Password:** `testadmin123`
3. Click **Login**

**Expected Result:** ✅ You should be redirected to `/admin`

---

### Step 15: Verify Limited Admin Dashboard Loads
1. After login, you should see the **AdminDashboard** (limited version)
2. Check the sidebar - you should see ONLY:
   - ✅ Dashboard
   - ✅ Lands
   - ✅ Applications
   - ✅ Messages
3. You should NOT see:
   - ❌ Users tab
   - ❌ Reports tab
   - ❌ Settings tab

**Expected Result:** ✅ Limited navigation menu with only 4 tabs

---

### Step 16: Verify Admin Badge
1. Look at the top of the sidebar
2. You should see a blue badge that says **"Admin"**
3. Super Admin had no badge or different styling

**Expected Result:** ✅ "Admin Access" badge visible

---

### Step 17: Test Lands Tab (Limited Access)
1. Click on **Lands** tab
2. You should see:
   - ❌ NO "Add Land" button
   - ✅ All existing lands
   - ✅ Edit button on each land
   - ❌ NO Delete button on lands
3. Click **Edit** on any land
4. Verify you can edit status and images

**Expected Result:** ✅ Can edit but not add/delete lands

---

### Step 18: Verify Admin Cannot See Other Admins or Themselves
1. If there's a Users tab (there shouldn't be), click it
2. You should only see regular users (customers)
3. Verify you do NOT see:
   - ❌ Your own admin account
   - ❌ Other admin accounts
   - ❌ Super admin account

**Expected Result:** ✅ Only regular users visible, no admins including yourself

---

### Step 19: Test Applications Management (Admin)
1. Click on **Applications** tab
2. You should see all land applications
3. Click **Approve** on any pending application
4. Verify you can approve it
5. Click **Reject** on another application
6. Verify you can reject it

**Expected Result:** ✅ Full application management (same as Super Admin)

---

### Step 20: Test Messages Tab (Admin)
1. Click on **Messages** tab
2. You should see contact messages
3. Verify you can view and reply to messages
4. Check if there's a delete button

**Expected Result:** ✅ Can view/reply, ❌ Cannot delete messages

---

### Step 21: Verify No Access to Reports
1. Try to navigate to reports directly
2. Check if Reports tab exists in sidebar

**Expected Result:** ❌ No Reports tab visible

---

### Step 22: Verify No Access to Settings
1. Try to navigate to settings directly
2. Check if Settings tab exists in sidebar

**Expected Result:** ❌ No Settings tab visible

---

## 🟢 PART 3: Regular User Testing

### Step 23: Logout as Admin
1. Click **Logout**
2. Return to home page

---

### Step 24: Register as Regular User
1. Click **Register**
2. Fill in details:
   - **Full Name:** Test User
   - **Email:** testuser@example.com
   - **Password:** testuser123
3. Click **Register**

**Expected Result:** ✅ Account created, logged in automatically

---

### Step 25: Verify Regular User Cannot Access Admin
1. Try to navigate to: `http://localhost:5173/admin`
2. Press Enter

**Expected Result:** ❌ Should be redirected or blocked

---

### Step 26: Verify Regular User Features
1. You should see regular navigation:
   - ✅ Home
   - ✅ Lands/Apartments
   - ✅ About
   - ✅ Contact
   - ✅ Applications (own applications)
   - ✅ Profile
2. You should NOT see:
   - ❌ Admin link
   - ❌ Users link
   - ❌ Dashboard link

**Expected Result:** ✅ Regular user navigation only

---

### Step 27: Test Regular User Can Apply
1. Go to **Lands** page
2. Click on any property
3. Click **Apply** button
4. Fill in application form
5. Submit application

**Expected Result:** ✅ Application submitted successfully

---

### Step 28: Verify User Role in Database
1. Go to **phpMyAdmin**
2. Select `eaglonhytes` database
3. Click on **users** table
4. Find `testuser@example.com`
5. Verify `role` = `user`

**Expected Result:** ✅ Regular user has role 'user'

---

## 🔍 PART 4: Backend API Testing

### Step 29: Test Users API (Super Admin)
1. Logout and login as **Super Admin**
2. Open browser console (F12)
3. Run this code:
```javascript
fetch('http://localhost/Eaglonhytes/api/users.php', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => console.log('Super Admin sees:', data.data.length, 'users'));
```

**Expected Result:** ✅ Should see ALL users (including admins)

---

### Step 30: Test Users API (Regular Admin)
1. Logout and login as **Test Admin**
2. Open browser console (F12)
3. Run this code:
```javascript
fetch('http://localhost/Eaglonhytes/api/users.php', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => {
  console.log('Admin sees:', data.data.length, 'users');
  console.log('Users:', data.data.map(u => ({email: u.email, role: u.role})));
});
```

**Expected Result:** ✅ Should only see regular users (role='user'), NO admins

---

### Step 31: Test Create Admin API (Unauthorized)
1. While logged in as **Regular Admin**, try to create another admin
2. Open console and run:
```javascript
fetch('http://localhost/Eaglonhytes/api/create_admin.php', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  credentials: 'include',
  body: JSON.stringify({
    full_name: 'Unauthorized Admin',
    email: 'unauthorized@test.com',
    password: 'test123'
  })
})
.then(r => r.json())
.then(data => console.log('Result:', data));
```

**Expected Result:** ❌ Should return 403 Forbidden error

---

### Step 32: Test Audit Log
1. Go to **phpMyAdmin**
2. Select `eaglonhytes` database
3. Click on **admin_audit_log** table
4. Click **Browse**
5. You should see logged actions:
   - ✅ view_users
   - ✅ create_admin
   - ✅ Other admin actions

**Expected Result:** ✅ All admin actions are logged

---

## 📊 PART 5: Verification Checklist

### Super Admin Verification
- [ ] Can login successfully
- [ ] Sees SuperAdminDashboard with all 7 tabs
- [ ] Can view all users (including admins)
- [ ] Can create new admin accounts
- [ ] Can add/edit/delete lands
- [ ] Can approve/reject applications
- [ ] Can access Reports tab
- [ ] Can access Settings tab
- [ ] Role shows as 'super_admin' in console

### Regular Admin Verification
- [ ] Can login successfully
- [ ] Sees AdminDashboard with only 4 tabs
- [ ] Only sees regular users (not admins)
- [ ] Cannot create admin accounts
- [ ] Can edit lands (but not add/delete)
- [ ] Can approve/reject applications
- [ ] Cannot access Reports tab
- [ ] Cannot access Settings tab
- [ ] Role shows as 'admin' in console
- [ ] Sees "Admin Access" badge

### Regular User Verification
- [ ] Can register successfully
- [ ] Cannot access /admin route
- [ ] Can browse properties
- [ ] Can submit applications
- [ ] Can view own applications
- [ ] Can update profile
- [ ] Role shows as 'user' in console

### Backend API Verification
- [ ] Super Admin sees all users via API
- [ ] Regular Admin only sees customers via API
- [ ] Regular Admin cannot create admins (403 error)
- [ ] All admin actions logged in audit_log table
- [ ] Login returns role field
- [ ] Session includes role field

---

## 🐛 Troubleshooting

### Issue: Role not showing after login
**Solution:** 
1. Logout completely
2. Clear browser cache
3. Close all browser tabs
4. Login again

### Issue: Still seeing old dashboard
**Solution:**
1. Hard refresh browser (Ctrl+Shift+F5)
2. Clear cache
3. Check if you're on correct URL (/admin)

### Issue: Admin can still see other admins
**Solution:**
1. Check `api/users.php` has role-based filtering
2. Verify admin's role is 'admin' not 'super_admin'
3. Check browser console for API response

### Issue: Cannot create admin account
**Solution:**
1. Verify you're logged in as super_admin
2. Check browser console for errors
3. Verify API endpoint exists: `api/create_admin.php`

### Issue: Both dashboards look the same
**Solution:**
1. Verify two files exist:
   - `SuperAdminDashboard.jsx`
   - `AdminDashboard.jsx`
2. Check `App.jsx` has role-based routing
3. Clear browser cache

---

## ✅ Success Criteria

All tests pass when:
- ✅ Super Admin has full access to all features
- ✅ Regular Admin has limited access (no users, reports, settings)
- ✅ Regular Admin cannot see other admins in user list
- ✅ Regular Admin cannot create new admins
- ✅ Regular User cannot access admin routes
- ✅ All roles are correctly assigned in database
- ✅ API endpoints enforce role-based permissions
- ✅ Admin actions are logged in audit_log table

---

## 📝 Test Results Template

Copy this template to record your test results:

```
TESTING DATE: ___________
TESTER: ___________

SUPER ADMIN TESTS:
[ ] Step 1-10: All passed
[ ] Issues found: ___________

ADMIN TESTS:
[ ] Step 11-22: All passed
[ ] Issues found: ___________

USER TESTS:
[ ] Step 23-28: All passed
[ ] Issues found: ___________

API TESTS:
[ ] Step 29-32: All passed
[ ] Issues found: ___________

OVERALL STATUS: [ ] PASS [ ] FAIL
NOTES: ___________
```

---

**Happy Testing! 🚀**

If you encounter any issues during testing, check the troubleshooting section or review the implementation files.
