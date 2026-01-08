# OpenAI Domain Allowlist Configuration Guide (T-326)

## Overview

OpenAI ChatKit requires domain allowlist configuration to work in production. This ensures only authorized domains can use your OpenAI API key.

## Prerequisites

1. OpenAI account with API access
2. Production frontend URL (or localhost for testing)
3. OpenAI API key with GPT-4o access

## Configuration Steps

### Step 1: Deploy Frontend (or Use Localhost)

**For Production:**
```bash
cd frontend
npm run build
# Deploy to Vercel, Netlify, or your hosting provider
# Note your production URL: https://your-app.vercel.app
```

**For Development/Testing:**
```
Use: http://localhost:3000
```

### Step 2: Access OpenAI Platform

1. Navigate to: https://platform.openai.com
2. Sign in to your account
3. Go to: **Settings** → **Organization** → **Security**
4. Find: **Domain Allowlist** section

### Step 3: Add Domain to Allowlist

1. Click **"Add domain"** button
2. Enter your domain:
   - Production: `https://your-app.vercel.app` (no trailing slash)
   - Development: `http://localhost:3000`
3. Click **"Save"**

**Important Notes:**
- Do NOT include trailing slash
- Include protocol (http:// or https://)
- Wildcards not supported
- Add both www and non-www if needed

### Step 4: Get Domain Key (Optional)

If using ChatKit's domain verification:

1. In Domain Allowlist settings
2. Click on your domain
3. Copy the **Domain Key**
4. Add to frontend environment variables

**frontend/.env.local:**
```env
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=dk-your-domain-key-here
```

### Step 5: Verify Configuration

**Test the setup:**

1. Restart frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open chat interface: http://localhost:3000/en/chat

3. Send a test message: "Add a task to test domain allowlist"

4. Check for errors:
   - ✅ Success: Message processed, task created
   - ❌ Error: "Domain not allowed" → Check allowlist configuration

### Step 6: Production Deployment

**After deploying to production:**

1. Add production domain to allowlist
2. Update environment variables on hosting platform
3. Redeploy frontend
4. Test chat functionality in production

## Troubleshooting

### Error: "Domain not allowed"

**Cause:** Domain not in allowlist or incorrect format

**Solution:**
1. Verify domain format (no trailing slash)
2. Check protocol (http vs https)
3. Wait 5 minutes for changes to propagate
4. Clear browser cache

### Error: "Invalid API key"

**Cause:** API key not set or incorrect

**Solution:**
1. Check `OPENAI_API_KEY` in backend/.env
2. Verify key is valid on OpenAI platform
3. Ensure key has GPT-4o access
4. Restart backend server

### Error: "CORS policy blocked"

**Cause:** CORS not configured for domain

**Solution:**
1. Add domain to `CORS_ORIGINS` in backend/.env
2. Format: `http://localhost:3000,https://your-app.vercel.app`
3. Restart backend server

### ChatKit not loading

**Cause:** Domain key not configured

**Solution:**
1. Get domain key from OpenAI platform
2. Add to `NEXT_PUBLIC_OPENAI_DOMAIN_KEY`
3. Rebuild frontend

## Multiple Domains

To support multiple domains (dev, staging, production):

**OpenAI Platform:**
```
http://localhost:3000
https://staging.your-app.com
https://your-app.com
```

**Backend CORS:**
```env
CORS_ORIGINS=http://localhost:3000,https://staging.your-app.com,https://your-app.com
```

## Security Best Practices

1. **Never expose API key in frontend**
   - Keep `OPENAI_API_KEY` in backend only
   - Use domain allowlist for additional security

2. **Use environment variables**
   - Never commit API keys to git
   - Use `.env` files (gitignored)

3. **Rotate keys regularly**
   - Generate new API keys periodically
   - Update in all environments

4. **Monitor usage**
   - Check OpenAI dashboard for unusual activity
   - Set up usage alerts

5. **Rate limiting**
   - Implement rate limiting on backend
   - Prevent abuse and cost overruns

## Cost Management

**Monitor OpenAI usage:**

1. Go to: https://platform.openai.com/usage
2. Check daily/monthly usage
3. Set up billing alerts
4. Consider usage limits

**Estimated costs (GPT-4o):**
- Input: $2.50 per 1M tokens
- Output: $10.00 per 1M tokens
- Average chat: ~500 tokens = $0.005

**Cost optimization:**
- Use GPT-4o-mini for simpler tasks
- Implement caching for common queries
- Set max_tokens limit
- Monitor and optimize prompts

## Testing Checklist

- [ ] Domain added to allowlist
- [ ] Domain key configured (if using ChatKit)
- [ ] CORS configured for domain
- [ ] Frontend deployed and accessible
- [ ] Backend API accessible from frontend
- [ ] Chat interface loads correctly
- [ ] Messages send successfully
- [ ] Agent responds appropriately
- [ ] Tool calls execute correctly
- [ ] No CORS errors in console
- [ ] No domain allowlist errors

## Production Checklist

- [ ] Production domain added to allowlist
- [ ] Environment variables set on hosting platform
- [ ] HTTPS enabled (required for production)
- [ ] API key secured (not in frontend code)
- [ ] CORS configured for production domain
- [ ] Rate limiting implemented
- [ ] Usage monitoring enabled
- [ ] Billing alerts configured
- [ ] Error logging enabled
- [ ] Performance monitoring enabled

## Support Resources

- **OpenAI Documentation:** https://platform.openai.com/docs
- **ChatKit Docs:** https://platform.openai.com/docs/chatkit
- **API Reference:** https://platform.openai.com/docs/api-reference
- **Community Forum:** https://community.openai.com

## Notes

- Domain allowlist changes may take 5-10 minutes to propagate
- Test in development before deploying to production
- Keep API keys secure and never commit to version control
- Monitor usage to avoid unexpected costs
- Consider implementing rate limiting for production use

---

**Configuration Status:** ⚠️ Requires manual setup in OpenAI Platform

**Next Steps:**
1. Add your domain to OpenAI allowlist
2. Configure environment variables
3. Test chat functionality
4. Deploy to production
