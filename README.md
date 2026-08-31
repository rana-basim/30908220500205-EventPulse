# 30908220500205-EventPulse
## Vercel link
 Backend API #
 My vercel link is https://30908220500205-event.vercel.app/
## TITLE AND DESCRIPTION
This is an Event Management Backend API. You can manage user authentication (attendees and admins), create and filter events, handle event registrations with strict capacity limits, broadcast real-time announcements via Socket.io, view automated message history, and inspect interactive Swagger documentation. 

The main file is `app.js` which configures Express and middleware, while `server.js` starts the server and handles Socket.io connections. There is also a `seed.js` script that populates sample data which you run **separately**.

```text
Student ID-EventPulse/
├── config/             # Database connection settings (MongoDB connection)
├── controllers/        # [JavaScript] Endpoint business logic (User, Event, Category, Registration, Message)
├── middleware/         # Express middleware (Auth, Roles, Error Handling, Express Validator)
├── models/             # [Mongoose] Database schemas (User, Event, Category, Registration, Message)
├── postman/            # Exported Postman Collection & Shared Environment JSON
├── routes/             # [Express] API route definitions with OpenAPI JSDoc comments
├── utils/              # Helper functions, AppError class, and asyncHandler wrapper
├── tests/              # Jest Unit and Supertest Integration tests
├── .env                # Environment variables (port, secret key, database URI)
├── .gitignore          # Specifies files/folders ignored by Git
├── app.js              # Express app setup & middleware configuration
├── package.json        # Dependencies, package details, and script shortcuts
├── README.md           # Documentation
├── seed.js             # Database initialization script (runs separately)
├── server.js           # Main server entry point & Socket.io socket initialization
└── vercel.json         # Deployment settings for Vercel cloud hosting```
```
## Technologies Used

* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (via Mongoose ORM)
* **Real-time WebSockets:** Socket.IO
* **Authentication & Security:** JSON Web Tokens (JWT) & bcryptjs
* **Environment Configuration:** dotenv

# npm install express mongoose socket.io dotenv bcryptjs jsonwebtoken express-validator swagger-ui-express swagger-jsdoc


## Results of test

 ```
PASS  test/event.test.js
  ● Console

    console.log
      ◇ injected env (3) from .env // tip: ⌘ enable debugging { debug: true }

      at _log (node_modules/dotenv/lib/main.js:131:11)

 PASS  test/user.test.js
  ● Console

    console.log
      ◇ injected env (3) from .env // tip: ⌘ suppress logs { quiet: true }

      at _log (node_modules/dotenv/lib/main.js:131:11)

 PASS  test/asynchandler.test.js
 PASS  test/apperror.test.js

Test Suites: 4 passed, 4 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        5.394 s
Ran all test suites.
```

## Socket.IO Setup in Postman / Client
Connection URL: ws://localhost:5000

Join Event Room:

Event Name: join_event

Payload (String): "6a95ccd629a8f6604369ffb6" (Replace with your Event ID)

Listen for Announcements:

Event Name: announcement

Emitted automatically whenever an admin broadcasts an announcement via the HTTP API.

