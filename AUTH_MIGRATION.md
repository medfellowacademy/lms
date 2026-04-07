# 🔄 Authentication System Update - Email to Username Migration

## Summary

The login system has been completely simplified from an email/password system to a **username/password** authentication system. This change makes the authentication process simpler and more straightforward.

---

## ✅ Changes Made

### 1. **Database Schema Updates**

#### File: `database/002_create_schema.sql`
- ✅ Added `username` field to User table
- ✅ Created unique index on `username` column
- ✅ Username is now required (NOT NULL)

#### File: `database/supabase/004_add_username_field.sql` (NEW)
- ✅ Migration script to add username to existing databases
- ✅ Automatically generates usernames from existing emails
- ✅ Creates unique constraint

---

### 2. **Authentication Logic**

#### File: `apps/web/src/lib/auth.ts`
**Changes:**
- ✅ `loginUser()` function now accepts `username` instead of `email`
- ✅ Database query changed to lookup by `username` instead of `email`
- ✅ Session token creation remains the same (secure HMAC-based cookies)

**Before:**
```typescript
export async function loginUser(email: string, password: string)
const user = await db.user.findFirst({ where: { email: email.toLowerCase() } });
```

**After:**
```typescript
export async function loginUser(username: string, password: string)
const user = await db.user.findFirst({ where: { username: username.toLowerCase() } });
```

---

### 3. **API Routes**

#### File: `apps/web/src/app/api/auth/login/route.ts`
**Changes:**
- ✅ Request body now expects `username` instead of `email`
- ✅ Validation messages updated
- ✅ Error messages reference username

#### File: `apps/web/src/app/api/auth/register/route.ts`
**Changes:**
- ✅ Request body now expects `username` instead of `email`
- ✅ Duplicate check now uses `username` field
- ✅ Email is automatically generated as `{username}@medfellow.local` (placeholder)
- ✅ Error messages updated to reference username

---

### 4. **User Interface**

#### File: `apps/web/src/app/(auth)/login/page.tsx`
**Changes:**
- ✅ Changed import from `Mail` icon to `User` icon (lucide-react)
- ✅ State variable renamed: `email` → `username`
- ✅ Input field changed:
  - Label: "Email address" → "Username"
  - Type: `email` → `text`
  - Placeholder: "doctor@hospital.com" → "your_username"
  - Icon: Mail → User
- ✅ API call sends `username` instead of `email`

#### File: `apps/web/src/app/(auth)/register/page.tsx`
**Changes:**
- ✅ Form data state: `email` → `username`
- ✅ Input field updated (same changes as login page)
- ✅ API call sends `username` instead of `email`

---

### 5. **Database Seed & Admin Scripts**

#### File: `apps/web/src/lib/seed.ts`
**Changes:**
- ✅ Admin user creation now includes `username: 'admin'`
- ✅ Console logs updated to show username
- ✅ Email remains for backward compatibility

#### File: `database/supabase/insert_admin.sql`
**Changes:**
- ✅ Added `username` field with value `'admin'`
- ✅ Updated DELETE statement to check both email and username
- ✅ Updated verification SELECT to show username

#### File: `database/supabase/insert_santhosh_admin.sql`
**Changes:**
- ✅ Added `username` field with value `'santhosh'`
- ✅ Updated DELETE statement to check both email and username
- ✅ Updated verification SELECT to show username

---

### 6. **Documentation**

#### File: `ADMIN_CREDENTIALS.md`
**Changes:**
- ✅ Updated login credentials section to show username instead of email
- ✅ Added explanation of new authentication system
- ✅ Updated user creation instructions
- ✅ Changed references from "email" to "username" throughout

---

## 🔑 Default Admin Credentials

### Admin Account
```
Username: admin
Password: MedFellow@Admin2026
```

### Santhosh Admin Account (if you use the alternative script)
```
Username: santhosh
Password: Santhu@123
```

---

## 🚀 How to Apply Changes

### For Existing Database:

1. **Run the migration script:**
   ```sql
   -- In Supabase SQL Editor, run:
   database/supabase/004_add_username_field.sql
   ```

2. **Or manually recreate:**
   ```sql
   -- Drop and recreate all tables (WARNING: deletes all data!)
   database/supabase/001_setup_complete.sql
   ```

3. **Insert admin user:**
   ```sql
   database/supabase/insert_admin.sql
   ```

### For New Database:

1. **Run the complete setup:**
   ```sql
   database/supabase/001_setup_complete.sql
   ```

2. **Insert admin user:**
   ```sql
   database/supabase/insert_admin.sql
   ```

---

## 📋 Testing Checklist

After applying changes, test the following:

- [ ] Can login with username "admin" and password "MedFellow@Admin2026"
- [ ] Cannot login with old email-based credentials
- [ ] Registration creates user with username
- [ ] Registration auto-generates placeholder email
- [ ] Session cookie is set correctly after login
- [ ] Logout clears session cookie
- [ ] Admin dashboard accessible after login
- [ ] Student dashboard accessible for student accounts
- [ ] Duplicate username registration is blocked
- [ ] Password validation works (min 6 characters)

---

## 🔍 What Still Uses Email?

While the authentication system now uses **username**, the email field is still in the database for:

1. **Notifications** (if you add email features later)
2. **User profiles** (display purposes)
3. **Recovery mechanisms** (future feature)
4. **Backward compatibility**

The email is auto-generated as `{username}@medfellow.local` for new registrations.

---

## ⚠️ Breaking Changes

**IMPORTANT:** If you have existing users in your database:

1. Run the migration script to add usernames to existing users
2. Existing users will need to:
   - Use their new auto-generated username (based on email prefix)
   - Or, manually update their username in the database

**Example:**
- Old email: `john.doe@hospital.com`
- New username: `john.doe`

---

## 🛠️ Rollback Instructions

If you need to revert to email-based authentication:

1. Revert all file changes using git:
   ```bash
   git checkout HEAD -- apps/web/src/lib/auth.ts
   git checkout HEAD -- apps/web/src/app/api/auth/
   git checkout HEAD -- apps/web/src/app/(auth)/
   ```

2. Optionally remove username column:
   ```sql
   ALTER TABLE "User" DROP COLUMN "username";
   ```

---

## 📞 Support

If you encounter issues:

1. Check database schema has username column
2. Verify migration script ran successfully
3. Clear browser cookies and try again
4. Check server logs for authentication errors

---

## 🎉 Benefits of This Change

✅ **Simpler user experience** - no need to remember email domains
✅ **Faster login** - shorter usernames than emails
✅ **More flexible** - usernames can be anything
✅ **Less validation** - no email format validation needed
✅ **Easier to remember** - users can choose memorable usernames

---

## Files Modified Summary

### Database (4 files)
- `database/002_create_schema.sql`
- `database/supabase/insert_admin.sql`
- `database/supabase/insert_santhosh_admin.sql`
- `database/supabase/004_add_username_field.sql` (NEW)

### Backend (3 files)
- `apps/web/src/lib/auth.ts`
- `apps/web/src/lib/seed.ts`
- `apps/web/src/app/api/auth/login/route.ts`
- `apps/web/src/app/api/auth/register/route.ts`

### Frontend (2 files)
- `apps/web/src/app/(auth)/login/page.tsx`
- `apps/web/src/app/(auth)/register/page.tsx`

### Documentation (2 files)
- `ADMIN_CREDENTIALS.md`
- `AUTH_MIGRATION.md` (THIS FILE)

**Total: 11 files modified + 2 new files created**
