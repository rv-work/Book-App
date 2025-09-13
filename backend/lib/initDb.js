import pool from "./db.js";

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      role ENUM('buyer','seller')
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS books (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sellerId INT,
      title VARCHAR(255),
      description TEXT,
      price DECIMAL(10,2),
      stock INT,
      imageUrl VARCHAR(255),
      FOREIGN KEY (sellerId) REFERENCES users(id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS carts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      buyerId INT,
      bookId INT,
      quantity INT,
      FOREIGN KEY (buyerId) REFERENCES users(id),
      FOREIGN KEY (bookId) REFERENCES books(id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      buyerId INT,
      sellerId INT,
      bookId INT,
      status VARCHAR(50),
      FOREIGN KEY (buyerId) REFERENCES users(id),
      FOREIGN KEY (sellerId) REFERENCES users(id),
      FOREIGN KEY (bookId) REFERENCES books(id)
    );
  `);

  console.log("✅ Tables created/verified");
  process.exit();
}

init().catch(err => {
  console.error("DB Init Error:", err);
  process.exit(1);
});
