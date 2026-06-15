# Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
Ensure all required environment variables are set:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `RESEND_API_KEY`
- [ ] `EMAIL_FROM`
- [ ] `NEXT_PUBLIC_APP_URL`

### 2. Database Setup

1. Run `database/schema.sql` in Supabase SQL Editor
2. Run `database/setup-storage.sql` for file upload buckets
3. (Optional) Run `database/seed-demo-data.sql` for testing

### 3. Supabase Configuration

**Authentication:**
- Go to Authentication → Providers
- Enable Email provider
- (Optional) Enable Google OAuth and configure credentials

**URL Configuration:**
- Site URL: `https://your-domain.com`
- Redirect URLs: `https://your-domain.com/auth/callback`

**Storage:**
- Buckets `avatars`, `portfolio`, `service-images` should be created and public

### 4. Stripe Setup

1. Create webhook endpoint:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
2. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 5. Email Configuration

1. Verify domain in Resend
2. Set `EMAIL_FROM` to verified email address

## Deploy to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Production-ready deployment"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Add Environment Variables

In Vercel project settings, add all environment variables from `.env.local`

### Step 4: Deploy

Click "Deploy" - Vercel will build and deploy your application

### Step 5: Post-Deployment

1. **Update Supabase redirect URLs** with your Vercel domain
2. **Update Stripe webhook URL** with your Vercel domain
3. **Update `NEXT_PUBLIC_APP_URL`** environment variable in Vercel
4. **Test the application**:
   - Sign up/login
   - Upload avatar
   - Create freelancer profile
   - Post a job
   - Send a message
   - Make a test payment

## Deploy to Custom Server

### Requirements
- Node.js 20+
- PM2 or similar process manager
- Nginx or similar reverse proxy
- SSL certificate

### Build

```bash
npm run build
```

### Start

```bash
npm start
# Or with PM2:
pm2 start npm --name "project-ace" -- start
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring

### Vercel

- Built-in analytics and logs in Vercel dashboard
- Set up alerts for errors

### Supabase

- Monitor database performance
- Check auth logs
- Monitor storage usage

### Stripe

- Monitor webhook delivery
- Check for failed payments
- Review dispute notifications

## Troubleshooting

### Build Errors

**Error: Module not found**
```bash
npm install
npm run build
```

**TypeScript errors**
```bash
npm run type-check
```

### Runtime Errors

**Supabase connection issues**
- Verify environment variables
- Check Supabase project status
- Review RLS policies

**Stripe webhook failures**
- Verify webhook secret
- Check webhook URL is accessible
- Review Stripe dashboard for delivery attempts

**Email not sending**
- Verify Resend API key
- Check domain verification
- Review sending limits

### Performance Issues

**Slow page loads**
- Enable caching in Next.js config
- Optimize images
- Review database queries

**High database load**
- Add indexes (already in schema.sql)
- Review query patterns
- Consider connection pooling

## Scaling

### Database
- Upgrade Supabase plan for more connections
- Enable connection pooling
- Add read replicas if needed

### Application
- Use Vercel Pro for more concurrent builds
- Enable Edge Functions for global distribution
- Implement Redis caching for frequently accessed data

### Storage
- Upgrade Supabase storage plan
- Implement CDN for static assets
- Optimize image sizes

## Backup Strategy

### Database
- Supabase provides automatic daily backups
- Enable Point-in-Time Recovery (PITR) for Pro plans
- Export critical data regularly

### Files
- Supabase Storage has built-in redundancy
- Consider backing up to separate cloud storage

## Security Checklist

- [ ] All environment variables are secret
- [ ] RLS policies are enabled on all tables
- [ ] Stripe webhooks verify signatures
- [ ] File uploads are validated (size, type)
- [ ] Rate limiting is configured
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] Input validation on all forms
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (automatic in Next.js)

## Support

After deployment, monitor:
- Error logs
- User feedback
- Payment failures
- Email delivery rates
- API response times

Set up alerts for critical issues.
