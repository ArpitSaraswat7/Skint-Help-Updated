# Supabase Configuration Guide

## 🚀 Quick Setup Steps

### Step 1: Enable Google OAuth

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `klmeojmzhpmifvlnovxi`
3. Navigate to: **Authentication** → **Providers**
4. Find **Google** and click **Enable**
5. You'll need:
   - Google Client ID
   - Google Client Secret

#### Get Google OAuth Credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set **Authorized redirect URIs**:
   ```
   https://klmeojmzhpmifvlnovxi.supabase.co/auth/v1/callback
   ```
6. Copy Client ID and Client Secret to Supabase

### Step 2: Configure Redirect URLs

In Supabase Dashboard → **Authentication** → **URL Configuration**:

**Site URL:**
```
http://localhost:5173
```

**Redirect URLs (add both):**
```
http://localhost:5173/auth/callback
http://localhost:5173/*
```

For production, add:
```
https://yourdomain.com/auth/callback
https://yourdomain.com/*
```

### Step 3: Enable Phone Authentication (Optional)

1. Go to **Authentication** → **Providers**
2. Enable **Phone**
3. Choose SMS provider:
   - **Twilio** (recommended)
   - **MessageBird**
   - **Vonage**

#### Twilio Setup:
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your:
   - Account SID
   - Auth Token
   - Phone Number
3. Add to Supabase Phone provider settings

### Step 4: Test Authentication

Run your app:
```bash
npm run dev
```

Test each method:
- ✅ Email/Password (should work immediately)
- ✅ Google OAuth (after Step 1 complete)
- ✅ Phone OTP (after Step 3 complete)

## 🔍 Verify Setup

### Check if Google OAuth is working:
1. Click "Sign In"
2. Select any portal
3. Click "Sign in with Google"
4. Should redirect to Google login
5. After auth, should redirect back to your app

### Check if role assignment works:
1. Log in with any method
2. Open browser DevTools → Application → Local Storage
3. Should see `pendingRole` or `selectedRole` (temporarily)
4. After login, check Supabase Dashboard → Authentication → Users
5. Click on your user → User Metadata
6. Should see `role` field with selected portal

## 📝 Environment Variables

Your `.env` file should have:
```env
VITE_SUPABASE_URL=https://klmeojmzhpmifvlnovxi.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_c6OfhPS254GhSxEZdUEwxw_s6b-d5YE
```

## 🐛 Troubleshooting

### Google OAuth not working:
- Check redirect URL matches exactly
- Verify Google OAuth credentials in Supabase
- Check browser console for errors

### Phone OTP not sending:
- Verify SMS provider credentials
- Check phone number format (include country code)
- Verify Twilio/provider account has credits

### Role not assigned:
- Check browser localStorage for `selectedRole`
- Verify user metadata in Supabase Dashboard
- Check browser console for errors

## ✅ Success Checklist

- [ ] Google OAuth enabled in Supabase
- [ ] Redirect URLs configured
- [ ] Phone provider configured (optional)
- [ ] Environment variables set
- [ ] App running on `http://localhost:5173`
- [ ] Can select portal before login
- [ ] Can sign in with email/password
- [ ] Can sign in with Google
- [ ] Role assigned correctly
- [ ] Redirects to correct dashboard
- [ ] Logout clears session

## 🎯 Next Steps

After setup is complete:
1. Test all authentication methods
2. Verify role-based access control
3. Test logout functionality
4. Test browser back button behavior
5. Deploy to production
6. Update redirect URLs for production domain
