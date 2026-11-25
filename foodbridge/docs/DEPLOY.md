# FoodBridge Production Deployment & SPA Fallback Guide

This document describes how to deploy the unified FoodBridge React Single Page Application (SPA) across different production environments, ensuring that HTML5 client-side routing, API proxies, and legacy `.html` redirects operate smoothly.

---

## 1. Netlify Deployment

Netlify requires a `_redirects` file in the build output root (`dist/` or `public/_redirects`). FoodBridge includes this at `web-portal/public/_redirects`.

### Netlify `_redirects` Rules:
```text
# 1. Permanent 301 redirects for legacy multi-page links
/portal.html    /portal    301!
/courier.html   /courier   301!
/donate.html    /donate    301!
/ngo-hub.html   /ngo       301!
/app.html       /portal    301!
/landing.html   /          301!

# 2. SPA client-side fallback rule for all other paths
/*              /index.html 200
```

---

## 2. Vercel Deployment

Vercel utilizes `vercel.json` located in the root or web-portal directory.

### `vercel.json` Configuration:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/portal.html", "destination": "/portal" },
    { "source": "/courier.html", "destination": "/courier" },
    { "source": "/donate.html", "destination": "/donate" },
    { "source": "/ngo-hub.html", "destination": "/ngo" },
    { "source": "/app.html", "destination": "/portal" },
    { "source": "/landing.html", "destination": "/" },
    { "source": "/api/(.*)", "destination": "http://localhost:4000/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 3. Nginx Server Configuration

When hosting on a Linux VPS, Docker container, or Kubernetes with Nginx:

```nginx
server {
    listen 80;
    server_name foodbridge.org www.foodbridge.org;
    root /var/www/foodbridge/web-portal/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # Static Assets Caching
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, no-transform, immutable";
    }

    # Legacy .html Redirects
    location = /portal.html {
        return 301 /portal;
    }
    location = /courier.html {
        return 301 /courier;
    }
    location = /donate.html {
        return 301 /donate;
    }
    location = /ngo-hub.html {
        return 301 /ngo;
    }
    location = /app.html {
        return 301 /portal;
    }
    location = /landing.html {
        return 301 /;
    }

    # Backend API Reverse Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # SPA Client-Side Routing Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 4. Environment Variables

| Variable | Target | Purpose | Default |
|---|---|---|---|
| `PORT` | Backend | HTTP port for the Express API server | `4000` |
| `DATABASE_URL` | Backend | PostgreSQL connection string | `postgres://localhost:5432/foodbridge` |
| `VITE_API_URL` | Frontend | Base URL for API requests (empty = relative proxy) | `""` |
| `VITE_GAME_URL` | Frontend | External 2D Food Rescue Runner Game link | `http://localhost:5173` |

---

## 5. Build Verification

Build command:
```bash
npm run build
```
Verify that `web-portal/dist/` contains:
- `index.html` (SPA single entry point)
- `assets/` (bundled JS & CSS)
- `_redirects` (copied automatically from `public/` by Vite)
