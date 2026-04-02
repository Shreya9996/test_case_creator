# Test Case Creator

A full-stack AI-powered test case generation application built with React, Express, and Google Gemini AI.

## Features

- 🤖 AI-powered test case generation using Google Gemini
- 📊 Analytics dashboard with test case statistics
- 📝 Test case history and management
- 🔐 User authentication with Supabase
- 🎨 Modern UI with Tailwind CSS
- 🚀 Deployed on Vercel

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, Google Gemini AI
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Authentication**: Supabase Auth

## Prerequisites

- Node.js 18+
- npm or yarn
- Vercel CLI (optional)
- Supabase account
- Google Gemini API key

## Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd test-case-creator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Fill in your environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`

4. **Start development servers**
   ```bash
   # Backend
   npm run dev:backend

   # Frontend (in another terminal)
   npm run dev:frontend
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Vercel Deployment

### Step 1: Prepare Your Project

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

### Step 2: Set Environment Variables in Vercel

In your Vercel dashboard or using CLI:

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GEMINI_API_KEY
vercel env add GEMINI_MODEL
```

### Step 3: Deploy

```bash
# Deploy to production
npm run vercel-deploy

# Or use Vercel CLI directly
vercel --prod
```

### Step 4: Configure Domain (Optional)

In Vercel dashboard, you can:
- Set up a custom domain
- Configure environment variables
- Monitor deployment logs

## Project Structure

```
test-case-creator/
├── api/                    # Vercel serverless functions
│   └── index.js           # Main API entry point
├── backend/               # Express backend
│   ├── app.js            # Express app setup
│   ├── src/
│   │   └── server.js     # Development server
│   ├── routes/
│   │   └── aiRoutes.js   # AI API routes
│   ├── services/
│   │   └── geminiService.js # Gemini AI service
│   ├── config/
│   │   └── supabaseClient.js # Supabase config
│   └── utils/
│       └── supabaseUtils.js # Database utilities
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── utils/       # Frontend utilities
│   │   └── App.jsx      # Main app component
│   ├── public/          # Static assets
│   └── package.json     # Frontend dependencies
├── vercel.json           # Vercel configuration
├── package.json          # Root package.json
└── .env.example         # Environment variables template
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/ai/generate-tests` - Generate test cases
- `GET /api/ai/test-cases` - Get test case history
- `DELETE /api/ai/test-cases/:id` - Delete test case
- `GET /api/ai/analytics` - Get analytics data

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_URL` | Supabase project URL (server) | Yes |
| `SUPABASE_KEY` | Supabase service key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `GEMINI_MODEL` | Gemini model to use | No (defaults to gemini-1.5-flash) |

## Database Schema

The application uses Supabase with the following tables:

- `test_cases` - Generated test cases
- `chat_history` - AI chat history
- `user_profiles` - User profiles (via Supabase Auth)

## Troubleshooting

### Common Deployment Issues

1. **Missing Environment Variables**
   - Ensure all required environment variables are set in Vercel dashboard
   - Check variable names match exactly

2. **Build Failures**
   - Verify all dependencies are listed in package.json files
   - Check Node.js version compatibility

3. **API Timeouts**
   - Vercel has a 30-second timeout for serverless functions
   - AI requests might timeout for complex prompts

4. **CORS Issues**
   - CORS is configured to allow all origins in production
   - Check browser console for CORS errors

### Local Development Issues

1. **Port Conflicts**
   - Backend runs on port 3000
   - Frontend runs on port 5173

2. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in all required values

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

ISC License