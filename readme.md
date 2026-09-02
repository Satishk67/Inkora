# ✍️ Inkora

> A full-stack blogging platform built with **Node.js, Express.js, MongoDB & EJS**.

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)](https://www.mongodb.com/)
[![EJS](https://img.shields.io/badge/EJS-Templating-yellow)](https://ejs.co/)

## 🚀 Features

| Feature | Description |
|---|---|
| 🔐 Authentication | JWT + cookie-based authentication |
| 👤 Users | User accounts, profiles & dashboards |
| 📝 Blogs | Create, view & manage blog posts |
| 🖼️ Uploads | Blog image uploads using Multer |
| 💬 Comments | Add and display comments on blogs |
| 🗂️ Categories | Organize blogs by category |
| 🗄️ Database | MongoDB with Mongoose |
| 🎨 UI | Server-side rendered EJS views |
| 🛡️ Middleware | Authentication & database middleware |

## 🏗️ Architecture

```text
                         ┌───────────────┐
                         │    Browser    │
                         └───────┬───────┘
                                 │
                              HTTP
                                 │
                                 ▼
                         ┌───────────────┐
                         │    Express    │
                         │     app.js    │
                         └───────┬───────┘
                                 │
                         ┌───────▼───────┐
                         │   Middleware  │
                         │ Auth / Parser │
                         └───────┬───────┘
                                 │
                         ┌───────▼───────┐
                         │     Routes    │
                         │ User / Blog   │
                         │   / Comment   │
                         └───────┬───────┘
                                 │
                         ┌───────▼───────┐
                         │  Controllers  │
                         └───────┬───────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
             ┌────────────┐            ┌────────────┐
             │  Services  │            │   Models   │
             │    Auth    │            │ User/Blog/ │
             └────────────┘            │   Comment  │
                                       └──────┬─────┘
                                              │
                                              ▼
                                       ┌────────────┐
                                       │  MongoDB   │
                                       └──────┬─────┘
                                              │
                                              ▼
                                       ┌────────────┐
                                       │    EJS     │
                                       │   Views    │
                                       └──────┬─────┘
                                              │
                                              ▼
                                           Browser
```

## 🔄 Request Workflow
```text
Client
  │
  ▼
Express
  │
  ▼
Middleware ──► Authentication / Request Parsing
  │
  ▼
Route
  │
  ▼
Controller
  │
  ├──► Service
  │
  └──► Model ──► MongoDB
                  │
                  ▼
              Controller
                  │
                  ▼
                 EJS
                  │
                  ▼
               Response
```

## 🔐 Authentication workflow

```text

Login
  │
  ▼
User Route
  │
  ▼
User Controller
  │
  ▼
Auth Service
  │
  ▼
Validate User ──► MongoDB
  │
  ▼
Generate JWT
  │
  ▼
HTTP Cookie
  │
  ▼
Browser
  │
  ▼
Protected Request
  │
  ▼
Auth Middleware
  │
  ├── Valid ──► req.user ──► Route
  │
  └── Invalid ──► Login / Guest Flow
```

## 🗂️ Project Structure
```text
Inkora/
├── controllers/
│   ├── blog.js
│   ├── comment.js
│   └── user.js
├── middlewares/
│   ├── authenticateUser.js
│   └── connectMongo.js
├── models/
│   ├── blog.js
│   ├── comment.js
│   └── user.js
├── routes/
│   ├── blog.js
│   ├── comment.js
│   └── user.js
├── services/
│   └── auth.js
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── uploads/
├── views/
│   ├── partials/
│   ├── blogForm.ejs
│   ├── blogPage.ejs
│   ├── home.ejs
│   ├── loginPage.ejs
│   ├── signupPage.ejs
│   ├── userDashboard.ejs
│   ├── viewBlog.ejs
│   └── serverError.ejs
├── app.js
├── package.json
└── .env
```
## 🔗 Data Model

```text

        ┌───────────┐                   ┌───────────┐
        │           |                   │           |
        |   User    |<----createdBy-----|   Blog    | 
        |           │                   |           │
        └─────┬─────┘                   └─────┬─────┘
              |                               |
              |                               |
          createdBy                         blogId            
              |         ┌──────────────┐      |               
              |_________|              |______|      
                        |   Comment    |
                        |              │
                        └─────┬────────┘
```

## 🛠️ Tech Stack

| Technology | Purpose |
|:---|:---|
| **Node.js** | JavaScript runtime |
| **Express.js** | Backend web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **EJS** | Server-side templating |
| **JWT** | Authentication |
| **Cookie Parser** | Cookie management |
| **Multer** | File uploads |
| **dotenv** | Environment variables |
| **Nodemon** | Development server |

## ⚙️ Setup

**Prerequisites:** Node.js · MongoDB / MongoDB Atlas · Git

### Clone & Install

```bash
git clone https://github.com/Satishk67/Inkora.git
cd Inkora
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=8001
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run the Application

```bash
# Development
npm run dev

# Production
npm start
```

The application will be available at `http://localhost:8001`.

> **Note:** Make sure MongoDB is running and never commit your `.env` file.