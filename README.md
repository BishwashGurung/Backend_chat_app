# Chat app backend
This is a backend for a simple chat app it can allows users to engage in real-time chatting, create accounts, log in, and interact with other online users. It utilizes a variety of technologies including JavaScript, Node.js, Express framework, MySQL, Socket.io, Sequelize, JSON Web Token (JWT) for authentication, and bcrypt for password hashing.

## Features
- **Real-Time Chatting**: Users can engage in real-time conversations with other online users.
- **Account Creation**: Users can create accounts to access the chat functionality.
- **User Authentication**: JSON Web Token (JWT) is used for user authentication.
- **Password Security**: User passwords are securely hashed using bcrypt before being saved in the database.

## Endpoints
- **POST /api/auth/register**: Register a new User. Receives { username, password, confirmPassword, email }
- **POST /api/auth/login**: Login in as a user. Receives { username, password }
- **POST /api/auth/logout**: Logout.
- **GET /api/users**: Retrieves list of users other the yourself. Need to be logged in.
- **GET /api/messages/:{id}**: Retrives list of messages between you and the id provided in the params. Need to be logged in.
- **POST /api/messages/send/:{receiverId}**: Sends message to the user with id equal to receiverId provided in the params. Need to be logged in. Also emits "newMessage" event to the receiverId so they can receive message in real time. 

## Socket.io
Listens to "newMessage" being sent to you. Listens to "callUser", "makeAnswer", "iceCandidate", "endCall" for video call feature.

## Technologies Used
- **JavaScript**: The primary language used for both server-side and client-side development.
- **Node.js**: A JavaScript runtime used for building the server-side of the application.
- **Express.js**: A web application framework for Node.js, utilized for building the RESTful API endpoints.
- **MySQL**: A MySQL database used to store user data and chat messages.
- **Socket.io**: A library that enables real-time, bidirectional communication between web clients and servers.
- **Sequelize**: An Object Data Modeling (ODM) library for MySQL and Node.js, used to simplify interactions with the MySQL database.
- **JSON Web Token (JWT)**: A compact, URL-safe means of representing claims to be transferred between two parties, used for user authentication.
- **bcrypt**: A library used for password hashing to enhance security.
