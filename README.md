Real-Time Issue Tracker

The Real-Time Issue Tracker is a lightweight and efficient issue tracking system built using Node.js, Express, and WebSockets. It allows users to create, update, and track issues in real time without requiring a page refresh.

Features

Real-time issue updates through WebSockets.

Create, update, and delete issues.

Issues stored in a local JSON file (issues.json).

Simple and clean server setup using Express.

Lightweight and easy to extend.

Technology Stack

Backend: Node.js, Express.js

WebSockets: ws

Data Storage: JSON file

Middleware: body-parser

Project Structure
Real-Time-Issue-Tracker/
│── server.js              # Main server file
│── issues.json            # Data storage for issues
│── package.json           # Project metadata and dependencies
│── package-lock.json
│── node_modules/          # Dependencies
└── README.md

Installation

Ensure that Node.js
 is installed on your system.

Clone the repository:

git clone https://github.com/your-username/Real-Time-Issue-Tracker.git


Navigate to the project directory:

cd Real-Time-Issue-Tracker


Install the required dependencies:

npm install

Usage

To start the server, run:

npm start


The server will start on http://localhost:3000 by default.

Once the server is running, users can connect through a WebSocket client or integrate it with a frontend interface to create and track issues in real time.

WebSocket Events
Event Name	Description
new-issue	Triggered when a new issue is created
update-issue	Triggered when an existing issue is updated
delete-issue	Triggered when an issue is deleted
issue-list	Sends the updated list of issues to all clients
Example Request

Add New Issue (POST)

POST /issues
Content-Type: application/json

{
  "title": "Login bug",
  "description": "User cannot log in with valid credentials",
  "status": "open"
}

Dependencies

express
 – Web framework for Node.js

ws
 – WebSocket implementation

body-parser
 – Middleware for parsing incoming request bodies

Future Enhancements

Development of a frontend interface

User authentication and authorization

Migration from JSON file storage to a database (e.g., MongoDB or PostgreSQL)

Integration of email or messaging notifications

Contributing

Contributions are welcome. To contribute:

Fork the repository.

Create a new branch:

git checkout -b feature-name


Commit your changes:

git commit -m "Add feature"


Push to the branch:

git push origin feature-name


Submit a pull request.
