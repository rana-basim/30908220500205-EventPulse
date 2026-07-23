# PROJECT #

## TITLE AND DESCRIPTION
 This is an ecommerce api; you can get and add products to a cart, and check out. The main file is app.js and it also contains server functions / opens ports, which you have to run. There is also a seed.js file that you run **seperately**.

*cd "MONGO\mongocontrollerCopy\product-api"*

```text
product-api/
├── models/                 # [Mongoose] Database schemas
├── controllers/            # [JavaScript] Endpoint business logic
├── routes/                 # [Express] API route definitions
├── config/                 # Database connection settings
├── middleware/             # Express middleware (error handling, etc.)
├── utils/                  # Helper functions
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
├── seed.js                 # Database initialization script
 |── server.js               # Express server entry point
└── .gitignore              # Specifies files/folders ignored by Git
```
### API ENDPOINTS ###

**categories:**

http://localhost:3000/api/categories ---> GET & POST
http://localhost:3000/api/categories/:id ---> GET & PUT & PATCH & DELETE


**cart**
http://localhost:3000/api/cart --> GET & DELETE
http://localhost:3000/api/cart/items --> POST
http://localhost:3000/api/cart/items/:productId -->PATCH & DELETE

**order**
http://localhost:3000/api/order --> GET & POST
http://localhost:3000//api/order/:id --> GET
http://localhost:3000//api/order/:status --> PATCH

**products**

http://localhost:3000/api/products --> GET & POST
http://localhost:3000/api/products/:id --> GET, PUT & DELETE