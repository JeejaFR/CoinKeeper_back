# Documentation Technique

## I. Frontend

**Technologies :** Vue 3, Vuetify, CSS

**Structure :**

- `src/components` : Composants réutilisables (ex : `LittleCard`, `CategorieCard`).
- `src/pages` : Pages principales de l'application (ex : `Dashboard`, `Transactions`, `Auth`).
- `src/store` : Gestion de l’état avec Pinia.
- `src/services` : Scripts d’appels API (backend ou devise).

**Principales dépendances :** Vue Router, Axios, Chart.js

---

## II. Backend

**Technologies :** Node.js avec Express

**Structure :**

- `controllers/` : Contient tous les contrôleurs de l’application.
- `db/` : Fichier de la base de données (initialisation et base).
- `models/` : Schémas de base de données (ex : `User`, `Transaction`).
- `routes/` : Routes API (ex : `/users/id`, `/transactions`).
- `middleware/` : Gestion des sessions, authentification JWT.

**Principales dépendances :** Express, bcrypt, jsonwebtoken, sqlite3

---

## III. Installation et Configuration

**Installation des dépendances :**

- **Frontend :** `npm install`
- **Backend :** `npm install`

**Configuration de l’environnement :**

- **Frontend :** `.env.dev` => `VITE_BACKEND_URL=adresse du serveur backend`
- **Backend :** `.env` => `SECRET_KEY=secret pour JWT`

**Lancement de l’application :**

- **Frontend :** `npm run dev`
- **Backend :** `npm app.js`

---

## IV. Sécurité

**Hashage des mots de passe :** Les mots de passe sont hashés avec bcrypt avant d’être stockés dans la base de données.

**Protection des routes :** Les routes API sensibles sont protégées par JWT. Seuls les utilisateurs authentifiés et autorisés peuvent accéder aux données.
