# SGMS Free Online Deployment Guide

This guide provides instructions for deploying the **Student Grade Management System (SGMS)** online using verified free-tier hosting providers and free cloud databases.

---

## 1. Architecture & Deployment Strategy

```
┌─────────────────────────────────┐
│     React + Vite Frontend       │  Hosted on Vercel / Netlify / GitHub Pages (Free Tier)
│   (HTML5, Tailwind, React 18)   │  Environment: VITE_API_BASE_URL=https://your-backend.onrender.com/api
└───────────────┬─────────────────┘
                │ HTTPS REST API (JSON)
                ▼
┌─────────────────────────────────┐
│    Spring Boot 3.3.4 (Java 21)  │  Hosted on Render / Koyeb / Railway (Free Tier)
│     Web / Security / JPA / PDF  │  Health Check: /api/health
└───────────────┬─────────────────┘
                │ JDBC SSL (MySQL Protocol)
                ▼
┌─────────────────────────────────┐
│     Cloud MySQL Database        │  Hosted on Aiven / TiDB Cloud / Clever Cloud (Free Tier)
│    (Persistent Relational DB)   │  Or Railway Free MySQL
└─────────────────────────────────┘
```

---

## 2. Recommended Free Tier Hosting Providers

| Layer | Provider | Free Tier Specification | Java 21 Support |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** *(Recommended)* | Unlimited bandwidth, global edge CDN, continuous deployment from GitHub | Static / Node |
| **Frontend** | **GitHub Pages** | Free static site hosting directly from repository | Static |
| **Backend** | **Render.com** *(Recommended)* | 512 MB RAM, free web service, native Docker & Java support | Native via Dockerfile or Java |
| **Backend** | **Koyeb** | Free nano instance, 512 MB RAM, native git builds | Native Docker / Java |
| **Backend** | **Railway** | $5 monthly free trial credits, auto-detects Maven / Java 21 | Native |
| **Database** | **Aiven for MySQL** | 1 Node, 5 GB storage, free tier MySQL 8 | Fully MySQL 8 compatible |
| **Database** | **TiDB Cloud** | Serverless free tier, 5 GB storage, MySQL 8 wire compatible | Fully MySQL 8 compatible |

---

## 3. Database Deployment (Free Managed MySQL)

### Option A: Aiven for MySQL (Free Tier)
1. Sign up at [Aiven.io](https://aiven.io).
2. Create a new service: select **MySQL** and choose the **Free Plan**.
3. Note the connection details provided in the Aiven console:
   * **Host:** `mysql-xxxx.aivencloud.com`
   * **Port:** e.g. `12345`
   * **Database:** `defaultdb` or `sgms_db`
   * **User:** `avnadmin`
   * **Password:** `generated-password`
   * **SSL Mode:** `REQUIRED`

### Option B: TiDB Cloud (Serverless Free Tier)
1. Sign up at [TiDB Cloud](https://tidbcloud.com).
2. Create a free **Serverless Cluster** (compatible with MySQL 8 syntax).
3. Obtain your connection string.

---

## 4. Backend Deployment (e.g. on Render.com)

1. Fork or push the SGMS repository to your GitHub account.
2. Sign in to [Render.com](https://render.com) and click **New Web Service**.
3. Connect your GitHub repository.
4. Set the following build settings:
   * **Root Directory:** `backend`
   * **Runtime:** `Docker` (or Java with Maven)
   * **Build Command:** `mvn clean package -DskipTests`
   * **Start Command:** `java -jar target/sgms-backend-1.0.0.jar`
5. Configure **Environment Variables** in the Render dashboard:

| Variable Name | Value Description | Example Value |
| :--- | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `mysql` |
| `SPRING_DATASOURCE_URL` | Cloud MySQL JDBC URL with SSL | `jdbc:mysql://<host>:<port>/<dbname>?useSSL=true` |
| `SPRING_DATASOURCE_USERNAME` | Cloud MySQL username | `avnadmin` |
| `SPRING_DATASOURCE_PASSWORD` | Cloud MySQL password | `<your-secret-password>` |
| `APP_JWT_SECRET` | 256-bit Hex or Base64 secret key | *(Generate a 64-char random hex)* |
| `APP_CORS_ALLOWED_ORIGINS` | Your frontend deployment URL | `https://your-sgms.vercel.app` |
| `APP_INSTITUTION_NAME` | Institutional header for PDF report cards | `Apex Institute of Science & Technology` |

6. Health Check Endpoint: Set health check path to `/api/health`.

> **Free Tier Sleep Note:** On Render's free tier, services spin down after 15 minutes of inactivity. The first request after sleep may take ~30-50 seconds to wake up. This is standard behavior across free hosting tiers.

---

## 5. Frontend Deployment (e.g. on Vercel)

1. Sign in to [Vercel](https://vercel.com) and select **Add New Project**.
2. Import your GitHub repository.
3. Configure the project settings:
   * **Framework Preset:** `Vite`
   * **Root Directory:** `frontend`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. Set **Environment Variable**:
   * Name: `VITE_API_BASE_URL`
   * Value: `https://your-render-backend.onrender.com/api`
5. Click **Deploy**.

---

## 6. GitHub Pages Deployment (Alternative Frontend)

If you prefer GitHub Pages:
1. In `frontend/vite.config.js`, set `base: '/repository-name/'`.
2. In GitHub repository settings, navigate to **Pages**, and choose GitHub Actions or `gh-pages` branch deployment.
3. Set GitHub Repository Secrets for `VITE_API_BASE_URL`.

---

## 7. Security Best Practices for Production

1. **Never commit secrets:** Never commit `.env` or cloud database credentials to Git. Use hosting dashboard secret managers.
2. **Restrict CORS:** Set `APP_CORS_ALLOWED_ORIGINS` strictly to your production frontend domain (e.g. `https://your-app.vercel.app`).
3. **Change Default Passwords:** Immediately update the administrator password upon first login in production.

