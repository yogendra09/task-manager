# Backend Application

This is a backend application built with Node.js and Express. It provides a RESTful API for managing users and admin functionalities.

## Project Structure

```
backend-app
├── src
│   ├── app.js
│   ├── controllers
│   │   ├── admin.controller.js
│   │   └── user.controller.js
│   ├── helper
│   │   └── index.js
│   ├── mailer
│   │   └── mailer.js
│   ├── middlewares
│   │   ├── authenticate.js
│   │   ├── catchAsyncErrors.js
│   │   └── error.js
│   ├── models
│   │   └── user.model.js
│   ├── routes
│   │   ├── admin.routes.js
│   │   ├── router.js
│   │   └── user.routes.js
│   ├── services
│   └── utils
│       ├── ErrorHandler.js
│       └── SendJwtToken.js
├── config
│   └── db.config.js
├── .gitignore
├── package.json
├── server.js
├── socket.js
├── swagger-output.json
├── swagger.js
├── Dockerfile
├── .dockerignore
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd backend-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the server, run:
```
node server.js
```

The server will start on the specified port (default is 3000).

## API Documentation

API endpoints and their usage can be found in the Swagger documentation. Ensure to check the `swagger.js` file for setup instructions.

## Docker

To build the Docker image, run:
```
docker build -t backend-app .
```

To run the Docker container, use:
```
docker run -p 3000:3000 backend-app
```

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.