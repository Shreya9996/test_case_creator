# Test Case Creator - Deployment Guide

## 🚀 Vercel Deployment

This application is configured for full-stack deployment on Vercel.

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Environment Variables**: Configure these in Vercel dashboard

### Environment Variables (Vercel Dashboard)

Set these in your Vercel project settings under "Environment Variables":

#### Backend Environment Variables:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
NODE_ENV=production
```

#### Frontend Environment Variables:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=
```

### Deployment Steps

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist` (for frontend), `backend/` (for backend)

3. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all the variables listed above

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy both frontend and backend

### API Endpoints

After deployment, your APIs will be available at:
- Health Check: `https://your-app.vercel.app/api/health`
- Generate Tests: `https://your-app.vercel.app/api/ai/generate-tests`
- Get Test Cases: `https://your-app.vercel.app/api/ai/test-cases`
- Analytics: `https://your-app.vercel.app/api/ai/analytics`

### Troubleshooting

#### APIs Not Working

1. **Check Environment Variables**:
   - Ensure all required env vars are set in Vercel dashboard
   - Check Vercel function logs for missing variables

2. **CORS Issues**:
   - The app is configured to allow your Vercel domain
   - Check browser console for CORS errors

3. **Build Failures**:
   - Check Vercel build logs
   - Ensure all dependencies are listed in package.json

4. **Function Timeouts**:
   - Vercel has a 10-second timeout for serverless functions
   - AI requests might timeout - consider optimizing response times

#### Common Issues

- **404 on API calls**: Check that `vercel.json` routes are correct
- **Static files not loading**: Ensure frontend build completes successfully
- **Environment variables not working**: Use `VITE_` prefix for frontend variables

### Local Development

```bash
# Install all dependencies
npm run install:all

# Start backend (development)
npm run dev:backend

# Start frontend (development)
npm run dev:frontend

# Build frontend for production
npm run build:frontend
```

### Project Structure

```
├── backend/           # Express.js API server
│   ├── app.js        # Main application file
│   ├── routes/       # API routes
│   ├── services/     # Business logic (Gemini AI)
│   └── utils/        # Database utilities
├── frontend/         # React application
│   ├── src/          # Source code
│   └── dist/         # Built files (after npm run build)
├── vercel.json       # Vercel configuration
└── package.json      # Root package configuration
```