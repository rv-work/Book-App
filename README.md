# 📚 Multi-Seller Bookstore App

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)

A **React Native** mobile application for a multi-seller bookstore with a **Node.js/Express.js** backend and **SQL database**. This project enables buyers to browse books and sellers to manage their inventory and orders.

---

## 📖 Table of Contents

- [Objective](#🎯-objective)
- [Tech Stack](#🛠️-tech-stack)
- [Buyer Side (Storefront)](#📱-buyer-side-storefront)
- [Seller Side (Seller Panel)](#🏪-seller-side-seller-panel)
- [Backend Features](#🔧-backend-features)
- [Getting Started](#🚀-getting-started)
- [Features](#🧩-features)
- [Author](#🌟-author)

---

## 🎯 Objective

Build a full-stack mobile application demonstrating:

- Multi-seller e-commerce functionality.
- Clean separation between **Buyer Storefront** and **Seller Panel**.
- Integration of **React Native frontend**, **Node.js backend**, and **SQL database**.
- RESTful APIs for CRUD operations.

---

## 🛠️ Tech Stack

| Layer    | Technology            |
| -------- | --------------------- |
| Frontend | React Native          |
| Backend  | Node.js + Express.js  |
| Database | MySQL                 |
| API      | RESTful API endpoints |

---

## 📱 Buyer Side (Storefront)

1. **Storefront Page**

   - Instagram-like feed of all books
   - Each product card displays:
     - Book cover image
     - Title
     - Price
     - Seller name

2. **My Orders Page**

   - Detailed Delivery information:
     - Image
     - Title & Description
     - Price
     - Live Status

3. **Cart Page**
   - Shows all added products with:
     - Product name
     - Price
     - Quantity
     - Total price

---

## 🏪 Seller Side (Seller Panel)

1. **Book Listing Page**

   - Sellers can add new books:
     - Title
     - Description
     - Price
     - Stock
     - Image
   - List of all books added by the seller

2. **Sales Dashboard**

   - Displays all orders placed by buyers:
     - Product
     - Buyer name
     - Order status

3. **Order Management**
   - Sellers can update order status:
     - Pending → Shipped

---

## 🔧 Backend Features

- REST APIs for:

  - Product Management
  - Cart Management
  - Order Management
  - Seller Management

- **Database Schema (SQL)**:

```sql
users(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  role ENUM('buyer','seller')
  email VARCHAR(255) UNIQUE
  password VARCHAR(255)
);

books(
  id INT PRIMARY KEY AUTO_INCREMENT,
  seller_id INT,
  title VARCHAR(255),
  description TEXT,
  price DECIMAL(10,2),
  stock INT,
  image_url VARCHAR(500)
);

cart(
  id INT PRIMARY KEY AUTO_INCREMENT,
  buyer_id INT,
  book_id INT,
  quantity INT
);

orders(
  id INT PRIMARY KEY AUTO_INCREMENT,
  buyer_id INT,
  seller_id INT,
  book_id INT,
  status ENUM('Pending','Shipped')
);
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm installed
- SQL database (MySQL/PostgreSQL/SQLite)
- React Native environment setup
- Mobile device or emulator

### 1️⃣ Backend Setup

```bash
# Clone the repository
git clone <repo-url>
cd backend

# Install dependencies
npm install

# Configure database
# Update .env file with DB credentials
DB_HOST=<your_host>
DB_PORT=<your_port>
DB_USER=<your_user>
DB_PASS=<your_password>
DB_NAME=<your_database>

DATABASE_URL=<your_database_url>

# Run migrations / seed (if any)
npx prisma migrate dev --name init

# Start server
npm run dev
```

Backend should now be live at: http://localhost:5000

### ⚠️ Note

I have **deployed the backend**, so you can **skip the backend setup steps** if you want.

**Test Accounts:**

- **Seller:**

  - Email: `seller@gmail.com`
  - Password: `1234`

- **Buyer:**
  - Email: `buyer@gmail.com`
  - Password: `1234`

### 2️⃣ Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start React Native app
npx run start ( To Start Metro)

# Run on Android
npm run android

# Run on iOS (Mac required)
npx react-native run-ios
```

Make sure your backend is running and endpoints are updated in the frontend API service.

---

## 🧩 Features

- **Buyer Side:** Browse, view, add to cart, checkout.
- **Seller Side:** Add books, view sales, manage orders.
- **Authentication & Role Separation:** Users can be buyers or sellers.
- **Responsive UI:** Works on Android and iOS devices.
- **Persistent Database:** SQL backend for structured storage.

---

## 🌟 Author

**Ruvishu Shukla**

- Email: ruvishushukla1@gmail.com
- GitHub: https://github.com/rv-work
