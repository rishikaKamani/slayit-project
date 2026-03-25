# Slayit Full-Stack Project

This is a starter full-stack implementation for your habit tracker idea.

## Stack

- **Frontend:** React + Vite
- **Backend:** Spring Boot 3 + Spring Security + JWT + H2

## Features included

- Welcome page with your app concept
- User signup and login
- Add habits by category
- Dashboard for multiple habits
- Daily log as done or missed
- Streaks, rewards and sarcastic feedback

## Run locally

### 1) Backend

```bash
cd backend
mvn spring-boot:run
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:8080`

## What you still need to improve

This is a solid working base, not your final competition-ready masterpiece. You still need to add:

- proper database like MySQL or PostgreSQL
- password reset and email verification
- habit calendar view
- edit/delete habit
- charts and analytics
- sound effects, emojis, richer reward animations
- deployment configs
