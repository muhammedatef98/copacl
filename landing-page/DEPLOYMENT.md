# Landing Page Deployment Guide

This guide explains how to deploy the Copacl landing page to various free hosting platforms.

---

## Option 1: Netlify Drop (Easiest - No Account Required)

**Steps:**
1. Go to https://app.netlify.com/drop
2. Drag and drop the entire `landing-page` folder
3. You'll get a live URL instantly (e.g., `https://random-name-123.netlify.app`)
4. **Optional:** Create a free Netlify account to claim the site and customize the URL

**Pros:**
- ✅ No account required
- ✅ Instant deployment (< 30 seconds)
- ✅ Free SSL certificate
- ✅ Global CDN

**Cons:**
- ❌ Random URL (can be customized after creating account)
- ❌ Site expires after 24 hours without account

---

## Option 2: Vercel (Recommended for Long-term)

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to landing page: `cd /home/ubuntu/copacl/landing-page`
3. Deploy: `vercel --prod`
4. Follow prompts (create account if needed)

**Pros:**
- ✅ Free forever
- ✅ Custom domains supported
- ✅ Automatic HTTPS
- ✅ Edge network (fast globally)

**Cons:**
- ❌ Requires account creation

---

## Option 3: GitHub Pages (Free & Permanent)

**Steps:**
1. Create a new GitHub repository named `copacl-landing`
2. Push the landing-page folder:
   ```bash
   cd /home/ubuntu/copacl/landing-page
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/copacl-landing.git
   git push -u origin main
   ```
3. Go to repository Settings → Pages
4. Select `main` branch as source
5. Your site will be live at: `https://YOUR_USERNAME.github.io/copacl-landing/`

**Pros:**
- ✅ Free forever
- ✅ Version control included
- ✅ Custom domains supported
- ✅ No expiration

**Cons:**
- ❌ Requires GitHub account
- ❌ Takes 2-5 minutes to go live

---

## Option 4: Surge.sh (Simplest CLI)

**Steps:**
1. Install Surge: `npm i -g surge`
2. Deploy:
   ```bash
   cd /home/ubuntu/copacl/landing-page
   surge
   ```
3. Follow prompts (create account on first use)
4. Choose a subdomain (e.g., `copacl-app.surge.sh`)

**Pros:**
- ✅ Extremely simple
- ✅ Free SSL
- ✅ Custom subdomains

**Cons:**
- ❌ Limited to surge.sh domain (unless you pay)

---

## Option 5: Firebase Hosting

**Steps:**
1. Install Firebase CLI: `npm i -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Select `landing-page` as public directory
5. Deploy: `firebase deploy`

**Pros:**
- ✅ Google infrastructure
- ✅ Free SSL
- ✅ Custom domains
- ✅ Analytics included

**Cons:**
- ❌ Requires Google account
- ❌ More complex setup

---

## Recommended Workflow

For **quick testing**: Use **Netlify Drop** (Option 1)
For **permanent hosting**: Use **GitHub Pages** (Option 3) or **Vercel** (Option 2)

---

## Custom Domain Setup

After deploying to any platform, you can connect a custom domain (e.g., `copacl.app`):

1. **Buy domain** from Namecheap, GoDaddy, or Google Domains
2. **Add DNS records** (provided by hosting platform)
3. **Wait for propagation** (5 minutes to 48 hours)

---

## Current Files

The landing page folder contains:
- `index.html` - Main landing page
- `README.md` - Project documentation
- `DEPLOYMENT.md` - This file

All assets (icons, images) are referenced from the main project's `assets/` folder.

---

## Need Help?

- **Netlify Docs**: https://docs.netlify.com/
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Pages**: https://pages.github.com/
- **Surge Docs**: https://surge.sh/help/

---

**Created**: 2025-11-15  
**Project**: Copacl - Smart Clipboard Manager
