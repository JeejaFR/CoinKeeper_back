# Application de Suivi des Dépenses - Backend

## Description

Ce projet constitue la partie backend de l'application de suivi des dépenses. Il permet de gérer les transactions des utilisateurs, y compris l'ajout, la modification, la suppression et la consultation des dépenses. Ce backend fournit également les API nécessaires pour interagir avec le frontend de l'application.

## Technologies Utilisées

- **Langage** : [Node.js avec Express](https://expressjs.com/)
- **Base de données** : [SQLite](https://www.sqlite.org/)
- **Authentification** : [JWT](https://jwt.io/)

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) (version recommandée : 16.x ou supérieure)
- [SQLite](https://www.sqlite.org/)

## Installation

1. **Clonez le repository :**

    ```bash
    git clone https://github.com/JeejaFR/CoinKeeper_back
    cd utilisez-votre-repository/backend
    ```

2. **Installez les dépendances :**

    ```bash
    npm install
    ```

3. **Configurez les variables d'environnement :**

    Créez un fichier `.env` à la racine du projet et ajoutez le variable suivante :

    ```plaintext
    SECRET_KEY=secret_key
    ```

4. **Démarrez le serveur :**

    ```bash
    npm app.js
    ```

## API Endpoints

### Utilisateurs

- **POST** `/register` : Créer un nouvel utilisateur.
- **POST** `/login` : Connecte l'utilisateur.
- **GET** `/checkToken` : Verifie le token de l'utilisateur courant.

### Transactions

- **GET** `/transactions` : Récupère toutes les transactions de l'utilisateur courant.
- **GET** `/transactions/:id` : Récupère une des transactions de l'utilisateur courant.
- **GET** `/transactions/periode/:periode` : Récupère toutes les transactions d'une periode appertenant à l'utilisateur courant.
- **POST** `/transactions` : Créer une nouvelle transaction.
- **PUT** `/transactions/:id` : Modifie une transaction. 
- **DELETE** `/transactions/:id` : Supprime un transaction.

### Categories

- **GET** `/categories` : Recupère toutes les catégories de l'utilisateur.
- **POST** `/categories` : Créer une nouvelle catégorie.
- **PUT** `/categories/:id` : Modifie une catégorie.
- **DELETE** `/categories/:id` : Supprime une catégorie.

### Notifications

- **GET** `/notifications` : Récupère toutes les notifications.
- **DELETE** `/notifications/:id` : Supprime une notification.
- **DELETE** `/notifications` : Supprime toutes les notifications de l'utilisateur.


## Documentation

Pour plus de détails sur l'utilisation de l'application, veuillez consulter [la documentation utilisateur](./docs/user-guide.md) et [la documentation technique](./docs/technical-guide.md).

## Licence

Ce projet est sous la licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus d'informations.