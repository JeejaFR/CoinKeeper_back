------------------------
-------- TABLES --------
------------------------

-- Création de la table `users`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table `transactions`
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    category TEXT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    userID INTEGER,
    FOREIGN KEY (userID) REFERENCES users(id)
);

-- Création de la table `notifications`
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    type INTEGER,
    userID INTEGER,
    FOREIGN KEY (userID) REFERENCES users(id)
);

-- Création de la table `categories`
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK (LENGTH(name) BETWEEN 3 AND 12),
    month_limit DECIMAL(10, 2) NOT NULL,
    userID INTEGER,
    FOREIGN KEY (userID) REFERENCES users(id),
    UNIQUE(name, userID)  -- Categorie unique par utilisateur
);

------------------------
------- TRIGGERS -------
------------------------

-- Trigger pour mettre à jour la catégorie des transactions si le nom de catégorie est modifié
CREATE TRIGGER IF NOT EXISTS update_transactions_category_name
AFTER UPDATE OF name ON categories
FOR EACH ROW
BEGIN
  UPDATE transactions
  SET category = NEW.name
  WHERE category = OLD.name
  AND userID = OLD.userID;
END;

-- Trigger pour mettre à jour la catégorie des transactions à "Autres" si la catégorie est supprimée
CREATE TRIGGER IF NOT EXISTS update_transactions_on_category_delete
BEFORE DELETE ON categories
FOR EACH ROW
BEGIN
  UPDATE transactions
  SET category = 'Autres'
  WHERE category = OLD.name
  AND userID = OLD.userID;
END;