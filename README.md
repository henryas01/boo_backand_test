# Boo Backend API

This is the **Boo backend API**, built with **Node.js**, **TypeScript**, **Express**, and **MongoDB (MongoMemoryServer for development/testing)**.
It provides endpoints for managing **profiles**, **categories**, **MBTI**, **Enneagram**, **Zodiac**, and **comments** with full REST API functionality.

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)

---

## Features

- Manage user **profiles** with selected categories and personality data.
- Seed API for **categories**, **MBTI**, **Enneagram**, and **Zodiac**.
- Full CRUD for **comments**, including **like/unlike** functionality.
- Sorting and filtering support for comments (recent/best, by personality system).
- Unit testing with **Jest**
- Uses **MongoMemoryServer** for in-memory database testing.

---

## Technologies

- Node.js
- TypeScript
- Express
- MongoDB (via mongoose)
- MongoMemoryServer (for testing)
- EJS (for profile UI)
- Jest & Supertest (for unit tests)

---

## Project Structure

```text
src/
├── app.ts              # Express app configuration
├── server.ts           # Entry point
├── config.ts           # Configuration
├── routes/
│   ├── api/
│   │   ├── profile/    # Profile API routes
│   │   ├── categories/ # Categories API
│   │   ├── mbti/       # MBTI API
│   │   ├── enneagram/  # Enneagram API
│   │   ├── zodiac/     # Zodiac API
│   │   └── comments/   # Comments API
│   └── profile.ts      # Profile Web UI
├── models/             # Mongoose models
├── utils/              # Utility functions (resolveReferences, db connection)
├── views/              # EJS templates
├── test/               # Unit Test
