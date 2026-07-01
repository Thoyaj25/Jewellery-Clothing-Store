```markdown
# Ultimate Collections – Production E-Commerce Platform

A full-stack, production-ready e-commerce application for showcasing jewellery and clothing products. The project is built with **Next.js**, **TypeScript**, **Tailwind CSS**, **PostgreSQL (Neon)**, and deployed on **Vercel**. It demonstrates modern web development practices, database integration, authentication, and deployment workflows.

---

## Live Demo

**Application**

https://jewellery-clothing-store.vercel.app

**Source Code**

https://github.com/prasadpj509/Jewellery-Clothing-Store

---

# Project Overview

Ultimate Collections is designed as a scalable e-commerce platform that allows customers to browse products while providing administrators with tools to manage inventory through a PostgreSQL-backed dashboard.

The project focuses on:

- Modern Next.js App Router architecture
- PostgreSQL database integration
- REST API development
- Admin product management
- Audit logging
- Responsive UI
- Production deployment
- Secure environment configuration

---

# Features

## Customer Features

- Browse jewellery and clothing collections
- Product search and filtering
- Dynamic product detail pages
- Shopping cart
- Checkout workflow
- WhatsApp ordering
- Instagram integration
- Testimonials
- Responsive mobile-first design

---

## Product Categories

- Jewellery
- Sarees
- Kurtis
- Handbags
- Kids Wear

---

## Admin Features

- Secure admin dashboard
- Product CRUD operations
- PostgreSQL-backed inventory
- Audit logging
- Database health monitoring

---

## Audit Logging

Every administrative action is recorded, including:

- Product creation
- Product updates
- Product deletion
- Administrative operations

Each log stores:

- Action
- Product ID
- Administrator
- Timestamp
- Payload
- IP Address

---

# Technology Stack

## Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS

## Backend

- Next.js Route Handlers
- PostgreSQL
- Neon Database

## Authentication

- NextAuth.js

## Deployment

- Vercel

## Development Tools

- Git
- GitHub
- VS Code
- WSL (Ubuntu)

---

# Project Architecture

```

Browser
│
▼
Next.js Application
│
▼
Route Handlers (API)
│
▼
Neon PostgreSQL
│
▼
Vercel Deployment

```

---

# API Endpoints

## Products

```

GET /api/products

```

Supports:

- Product listing
- Product lookup
- Filtering
- Database retrieval

---

## Admin Audit

```

GET /api/admin/audit

```

Supports:

- Audit history
- Pagination
- Filtering

---

## Authentication

```

/api/auth/[...nextauth]

```

Provides administrator authentication.

---

## Database Health

```

GET /api/db-test

````

Verifies PostgreSQL connectivity.

---

# Database Schema

## products

Stores:

- Product Name
- Category
- Price
- Description
- Images

---

## admin_audit

Stores:

- Administrator
- Action
- Product ID
- Payload
- IP Address
- Timestamp

---

# Getting Started

## Clone Repository

```bash
git clone https://github.com/prasadpj509/Jewellery-Clothing-Store.git

cd Jewellery-Clothing-Store
````

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=

NEXTAUTH_SECRET=

ADMIN_USER=
ADMIN_PASS=

CONTACT_WHATSAPP=
INSTAGRAM_HANDLE=

NEXT_PUBLIC_CONTACT_WHATSAPP=
NEXT_PUBLIC_INSTAGRAM_HANDLE=
```

---

## Run Development Server

```bash
npm run dev
```

Application runs at:

```
http://localhost:3000
```

---

## Production Build

```bash
npm run build
```

---

## Start Production Server

```bash
npm start
```

---

# Deployment

The application is deployed on **Vercel** with:

* Automatic deployments from GitHub
* Environment variable management
* PostgreSQL hosted on Neon
* Production build validation

---

# DevOps Skills Demonstrated

## Version Control

* Git
* GitHub
* Feature Branch Workflow
* Pull Requests

## Cloud

* Vercel
* Neon PostgreSQL

## Databases

* PostgreSQL
* SQL
* Connection troubleshooting
* CRUD operations

## Application Deployment

* Production builds
* Environment configuration
* Runtime validation
* Deployment verification

## Linux

* Ubuntu (WSL)
* Process management
* Networking
* Shell scripting

## Troubleshooting

Resolved issues involving:

* PostgreSQL connectivity
* Environment variables
* Build failures
* Next.js routing
* Vercel deployment
* Runtime debugging

---

# Future Enhancements

* Payment Gateway Integration
* Razorpay
* Order Management
* Inventory Management
* Customer Accounts
* Wishlist
* Product Reviews
* Email Notifications
* Analytics Dashboard
* Role-Based Access Control

---

# Author

**Durga Prasad P. J.**

DevOps Engineer | Cloud & Full Stack Developer

## Skills

* AWS
* Docker
* Kubernetes
* Terraform
* Jenkins
* GitHub Actions
* Linux
* PostgreSQL
* Next.js
* TypeScript
* Vercel

GitHub

https://github.com/prasadpj509

LinkedIn

(Add your LinkedIn profile)

---

# Project Status

**Production Ready**

Successfully deployed on **Vercel** with **Neon PostgreSQL** backend, featuring dynamic APIs, secure administration, responsive UI, and production-grade deployment.

```
```

