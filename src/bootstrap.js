import chalk from 'chalk';
import express from 'express';
import UserRouter, { routes as userRoutes } from './modules/UserModule/user.controller.js';
import NoteRouter, { routes as noteRoutes } from './modules/NoteModule/note.controller.js';
import { DBConnection } from './DB/db.connection.js';

const app = express();

const bootsrtrap = async () => {

    app.use(express.json());
    await DBConnection();

    app.use(userRoutes.base, UserRouter);
    app.use(noteRoutes.base, NoteRouter);

    app.use((err, req, res, next) => {
        const statusCode = err.cause?.statusCode || 500;
        res.status(statusCode).json({ message: err.message })
    })

    app.listen(3000, () => {
        console.log(chalk.green("server is running ..."));
    })
}

export default bootsrtrap;

// ---------------------------------------------------------------
// WHAT WE DID ABOVE
//
// - express.json() lets the server read JSON from the request body.
// - DBConnection() connects to MongoDB before the routes start.
// - User routes are under /users. Note routes are under /notes.
// - The error middleware catches any error from the routes.
//   It sends { "message": "..." } with the right status code.
// - app.listen(3000) starts the server on port 3000.
// ---------------------------------------------------------------