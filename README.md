# GlimmerWave

A modern, production-ready social media application built with React, TypeScript, Appwrite, React Query, and Tailwind CSS.

---

## 🚀 Features
- User authentication (Sign up, Sign in, Email verification, Forgot/Reset password)
- Create, edit, delete, and view posts with image uploads
- Like, save, and comment on posts
- View user profiles and saved posts
- Responsive, modern UI with dark mode
- Robust error handling and toast notifications
- Protected routes and guest restrictions
- Real-time updates (where supported)

---

## 🛠️ Tech Stack
- **Frontend:** React 18, TypeScript, React Router DOM, React Query (TanStack Query), React Hook Form, Zod
- **Backend:** Appwrite (Cloud or Self-hosted)
- **Styling:** Tailwind CSS
- **File Uploads:** Appwrite Storage, react-dropzone

---

## ⚡ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/GlimmerWave.git
cd GlimmerWave
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your Appwrite credentials:
```env
VITE_APPWRITE_ENDPOINT=https://<your-appwrite-endpoint>
VITE_APPWRITE_PROJECT_ID=<your-project-id>
VITE_APPWRITE_DATABASE_ID=<your-database-id>
VITE_APPWRITE_USER_COLLECTION_ID=<your-user-collection-id>
VITE_APPWRITE_POST_COLLECTION_ID=<your-post-collection-id>
VITE_APPWRITE_SAVE_COLLECTION_ID=<your-save-collection-id>
VITE_APPWRITE_COMMENTS_COLLECTION_ID=<your-comments-collection-id>
VITE_APPWRITE_STORAGE_ID=<your-storage-id>
```

### 4. Appwrite Setup
- Create a new project in Appwrite (Cloud or self-hosted).
- Add Database and create collections for users, posts, saves, and comments.
- Add Storage bucket for file uploads.
- Set appropriate permissions for collections and storage (read/write for users, guests as needed).
- Enable email authentication and configure SMTP for email verification and password reset.
- Update the environment variables above with your Appwrite project details.

### 5. Run the App
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧩 Project Structure
```
GlimmerWave/
  src/
    _auth/           # Auth pages and layouts
    _root/           # Main app pages
    components/      # Shared, UI, and form components
    constants/       # App constants
    context/         # React context (Auth)
    lib/             # Appwrite API, React Query, utils
    types/           # TypeScript types
    Hooks/           # Custom hooks
    public/          # Static assets
```

---

## 🐞 Troubleshooting
- **401 Unauthorized:** Check Appwrite permissions and session state.
- **Image not loading:** Use `/view` endpoint for images on Appwrite free plan.
- **Rate limit (429):** Wait a few minutes before retrying sign-in.
- **CORS issues:** Add your frontend URL to Appwrite project's CORS settings.
- **Environment errors:** Ensure all required variables are set in `.env.local`.

---

## 🤝 Contributing
1. Fork the repo and create your branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m 'Add some feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📄 License
This project is licensed under the MIT License.
