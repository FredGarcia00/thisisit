# ViralReel Studio - AI Video Creation SaaS Platform

A comprehensive SaaS application for creating viral short-form videos using AI avatars, automated script generation, and professional templates. Built with Next.js 15, Supabase, and integrated with leading AI services.

## 🚀 Features

### Core Functionality
- **AI-Powered Video Creation**: Generate engaging short-form videos from text prompts
- **AI Avatar Generation**: Create hyper-realistic avatars using HeyGen API integration
- **Automated Script Writing**: GPT-4o powered script generation optimized for viral content
- **Professional Voiceovers**: ElevenLabs integration for natural-sounding voiceovers
- **Video Rendering**: RunwayML integration for high-quality video production
- **Template System**: Pre-built templates for different content types

### User Management
- **Authentication**: Supabase Auth with email/password and Google OAuth
- **User Roles**: Creator and Admin role management
- **Profile Management**: Customizable user profiles and preferences
- **Subscription Plans**: Free, Pro, and Enterprise tiers with usage limits

### Dashboard & Analytics
- **Comprehensive Dashboard**: Real-time stats and video management
- **Usage Tracking**: Monitor monthly video creation limits
- **Analytics**: Video performance metrics and engagement data
- **Template Library**: Browse and manage video templates

## 🛠 Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern UI component library
- **Framer Motion**: Smooth animations and transitions

### Backend & Database
- **Supabase**: Backend-as-a-Service for auth, database, and storage
- **PostgreSQL**: Relational database with Row Level Security
- **Supabase Storage**: File storage for avatars and videos

### AI Services Integration
- **OpenAI GPT-4o**: Script generation and content optimization
- **HeyGen API**: AI avatar creation and customization
- **ElevenLabs**: Natural voice synthesis
- **RunwayML**: Video rendering and post-production

### Deployment & Infrastructure
- **Vercel**: Serverless deployment with edge functions
- **Vercel Analytics**: Performance monitoring
- **Stripe**: Subscription billing and payments

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- API keys for AI services (OpenAI, HeyGen, ElevenLabs, RunwayML)
- Stripe account for payments
- Vercel account for deployment

### Setup Instructions

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd viral-reel-studio
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # AI Service API Keys
   HEYGEN_API_KEY=your_heygen_api_key
   RUNWAY_API_KEY=your_runway_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   OPENAI_API_KEY=your_openai_api_key

   # Stripe Configuration
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # App Configuration
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

   # Vercel Cron Secret
   CRON_SECRET=your_secure_cron_secret
   ```

3. **Database Setup**
   
   Connect to your Supabase project and run the migration:
   ```sql
   -- Run the contents of supabase/migrations/create_core_schema.sql
   -- in your Supabase SQL editor
   ```

4. **Development Server**
   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` to see the application.

## 🚀 Deployment to Vercel

### Automatic Deployment
1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Configure Environment Variables**
   Add all environment variables in the Vercel dashboard under Settings > Environment Variables

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Manual Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on git push

### Vercel Configuration Benefits
- **Extended Function Timeouts**: Up to 5 minutes for video processing
- **Edge Functions**: Global distribution for better performance
- **Automatic Scaling**: Handle traffic spikes seamlessly
- **Built-in Analytics**: Monitor performance and usage
- **Cron Jobs**: Automated monthly usage reset

## 🏗 Project Structure

```
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── ai/             # AI service integrations
│   │   ├── videos/         # Video management
│   │   ├── templates/      # Template management
│   │   └── cron/           # Scheduled tasks
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Protected dashboard pages
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── dashboard/          # Dashboard components
│   ├── landing/           # Landing page components
│   ├── video/             # Video creation components
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── supabase/             # Database migrations
├── types/                # TypeScript type definitions
├── vercel.json           # Vercel configuration
└── public/               # Static assets
```

## 🔐 Authentication Flow

1. **Sign Up**: Users create accounts with email/password or Google OAuth
2. **Profile Creation**: Automatic profile generation with default settings
3. **Dashboard Access**: Protected routes require authentication
4. **Role Management**: Creator and Admin roles with different permissions

## 💳 Subscription Plans

### Free Plan
- 3 videos per month
- Basic AI avatars
- 5 template designs
- Standard quality export
- Community support

### Pro Plan ($19/month)
- Unlimited videos
- Premium AI avatars
- All template designs
- HD quality export
- Advanced analytics
- Priority support
- Custom branding
- API access

### Enterprise Plan (Custom)
- Everything in Pro
- Custom AI training
- White-label solution
- Dedicated support
- SLA guarantee
- Advanced integrations
- Team collaboration
- Custom features

## 🔧 API Integration Guide

### OpenAI GPT-4o Integration
```typescript
// Script generation
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ],
  max_tokens: 300,
  temperature: 0.8,
});
```

### HeyGen Avatar Creation
```typescript
// Avatar generation (mock implementation)
const avatar = await createAvatar({
  style: 'professional',
  description: 'Business attire, confident'
});
```

### ElevenLabs Voiceover
```typescript
// Voice synthesis (mock implementation)
const voiceover = await generateVoiceover({
  text: script,
  voice: 'male-professional',
  language: 'en'
});
```

## 📊 Database Schema

### Core Tables
- **profiles**: User profiles and subscription info
- **videos**: Video records and metadata
- **templates**: Video templates and configurations
- **avatars**: AI-generated avatar records
- **analytics**: Video performance metrics

### Security
- Row Level Security (RLS) enabled on all tables
- User-specific access policies
- Admin role privileges for management

## 🧪 Development

### Running Tests
```bash
npm run test
```

### Code Quality
```bash
npm run lint
npm run type-check
```

### Database Migrations
```bash
# Add new migration files to supabase/migrations/
# Run in Supabase SQL editor
```

## 📈 Production Optimizations

### Vercel-Specific Features
- **Function Timeouts**: Extended timeouts for AI processing
- **Edge Runtime**: Faster cold starts for API routes
- **Image Optimization**: Automatic image optimization
- **Analytics**: Built-in performance monitoring
- **Cron Jobs**: Automated maintenance tasks

### Performance Monitoring
- Monitor function execution times
- Track API usage and costs
- Set up alerts for errors
- Monitor database performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact support@viralreelstudio.com
- Check the documentation wiki

## 🔮 Roadmap

- [ ] Advanced video editing features
- [ ] Bulk video generation
- [ ] Social media scheduling
- [ ] Team collaboration features
- [ ] White-label solutions
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations

---

Built with ❤️ using Next.js, Supabase, Vercel, and AI technologies.