# Deployment Instructions

## Step 1: Push to GitHub

If you get "command not found" errors, try these commands in order:

```bash
# Check if git is available
git --version

# If git is not found, you may need to initialize the repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - ViralReel Studio"

# Set main branch
git branch -M main

# Add your GitHub repository as remote (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### Option B: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Deploy

## Step 3: Environment Variables

Add these environment variables in Vercel Dashboard:

### Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
CRON_SECRET=your_secure_cron_secret
```

### Optional Variables:
```
HEYGEN_API_KEY=your_heygen_api_key
RUNWAY_API_KEY=your_runway_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Step 4: Verify Deployment

1. Check that your site loads at your Vercel URL
2. Test user registration and login
3. Verify database connections work
4. Test the video creation flow

## Troubleshooting

### If you get "project not found":
1. Make sure you're logged into the correct Vercel account
2. Check that your GitHub repository is public or accessible
3. Try importing the project manually through Vercel dashboard

### If build fails:
1. Check the build logs in Vercel dashboard
2. Ensure all environment variables are set
3. Verify your Supabase project is accessible

### If functions timeout:
- The vercel.json file is configured with extended timeouts for AI operations
- Video rendering can take up to 5 minutes
- Avatar creation and voiceover generation have 60-second timeouts