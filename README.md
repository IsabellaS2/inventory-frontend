# Skincare Inventory - Enterprise Full-stack Application Development

- [Skincare Inventory - Enterprise Full-stack Application Development](#skincare-inventory---enterprise-full-stack-application-development)
  - [Introduction](#introduction)
    - [Solution Overview](#solution-overview)
    - [Project Aim \& Objectives:](#project-aim--objectives)
  - [Enterprise Considerations](#enterprise-considerations)
    - [Performance](#performance)
    - [Scalability](#scalability)
      - [Frontend (React)](#frontend-react)
      - [Backend (Node.js with Express)](#backend-nodejs-with-express)
      - [Hosting on Render](#hosting-on-render)
    - [Robustness](#robustness)
      - [Backend](#backend)
      - [Frontend](#frontend)
      - [Render’s Built-in Fault Tolerance](#renders-built-in-fault-tolerance)
    - [Security](#security)
      - [JSON Web Token Authentication](#json-web-token-authentication)
      - [Password Hashing \& Salting](#password-hashing--salting)
      - [Access Control](#access-control)
    - [Deployment](#deployment)
  - [Installation \& Usage Instructions](#installation--usage-instructions)
    - [Prerequisites](#prerequisites)
    - [Setup Steps](#setup-steps)
      - [Backend / Middleware Setup](#backend--middleware-setup)
      - [Frontend](#frontend-1)
      - [Running the Application](#running-the-application)
  - [Feature Overview](#feature-overview)
      - [1. Implement Secure Authentication](#1-implement-secure-authentication)
      - [2. Enable Product Management](#2-enable-product-management)
      - [3. Role-Based Access Control](#3-role-based-access-control)
      - [4. Sorting](#4-sorting)
      - [5. Implement Low Stock Management](#5-implement-low-stock-management)
  - [Known Issues \& Future Enhancements (Optional but recommended)](#known-issues--future-enhancements-optional-but-recommended)
  - [References](#references)

## Introduction

### Solution Overview

The Skincare Inventory Management System is a web-based application designed to streamline product tracking, user management, and administrative control. It allows users to manage product inventories efficiently while providing administrators with tools to oversee users and assign roles. The system ensures secure access, real-time data updates, and a user-friendly interface for seamless navigation.

### Project Aim & Objectives:

**1. Implement Secure Authentication**: Ensure user data is protected using JWT-based authentication with role-based access control (RBAC).

**2. Enable Product Management**: Allow CRUD (Create, Read, Update, Delete) operations for inventory items to maintain accurate stock records.

**3. Role-Based Access Control**: Provide different levels of access for users, managers, and admins.

**Users** - Can view all products, can't edit, delete or add products
**Managers** - Can view and update products but can't delete or add products
**Admins** - Can view, edit, delete and add products. Can also see all user details and update user roles

**4. Sorting**: Enable sorting of products by quantity and price to allow for easy inventory management. This will help users to quickly find items with low stock or the highest and lowest prices.

**5. Implement Low Stock Management**: Highlight products with low stock (below 20) by changing the product card’s color to red and display a "Quantity Low, Restock!" message, making it easier to identify products that need restocking.

## Enterprise Considerations

### Performance

To ensure the inventory management system ran efficiently, I hosted the PostgreSQL database, Node.js middleware, and React frontend all on Render. Keeping everything on the same platform and in the same region reduced latency between services, making API and database calls faster and more reliable.
I also applied the separation of concerns principle by splitting the system into clearly defined parts. The frontend and backend are in separate repositories, which makes the codebase easier to manage and allows each service to be scaled or optimised independently. Hosting the database separately ensures it has dedicated resources, contributing to consistent performance even as the app grows.

I also designed the system to stay responsive as it scales. The backend handles database queries efficiently, and the frontend avoids unnecessary re-renders when dealing with large datasets. This helps keep interactions like loading and sorting products quick and smooth, even as more users and products are added. By structuring data access and rendering logic carefully, I ensured the app remains fast without compromising user experience.

### Scalability

I built this application with scalability in mind by using a modular architecture to make it scalable, maintainable, and easy to extend. Both the frontend and backend are organised into clearly defined sections that separate responsibilities, making the system well-prepared to support growth in features and user traffic.

#### Frontend (React)

In the frontend, components are grouped by functionality inside the pages/ and components/ folders.

For example:
Authentication logic lives in `pages/account/login.js`
Product-related features are isolated in pages/products/ (e.g., `add-products.js`, `product-detail.js`)

This approach allows each section of the UI to be developed, tested, and maintained independently. Reusable components and a clear folder structure also make it easier to scale the frontend without clutter.

#### Backend (Node.js with Express)

The backend is organised into:

`routes/` – handles API endpoints (`products.js`)
`middleware/` – manages reusable logic like authentication and role-based access (`access-control.js`)
`database/` – holds Sequelize models for database interactions (`products.js`)

This separation of concerns allows easy scaling for each part of the backend independently. For example, new features can be added by simply creating new route files without modifying core logic. Middleware makes it easy to plug in additional logic across endpoints without repetition.

#### Hosting on Render

Render automatically handles service scaling, which means:

- The Node.js server can scale based on traffic
- PostgreSQL database tiers can be upgraded as data grows
- All services are deployed in the same region, reducing latency and improving communication speed between frontend, backend, and database

This setup ensures that the app can handle concurrent users effectively while maintaining performance and reliability.

The application is also built to scale smoothly in terms of user and data management. New users can easily sign up and are automatically added to the database. Admins can update user access levels through the dashboard, allowing for flexible permission control as the user base grows. Product management is just as scalable as products can be added or updated seamlessly through dedicated forms, with all changes reflected immediately in the database.

Access control is tightly integrated across the app, ensuring that users without the correct role can't view or modify restricted pages. Even if someone tries to navigate directly to a protected route like `/add-products`, they’ll be redirected, preserving both security and scalability.

### Robustness

My application has been built to handle errors and recover from failures without compromising the user experience. I implemented fault tolerance throughout both the backend and frontend, and leveraged Render’s built-in infrastructure features to enhance overall system resilience.

#### Backend

In the backend (Node.js with Express), I added thorough error handling to each route. For example, in `products.js`, all database operations are wrapped in try-catch blocks. This ensures that if anything goes wrong (e.g. database unavailability, invalid IDs), users receive clear and appropriate HTTP responses, and internal issues are logged for debugging:

```javascript
try {
  const products = await Product.findAll();
  res.json(products);
} catch (error) {
  console.error("❌ Error fetching products:", error);
  res.status(500).json({ error: "Internal Server Error" });
}
```

I applied the same approach to my user routes, where I handle registration/login failures like duplicate users, password mismatches, or invalid data by returning clear, user-friendly messages.

In addition, I use JWT authentication middleware (`authenticateToken.js`) and role-based access control (`authenticateAdmin.js`) to prevent unauthorised actions and provide secure access control.

#### Frontend

On the frontend, I implemented robust error states using `useState`. For instance, in my `LoginPage`, failed fetches or invalid credentials are caught and shown to users clearly:

```javascript
.catch((error) => {
  setError("Failed to login");
  console.error("Error:", error);
});
```

I also added logic to redirect unauthorised users to dedicated error pages, improving user flow without crashes. The app handles network errors, empty form submissions, and unauthorised access smoothly. I also included strong input validation across both the signup and product creation workflows.

For example, during registration, passwords must be at least six characters long, improving security and preventing weak credentials. Similarly, when adding products, form inputs are validated for example not entering numbers in the title field or letters in the quantity field to ensure data consistency.

These checks reduce the risk of invalid or malformed data being saved to the database. On top of that, access control helps maintain system integrity: regular users are blocked from accessing sensitive routes like adding or updating products. This not only improves the user experience but also protects against unauthorised changes and potential misuse.

#### Render’s Built-in Fault Tolerance

I deployed both the backend and database using Render, which adds an extra layer of robustness:

**Zero-Downtime Deploys**: When I push updates, Render performs blue-green deploys so users don’t experience any downtime.

**Health Checks**: Render continuously monitors the service and can detect if it's unresponsive, restarting it as needed.

### Security

#### JSON Web Token Authentication

​In my application, I have implemented JWT authentication to secure access to various resources and ensure that only authorised users can perform certain actions.

**User Authentication and Token Generation**
When a user logs in with valid credentials, the server generates a JWT containing the user's unique identifier and role information. This token serves as a proof of authentication and is sent back to the client. The client stores this token in local storage and includes it in the Authorisation header of subsequent requests. This approach allows the server to verify the user's identity without maintaining session information, adhering to a stateless authentication model.​

To enforce these access controls, I have implemented middleware functions that intercept incoming requests and verify the user's permissions based on their role. For example, routes that modify product data are protected by middleware that checks if the user has the appropriate role. If a user attempts to access a resource or perform an action they are not authorised for, the middleware responds with a 403 Forbidden error, preventing unauthorised access.​

By integrating JWT authentication with role-based access control and secure password handling, I have established a robust security framework that protects sensitive data and ensures that users can only access resources and perform actions permitted by their roles.​

#### Password Hashing & Salting

This is used to securely store user passwords in the database by hashing each password using bcrypt.

**On Registration**: When a new user registers, their password is hashed using bcrypt before being stored in the database. This ensures that even if the database is compromised, attackers cannot retrieve the users' original passwords.

**On Login**: During login, the backend compares the hashed version of the password provided by the user with the stored hash in the database. If they match, the user is authenticated and a JWT is generated.

**Security**: This approach minimises the risk of sensitive data exposure since passwords are never stored in plain text. Even if someone gains unauthorised access to the database, they would only see the hashed passwords, not the original ones. The use of password hashing ensures that the system follows best practices for password security, protecting user credentials from being compromised.

#### Access Control

Access Control is implemented through RBAC. Different roles have different levels of permissions to interact with products and user information.

Each user is assigned a role when they register or through an admin’s manual intervention. The roles determine the level of access the user has in the application.

**User Roles**: There are three types of users in the system, each with different levels of access:

| User Type | Access they have                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| Users     | Can view products but cannot modify, add, or delete them                                                       |
| Managers  | Can view and update products, but they cannot delete or add new products                                       |
| Admins    | Have full access, including the ability to view, create, update, delete products, as well as manage user roles |

**Role-Based API Routes**: The backend uses middleware to enforce role-based access. For example:

- Routes that allow product modification (e.g., updating, deleting) are protected with a middleware that checks if the user has the Manager or Admin role.
- Only Admins can access routes that allow them to update other users' roles or delete users.
- **Authorisation Checks**: Whenever a user attempts to perform an action, the system checks their role via the JWT token and compares it with the permissions required for that action. If the user’s role doesn’t have the necessary permissions, the backend responds with a 403 Forbidden error.

By implementing Access Control, the system ensures that users can only perform actions that align with their role, protecting the system from unauthorised changes or data exposure.

This approach ensures that users only have access to resources and actions appropriate for their roles, adding an extra layer of security.

### Deployment

I have my full-stack application hosted on **Render**, which makes it easy to manage all the different components.

1. **Node.js Backend Middleware**: My Node.js backend is hosted on Render, and it handles all the API requests, authentication, and business logic. It's the middleware that connects to my React frontend with the PostgreSQL database, ensuring data is processed and served correctly.

2. **PostgreSQL Backend Database**: My PostgreSQL database is also hosted on Render. I use the `psql` command in my terminal to manage and query the database directly, which makes it really simple to interact with the data and keep everything in sync with my backend.

3. **React Frontend**: The React site is also hosted on Render. It communicates with the Node.js backend via HTTP requests to display data to the users. This setup keeps the frontend responsive and the backend focused on processing requests and managing data.

All the components are connected seamlessly. The React frontend makes requests to the Node.js backend, which fetches and stores data in the PostgreSQL database. With everything hosted on Render, I can easily manage and scale my app, ensuring it's both reliable and high-performing.

## Installation & Usage Instructions

### Prerequisites

| Required technologies |
| --------------------- |
| Node.js               |
| Express.js            |
| JWT                   |
| React​                |
| Postgres Database     |

### Setup Steps

#### Backend / Middleware Setup

**1.1. Local Database Setup (PostgreSQL)**

- Install PostgreSQL on your local machine if you haven’t already. You can follow the [installation guide for PostgreSQL](https://www.postgresql.org/download/) for your specific operating system.
- Create a new database and note the connection details.

**1.2. Setup Database on Render (Cloud)**

1. Create a Render account at [https://render.com](https://render.com).
2. Create a new PostgreSQL database on Render:
   1. Go to Render Dashboard -> **New** -> **Database** -> **PostgreSQL**
   2. Choose the desired region and deploy the database.
3. Copy the `DATABASE_URL` and `DB_PASSWORD` (found in the Render dashboard) to be used in the `.env` file.

**2. Install Dependencies and Run Backend**

**2.1. Clone the Backend Repository**
Run the following command to clone the backend repository:

```bash
git clone https://github.com/IsabellaS2/inventory-backend.git
cd inventory-backend
```

**2.2 Install Dependencies**
Once inside the `inventory-backend` directory, run: `npm install`

**2.3. Configure Environment Variables**
Create a `.env` file in the root of the project directory. Add the necessary environment variables (DB_URL, DB_PASSWORD, and JWT_SECRET).

JWT_SECRET is a secret string used to sign your JSON Web Tokens (JWT). You can generate a random secret key for added security using online tools or by running:
`require('crypto').randomBytes(64).toString('hex');`

Example .env file:

```env
DB_URL=your_database_url_here
DB_PASSWORD=your_database_password_here
JWT_SECRET=your_jwt_secret_here
```

**2.4. Run backend locally**
To run the backend server locally, use: `npm start`

The backend should now be running at http://localhost:4000.

**3. Deploying the Backend**
You can now deploy the backend to Render.

Deploying to Render:

1. Sign in to your Render account and create a Web Service.
2. Connect your GitHub repository for the backend and select the branch to deploy.
3. Set up your environment variables (similar to .env).
4. Render will automatically install the dependencies and start the server.

#### Frontend

**1. Install Dependencies and Run Frontend**

**1.1. Clone the Frontend Repository**
Run the following command to clone the frontend repository:

```bash
git clone https://github.com/IsabellaS2/inventory-frontend.git
cd inventory-frontend
```

**1.2 Install Dependencies**
Once inside the `inventory-frontend` directory, run: `npm install`

**1.3. Run frontend locally**
To run the frontend server locally, use: `npm start`

The frontend should now be running at http://localhost:3000.

**2. Deploy the Frontend on Render**

**2.1 Create a New Render Static Site**

- Log in to your Render account.
- Click on **New Static Site** and choose your GitHub repository with the frontend code.
- Render will detect the build command (`npm run build`) and deploy your React app.

**Deploy the Frontend**

- Once the frontend is deployed, Render will provide a custom URL for your site (e.g., `https://inventory-frontend-xyz.onrender.com`).

---

**Interaction Between Frontend and Backend**
**Frontend API Requests to Middleware**
In the frontend, API requests are made to the backend using the `fetch` API. The URLs should be dynamically set based on the what route you want to fetch.

Example of fetching product details:

```javascript
fetch("https://inventory-backend-abcd.onrender.com/profile", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
}).then((response) => {
  /* handle response */
});
```

#### Running the Application

**Locally**
Run backend locally
To run the backend server locally, use: `npm start`
The backend should now be running at http://localhost:4000.

Run frontend locally
To run the frontend server locally, use: `npm start`
The frontend should now be running at http://localhost:3000.

**Deployed**
To see my application deployed, naivgate to [https://inventory-frontend-rj3w.onrender.com/](https://inventory-frontend-rj3w.onrender.com/) and it will be deployed with the backend and middleware already connected

## Feature Overview

#### 1. Implement Secure Authentication

**1. Frontend Implementation**

| **Component** | **Location**                | **Purpose**                                                                                                                                   |
| ------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| RegisterPage  | `pages/account/register.js` | Lets users create an account. Validates inputs and sends data to `/register`. Shows errors for issues like duplicate email or weak passwords. |
| LoginPage     | `pages/account/login.js`    | Authenticates users via `/login`. Stores token in `localStorage` on success and redirects to `/products`.                                     |

**2. Backend Implementation**

| **Endpoint**     | **Method** | **Path**          | **Purpose**                                                                                                              |
| ---------------- | ---------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Register         | POST       | `/register`       | Validates and registers a new user. Ensures email is valid and password is ≥6 characters. Hashes passwords using bcrypt. |
| Login            | POST       | `/login`          | Validates credentials, returns JWT on success. Verifies password with bcrypt.                                            |
| Get Profile      | GET        | `/profile`        | Returns authenticated user's profile. Requires a valid token.                                                            |
| Get All Users    | GET        | `/users`          | Admin-only: returns list of users. Protected by `authenticateAdmin`.                                                     |
| Update User Role | PUT        | `/users/:id/role` | Admin-only: updates user roles (user, manager, admin).                                                                   |

**3. Security Middleware**

| **File**                           | **Purpose**                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
| `middleware/authenticate-token.js` | Verifies JWT token and attaches user info to requests. Required for protected routes. |
| `middleware/access-control.js`     | Ensures the user has admin role before allowing access to admin routes.               |

**4. Security Highlights**

- Password must be at least 6 characters (validated server-side).
- Email format is strictly validated.
- JWT is stored in `localStorage` after login and used for authenticated requests.
- RBAC prevents unauthorised access to sensitive routes.
- Users cannot access restricted routes by modifying the URL (e.g. `/add-products`), as access is validated both client and server-side.

#### 2. Enable Product Management

This feature allows users to manage the product inventory by performing CRUD operations: Create, Read, Update, and Delete. The purpose is to maintain accurate stock records by allowing the addition, viewing, updating, and removal of products from the inventory system.

**1. Frontend Implementation**
| **Component** | **Location** | **Purpose** |
|---------------------|----------------------------------|----------------------------------------------------------------------------------------------|
| ProductListPage | `pages/products/product-page.js` | Displays a list of all products with options to edit or delete each item. |
| ProductCreatePage | `pages/products/add-products.js` | Provides a form to create new products. Validates input and sends data to `/products`. |
| ProductEditPage | `pages/products/product-details.js` | Lets users edit product details (name, price, stock). Sends updates to `/products/:id`. |
| ProductDetailsPage | `pages/products/product-details.js` | Shows detailed information of a product, including a delete option. |

**2. Backend Implementation**
| **Endpoint** | **Method** | **Path** | **Purpose** |
|---------------------|------------|----------------------|----------------------------------------------------------------------------------------------|
| Get All Products | GET | `/products` | Returns a list of all products. |
| Create Product | POST | `/add-product` | Creates a new product. Validates data (e.g., name, price, stock). |
| Get Product Details | GET | `/products/:id` | Returns details of a specific product by its ID. |
| Update Product | PUT | `/products/:id` | Updates product details (name, price, stock) for a specific product. |
| Delete Product | DELETE | `/products/:id` | Deletes a specific product by its ID. |

#### 3. Role-Based Access Control

RBAC ensures that users only have access to the resources and actions necessary for their roles. This enhances system security and integrity by preventing unauthorised actions. For example, a manager can update product information but cannot delete a product, while an admin has full control over the system.

**1. Frontend Implementation**
| **Component** | **Location** | **Purpose** |
|-------------------------|----------------------------------|-----------------------------------------------------------------------------------------------------|
| AdminPanel | `profile/admin-panel.js` | Displays a list of users with the ability to update their roles. Accessible only by admins. |
| ProductCreatePage | `products/add-products.js` | Allows admins to create new products. Ensures only admins can access this page. |
| ProductDetailsPage | `products/product-details.js` | Displays detailed information of a specific product. Admins can update or delete. Managers can only update |
| ProfilePage | `profile/profile.js` | Displays user profile information. Includes a link to the admin panel if the user is an admin. |

**2. Backend Implementation**
| **Endpoint** | **Method** | **Path** | **Purpose** |
|-------------------------|------------|-------------------------------|-----------------------------------------------------------------------------------------------------|
| Create Product | POST | `/add-product` | Allows admins to create new products. Requires admin authentication. |
| Update Product | PUT | `/products/:id` | Allows admins or managers to update a product's details. Requires user authentication. |
| Delete Product | DELETE | `/products/:id` | Allows admins to delete a product. Requires admin authentication. |
| Get All Users (Admin) | GET | `/users` | Returns a list of all users. Accessible only by admins. |
| Update User Role (Admin) | PUT | `/users/:id/role` | Allows admins to update a user's role (e.g., user, manager, admin). Requires admin authentication. |

#### 4. Sorting

This feature enables users to sort products by quantity (lowest to highest, highest to lowest) and price (lowest to highest, highest to lowest). It helps in inventory management by allowing quick identification of products with low stock or varying prices.
**Location in the Repository**: Inside the `ProductsPage` component in the frontend.

**Relevant Features**:

- **State**: Holds the selected sorting option (`sortOption` state).
- **Sorting Logic**: The `sortProducts` function sorts the products based on the selected option.
- **Dropdown UI**: A dropdown allows the user to select the sorting criteria.

#### 5. Implement Low Stock Management

This feature highlights products with low stock (below 20) by changing the product card's color to red and displaying a "Quantity Low, Restock!" message. This helps users easily identify products that need restocking, improving inventory management.

- **Location in the Repository**: The implementation is in the frontend, within the `ProductsPage` component.

- **Relevant Features**:

  - **Product Grid**: The product grid dynamically checks the quantity of each product and applies a special styling class (`low-quantity-message`) to products with less than 20 in stock.
  - **CSS Styling**: The styling for low-stock products is handled through custom CSS that changes the appearance of the product card and displays a bold, noticeable warning message.

## Known Issues & Future Enhancements (Optional but recommended)

**Known Issue**
The [hosted frontend website on render](https://inventory-frontend-rj3w.onrender.com/) can take a while to load when it is the first time. You will be automatically redirected to login and when you press the button it won't show anything but it does work it just takes a while (30 seconds) before you get any messages. This might be due to it being hosted on Render and since it is the first time it has to be fetched.

Another issue is with the admin setup. Currently, I don't want anyone to have admin privileges by default. I have an admin email set up, and I can assign other users as admins or managers manually. However, right now, it's not possible for a user to log in and automatically be assigned as an admin. Instead, I have to manually assign this role by going into the database and creating a user with the "admin" role.

For testing purposes, I made myself an admin, but if this were being handed over to a client, it would be tricky for them to set up an admin account initially. As it stands, they would need to access the database directly to create an admin user, which isn’t ideal.

**Future Enhancements**
A possible future improvement would be adding user activity tracking throughout the application, for example, recording which user added or edited a product. This would be useful for accountability, auditing changes, and improving transparency in admin workflows.

## References

I used Copilot integrated into my VSCode for basic code completion. When I encountered challenges, I turned to ChatGPT for assistance, helping me get unstuck and offering insights on how to approach certain problems.
