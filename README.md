# 💰 SpendWise

> A full-stack personal expense tracking application built with React, Node.js, Express, and SQLite.

SpendWise is a simple and interactive expense management application that allows users to record, view, analyze, and delete their expenses. The project demonstrates the integration of a modern React frontend with a RESTful Express backend and SQLite database.

---

## 🚀 Live Demo

### Frontend
https://spendwise-orpin-one.vercel.app

### Backend API
https://spendwise-3soe.onrender.com

### API Endpoint
https://spendwise-3soe.onrender.com/api/expenses

---

## 📌 Features

- ➕ Add new expenses
- 📋 View all recorded expenses
- 🗑️ Delete expenses
- 💰 Track total spending
- 📊 Categorize expenses
- 📈 Real-time spending aggregation
- 🎯 Category-wise budget tracking
- 📅 Store transaction dates
- 🔄 Refresh expense records from the database
- 🌐 REST API architecture
- 🔒 Parameterized SQL queries to prevent SQL injection
- 📱 Responsive React interface
- ☁️ Cloud deployment with Vercel and Render

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- Tailwind CSS
- Fetch API

### Backend

- Node.js
- Express.js
- CORS
- REST API

### Database

- SQLite3

### Deployment

- Vercel — Frontend
- Render — Backend

### Development Tools

- Git
- GitHub
- VS Code
- npm

---

## 🏗️ Project Architecture

```text
SpendWise
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── spendwise.db
│
└── README.md



                 ┌──────────────────────┐
                 │      React UI        │
                 │      Frontend        │
                 └──────────┬───────────┘
                            │
                            │ HTTP Requests
                            ▼
                 ┌──────────────────────┐
                 │    Express.js API    │
                 │       Backend        │
                 └──────────┬───────────┘
                            │
                            │ SQL Queries
                            ▼
                 ┌──────────────────────┐
                 │      SQLite DB       │
                 │    spendwise.db      │
                 └──────────────────────┘