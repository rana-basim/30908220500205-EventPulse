# 30908220500205-EventPulse
 Backend API #

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
└── vercel.json         # Deployment settings for Vercel cloud hosting

API ENDPOINTS
users / auth

http://localhost:5000/api/users/register ---> POST (Public)

http://localhost:5000/api/users/login ---> POST (Public)

events

http://localhost:5000/api/events ---> GET (Public) & POST (Admin)

http://localhost:5000/api/events/:id ---> GET (Public) & PATCH (Admin) & DELETE (Admin)

categories

http://localhost:5000/api/categories ---> GET (Public) & POST (Admin)

http://localhost:5000/api/categories/:id ---> PATCH (Admin) & DELETE (Admin)

registrations

http://localhost:5000/api/registrations ---> POST (Attendee)

http://localhost:5000/api/registrations/my ---> GET (Attendee)

http://localhost:5000/api/registrations/:id ---> DELETE (Attendee)

messages

http://localhost:5000/api/messages/event/:eventid ---> GET (Authenticated User)

system

http://localhost:5000/health ---> GET (Public)

http://localhost:5000/api-docs ---> GET (Public Interactive Swagger UI)

# Results of test

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