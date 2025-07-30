# 🌦️ Weather App

Une application météo en temps réel qui permet d’afficher les conditions actuelles ainsi que les prévisions à venir, le tout avec une interface moderne, animée, et responsive.

---

## 🧩 Sommaire

- [🛠️ Stack Technique](#️-stack-technique)
- [🚀 Fonctionnalités](#-fonctionnalités)
- [⚙️ Installation locale](#️-installation-locale)
- [🐳 Docker & CI/CD](#-docker--cicd)
- [🔐 Configuration des variables](#-configuration-des-variables)
- [📁 Structure du projet](#-structure-du-projet)
- [📄 Licence](#-licence)

---

## 🛠️ Stack Technique

### Frontend (React)
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Iconify / Heroicons
- Animations CSS + transitions

### Backend (Django)
- Django 4.x
- Django REST Framework
- OpenWeatherMap API (ou autre service météo)
- SQLite (par défaut)

### DevOps
- Docker / Docker Compose
- GitHub Actions (CI/CD)
- Netlify (déploiement frontend)

---

## 🚀 Fonctionnalités

- 🔍 Recherche météo en temps réel par ville ou position actuelle
- 📅 Prévisions météo sur plusieurs jours
- 🖼️ Changement automatique du fond selon la météo
- 🎨 Icônes modernes et animées
- 🌗 Thème clair/sombre (facultatif)
- 📱 Responsive sur mobile et desktop

---

## ⚙️ Installation locale

### 1. Cloner le projet

git clone https://github.com/nguembu/weather-app.git
cd weather-app
### 2. Lancer avec Docker 🐳

docker compose up --build
L'application sera accessible sur :

Frontend : http://localhost:3000

Backend API : http://localhost:8000/api/

## 🐳 Docker & CI/CD
### 📦 Conteneurisation
frontend/ contient un Dockerfile React

backend/ contient un Dockerfile Django

Un docker-compose.yml à la racine orchestre le tout

## ⚙️ Pipeline CI/CD GitHub Actions

### .github/workflows/deploy.yml
- Build automatique du frontend
- Déploiement sur Netlify

## 🔐 Configuration des variables
### Exemple .env pour le backend :


DJANGO_SECRET_KEY=ton_super_secret
WEATHER_API_KEY=clé_openweathermap
DEBUG=True
Et pour le frontend (via Vite) :


VITE_API_BASE_URL=http://localhost:8000/api

## 📁 Structure du projet
swift
Copier
Modifier
weather-app/
│
├── frontend/             → App React
│   ├── public/
│   ├── src/
│   └── Dockerfile
│
├── backend/              → API Django
│   ├── weather/
│   ├── manage.py
│   └── Dockerfile
│
├── docker-compose.yml
├── .github/workflows/    → GitHub Actions
└── README.md             → Ce fichier
## 📄 Licence
Ce projet est sous licence MIT.
Tu peux l’utiliser, le modifier, ou même l’améliorer à ta sauce. 🍲

## 👨🏽‍💻 Auteur
Johnny NGUEMBU – Développeur web fullstack passionné par les interfaces belles, fonctionnelles et météo-compatibles 😄.
→ Portfolio • LinkedIn • GitHub
