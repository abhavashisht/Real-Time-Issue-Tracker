Real-Time Issue Tracker (Node.js, Express, WebSocket)

This project provides a simple real-time issue tracking system using Node.js, Express, and WebSocket.
It allows users to create, update, and manage issues with instant updates across connected clients.

Overview

The application exposes a REST API and WebSocket endpoint to manage issue-related operations.
It uses a local JSON file for data persistence.

HTTP API (port 3000) — exposes:

GET /issues — Fetch all issues

POST /issues — Create a new issue

PUT /issues/:id — Update an existing issue

DELETE /issues/:id — Delete an issue

WebSocket — broadcasts issue updates in real time to all connected clients.

Requirements

Node.js 18.x or higher

npm (Node Package Manager)

WebSocket client or frontend to interact with the server

1) Installation

Clone the repository and install dependencies:

git clone https://github.com/your-username/Real-Time-Issue-Tracker.git
cd Real-Time-Issue-Tracker
npm install

2) Running the Server

Start the server with:

npm start


By default, the server runs on http://localhost:3000.

3) API Endpoints
Method	Endpoint	Description
GET	/issues	Fetch all issues
POST	/issues	Create a new issue
PUT	/issues/:id	Update an issue
DELETE	/issues/:id	Delete an issue

Example POST request:

POST /issues
Content-Type: application/json

{
  "title": "Login page error",
  "description": "Login page crashes when user enters invalid data",
  "status": "open"
}

4) WebSocket Events
Event Name	Description
new-issue	Broadcasts when a new issue is created
update-issue	Broadcasts when an existing issue is updated
delete-issue	Broadcasts when an issue is deleted
issue-list	Sends the updated issue list to all clients

To connect to the WebSocket server:

ws://localhost:3000

5) Project Structure
Real-Time-Issue-Tracker/
│── server.js              # Main server file
│── issues.json            # Data storage for issues
│── package.json           # Project metadata and dependencies
│── package-lock.json
│── node_modules/          # Dependencies
└── README.md

6) Dependencies

express
 – Web framework for Node.js

ws
 – WebSocket server implementation

body-parser
 – Middleware for parsing request bodies

7) Future Enhancements

Add frontend interface for managing issues

Implement authentication and authorization

Replace JSON storage with a database (e.g., MongoDB or PostgreSQL)

Add notifications and activity logs

8) Contributing

Fork the repository.

Create a new branch:

git checkout -b feature-name


Commit your changes:

git commit -m "Add feature"


Push to the branch:

git push origin feature-name


Submit a pull request.
