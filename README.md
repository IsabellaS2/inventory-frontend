# Skincare Inventory - Enterprise Full-stack Application Development

## Introduction
### Solution Overview
The Skincare Inventory Management System is a web-based application designed to streamline product tracking, user management, and administrative control. It allows users to manage product inventories efficiently while providing administrators with tools to oversee users and assign roles. The system ensures secure access, real-time data updates, and a user-friendly interface for seamless navigation.

### Project Aim & Objectives:
State the main goal of your application.
List 3–5 key objectives (e.g., “Implement secure authentication,” “Enable real-time data updates”).


**1. Implement Secure Authentication**: Ensure user data is protected using JWT-based authentication with role-based access control (RBAC).

**2. Enable Product Management**: Allow CRUD (Create, Read, Update, Delete) operations for inventory items to maintain accurate stock records.

**3. Role-Based Access Control**: Provide different levels of access for users, managers, and admins.

**Users** - Can view all products, can't edit, delete or add products
Managers - Can view and update products but can't delete or add products
Admins - Can view, edit, delete and add products. Can also see all user details and update user roles

**4. Sorting and Filtering**: Enable sorting of products by quantity and price to allow for easy inventory management. This will help users to quickly find items with low stock or the highest and lowest prices.

**5. Implement Low Stock Management**: Highlight products with low stock (below 20) by changing the product card’s color to red and display a "Quantity Low, Restock!" message, making it easier to identify products that need restocking.




## Enterprise Considerations
### Performance
What strategies were used to ensure efficient performance?

### Scalability
How is the application designed to handle growth?

### Robustness
How does your application handle failures or errors?

### Security
#### JWT Authentication
Access Control is implemented through RBAC. Different roles have different levels of permissions to interact with resources like products and user information.

Each user is assigned a role when they register or through an admin’s manual intervention. The roles determine the level of access the user has in the application.

| User Type | Access they have |
| -------- | ------- |
| Users  | Can view products but cannot modify, add, or delete them   |
| Managers | Can view and update products, but they cannot delete or add new products    |
| Admins    | Have full access, including the ability to view, create, update, delete products, as well as manage user roles    |





**Role-Based API Routes**: The backend uses middleware to enforce role-based access. For example:

- Routes that allow product modification (e.g., updating, deleting) are protected with a middleware that checks if the user has the Manager or Admin role.
- Only Admins can access routes that allow them to update other users' roles or delete users.
- **Authorisation Checks**: Whenever a user attempts to perform an action, the system checks their role via the JWT token and compares it with the permissions required for that action. If the user’s role doesn’t have the necessary permissions, the backend responds with a 403 Forbidden error.

By implementing Access Control, the system ensures that users can only perform actions that align with their role, protecting the system from unauthorised changes or data exposure.



#### Password Hashing & Salting
This is used to securely store user passwords in the database by hashing each password using bcrypt.

**On Registration**: When a new user registers, their password is hashed using bcrypt before being stored in the database. This ensures that even if the database is compromised, attackers cannot retrieve the users' original passwords.

**On Login**: During login, the backend compares the hashed version of the password provided by the user with the stored hash in the database. If they match, the user is authenticated and a JWT is generated.

**Security**: This approach minimises the risk of sensitive data exposure since passwords are never stored in plain text. Even if someone gains unauthorised access to the database, they would only see the hashed passwords, not the original ones. The use of password hashing ensures that the system follows best practices for password security, protecting user credentials from being compromised.


#### Access Control



#### Deployment
Mention any cloud platforms or hosting services used.


## Installation & Usage Instructions
### Prerequisites
Required technologies (e.g., Node.js, Python, PostgreSQL).

### Setup Steps
Guide users on cloning the repository, installing dependencies, configuring environment variables, and running the application.


### Running the Application
#### Backend / Middleware

1. Clone the repository: `https://github.com/IsabellaS2/inventory-backend.git`
[Link here](https://github.com/IsabellaS2/inventory-backend.git)

2. Navigate to the project directory: `cd inventory-backend`

3. Install dependencies: `npm install`

4. Create a .env file to configure your environment variables: 
```
DB_URL=your_database_uri
DB_PASSWORD=your_database_uri
JWT_SECRET=your_jwt_secret
```

5. Start the server: `npm start`

The server should now be running at `http://localhost:4000`


#### Frontend
1. Clone the repository: `https://github.com/IsabellaS2/inventory-frontend.git`
[Link here](https://github.com/IsabellaS2/inventory-frontend.git)

2. Navigate to the project directory: `cd inventory-frontend`

3. Install dependencies: `npm install`

4. Start the server: `npm start`

The server should now be running at `http://localhost:3000`


## Feature Overview
For each key feature:
• Describe its purpose.
• Specify where its code is located in the repository.
• Highlight relevant endpoints, modules, components, or classes.

## Known Issues & Future Enhancements (Optional but recommended)
• Mention any bugs or limitations.
The [hosted frontend website on render](https://inventory-frontend-rj3w.onrender.com/) can take a while to load when it is the first time. You will be automatically redirected to login and when you press the button it won't show anything but it does work it just takes a while (30 seconds) before you get any messages. This might be due to it being hosted on Render and since it is the first time it has to be fetched.

• Outline possible future improvements.



## References (Optional)
• Cite any tutorials, frameworks, Gen AI tools, or third-party resources used.
