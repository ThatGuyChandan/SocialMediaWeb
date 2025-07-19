# Appwrite Fixes for Your Issues

## Issues You're Experiencing:

1. **User verification required** - Users need to be verified in Appwrite
2. **Permission scope error** - Users don't have proper permissions  
3. **File extension error** - Storage bucket doesn't allow your file types
4. **Session management** - Using localStorage instead of secure domain

## ✅ Fix 1: Disable Email Verification (Development)

**In Appwrite Console:**
1. Go to **Auth** → **Settings**
2. **Disable** "Email Verification" (turn it OFF)
3. This will allow users to sign up and immediately use the app

## ✅ Fix 2: Storage Bucket Configuration

**In Appwrite Console:**
1. Go to **Storage** → Your bucket
2. Click **Settings** → **File Security**
3. **Add these file extensions:**
   ```
   jpg, jpeg, png
   ```
4. **Set max file size:** `5MB`
5. **Save settings**

## ✅ Fix 3: Collection Permissions

**For each collection (users, posts, saves):**
1. Go to **Databases** → Your database → Collections
2. Click on each collection
3. Go to **Permissions**
4. **Add these rules:**
   ```
   Create: role:all
   Read: role:all  
   Update: role:all
   Delete: role:all
   ```

## ✅ Fix 4: Storage Bucket Permissions

**For your storage bucket:**
1. Go to **Storage** → Your bucket
2. Go to **Permissions**
3. **Add these rules:**
   ```
   Create: role:all
   Read: role:all
   Update: role:all
   Delete: role:all
   ```

## ✅ Fix 5: Authentication Settings

**In Appwrite Console:**
1. Go to **Auth** → **Settings**
2. **Enable** "Email/Password" authentication
3. **Disable** "Email Verification" (for development)
4. **Platforms** → Add Web Platform:
   - Name: `GlimmerWave Web`
   - Hostname: `localhost`

## ✅ Fix 6: Environment Variables Check

**Make sure your `.env.local` has:**
```env
VITE_APPWRITE_PROJECTID=your_project_id
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
VITE_APPWRITE_DATABASE=your_database_id
VITE_APPWRITE_STORAGE=your_storage_id
VITE_APPWRITE_USERS=your_users_collection_id
VITE_APPWRITE_POSTS=your_posts_collection_id
VITE_APPWRITE_SAVES=your_saves_collection_id
```

## ✅ Fix 7: Code Changes Applied

**Already fixed in your code:**
1. ✅ **Auto-login after signup** - Users are automatically signed in
2. ✅ **File extension limits** - Only JPG, PNG allowed
3. ✅ **Better error handling** - Clear error messages

## 🧪 Test Your Fixes

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Clear browser cache and localStorage**

3. **Try creating a new account** - should work without verification

4. **Try uploading an image** - should work with JPG/PNG files

5. **Try creating a post** - should work without permission errors

## 🔍 If Still Having Issues

### **Check Browser Console:**
- Look for: ✅ "Environment variables loaded successfully"
- Look for: ✅ "Appwrite client initialized successfully"
- Look for: ✅ "User logged in: true"

### **Common Collection ID Issues:**
1. Go to **Databases** → Your database → Collections
2. Click on each collection
3. Copy the **Collection ID** (not the name)
4. Update your `.env.local` with the correct IDs

### **Storage Bucket Issues:**
1. Make sure your storage bucket name matches `VITE_APPWRITE_STORAGE`
2. Check that file extensions are allowed
3. Verify permissions are set to `role:all`

## 🚀 Expected Results

After applying these fixes:
- ✅ Users can sign up and immediately use the app
- ✅ No email verification required
- ✅ File uploads work with JPG/PNG
- ✅ Posts can be created without permission errors
- ✅ No more "missing scope" errors

## 📝 Quick Checklist

- [ ] Disabled email verification in Appwrite
- [ ] Added file extensions to storage bucket
- [ ] Set collection permissions to `role:all`
- [ ] Set storage permissions to `role:all`
- [ ] Updated environment variables
- [ ] Restarted development server
- [ ] Cleared browser cache
- [ ] Tested user signup
- [ ] Tested file upload
- [ ] Tested post creation 