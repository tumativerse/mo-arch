#!/bin/bash
# Quick deployment status check for mo-arch

echo "📊 Mo-Arch Deployment Status"
echo "================================"
echo ""

# Check latest deployments
echo "🚀 Recent Deployments:"
vercel ls --yes 2>&1 | head -8

echo ""
echo "🔗 Production URLs:"
echo "  • https://mo-arch.tumati.me (custom domain)"
echo "  • https://mo-arch.vercel.app (Vercel domain)"
echo ""

# Check if site is live
echo "✅ Site Health Check:"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://mo-arch.tumati.me)
if [ "$HTTP_CODE" = "200" ]; then
  echo "  ✓ mo-arch.tumati.me is live (HTTP $HTTP_CODE)"
else
  echo "  ✗ mo-arch.tumati.me returned HTTP $HTTP_CODE"
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://mo-arch.tumati.me/development/quality-gates)
if [ "$HTTP_CODE" = "200" ]; then
  echo "  ✓ Quality Gates page is accessible"
else
  echo "  ✗ Quality Gates page error (HTTP $HTTP_CODE)"
fi

echo ""
echo "💡 Useful Commands:"
echo "  vercel --prod              Deploy to production now"
echo "  vercel ls                  List all deployments"
echo "  vercel inspect <url>       Get deployment details"
echo "  vercel logs <url>          View deployment logs"
echo ""
