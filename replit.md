# Athar (أثر) — Smart Saudi Heritage Guide

## Overview
An AI-powered web application that identifies Saudi Arabian heritage landmarks from photos and provides historical narratives, event timelines, and image galleries in both Arabic and English.

## Design System
- **Primary color (clay):** `#5c3d1e` — replaces green, inspired by Diriyah mud-brick architecture
- **Medium clay:** `#7d5232`
- **Light clay:** `#f0e6d6`
- **Gold:** `#C5A028` — accents, timeline, UNESCO badge
- **Icons:** Material Icons (Google) — no emoji icons
- **Logo:** `/public/athar-logo.png` — shown in a white badge in the navbar

## Architecture

### Frontend (React + Vite)
- **Location:** `frontend/`
- **Port:** 5000
- **Tech:** React 18, Vite, Tailwind CSS, React Router v6
- **Key pages:** HomePage (upload), ResultPage (landmark details), RegionsPage (explore regions)
- **API config:** `frontend/.env` — `VITE_API_URL=http://localhost:8000`

### Backend (FastAPI + Python)
- **Location:** `backend/`
- **Port:** 8000
- **Tech:** FastAPI, Uvicorn, Groq SDK (llama-4-scout vision model)
- **Data:** `backend/data/landmarks.json` — 5 Saudi heritage landmarks
- **Key env var:** `GROQ_API_KEY` — required for AI landmark recognition

## Workflows
- **Start application** — Frontend dev server (`cd frontend && npm run dev`) → port 5000
- **Backend API** — FastAPI server (`cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload`) → port 8000

## Deployment
- **Target:** Autoscale
- **Build:** Install npm + Python deps, build frontend
- **Run:** Backend FastAPI on port 5000

## Environment Variables / Secrets
- `GROQ_API_KEY` — Groq API key for vision AI (meta-llama/llama-4-scout-17b-16e-instruct model)

## Key Features
- Upload or capture photo of a Saudi heritage landmark
- AI identifies landmark using Groq Vision LLM
- Detailed historical info, timeline, and gallery
- Full Arabic/English bilingual support
- Regional explorer for Saudi culture
