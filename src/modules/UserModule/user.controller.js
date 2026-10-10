import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { successRes } from "../../utils/success.res.js";
import {
    signupService,
    loginService,
    updateUserService,
    deleteUserService,
    getUserService
} from "./user.service.js";

const router = Router();

export const routes = {
    base: "/users",
    signup: "/signup",
    login: "/login",
    update: "/:id",
    root: "/"
}

router.post(routes.signup, async (req, res) => {
    const { message } = await signupService(req.body)
    successRes({ res, message, status: StatusCodes.CREATED })
})

router.post(routes.login, async (req, res) => {
    const { message, data } = await loginService(req.body)
    successRes({ res, message, data })
})

router.patch(routes.update, async (req, res) => {
    const { message } = await updateUserService(req.params.id, req.body)
    successRes({ res, message })
})

router.delete(routes.root, async (req, res) => {
    const { message } = await deleteUserService(req.query.id)
    successRes({ res, message })
})

router.get(routes.root, async (req, res) => {
    const { data } = await getUserService(req.query.id)
    successRes({ res, data })
})

export default router;

// ---------------------------------------------------------------
// WHAT WE DID ABOVE 
//
// - A controller only gets the request and sends the answer.
//   The real work is in the service file.
// - POST /users/signup -> make a new user. Status 201 = created.
// - POST /users/login -> check the email and password.
// - PATCH /users/:id -> update a user. The id is in the URL (req.params).
// - DELETE /users?id=... -> delete a user. The id is in the query (req.query).
// - GET /users?id=... -> get one user. The id is in the query too.
// - "export default router" lets bootstrap.js use this router.
// - Express 5 catches errors in async functions by itself,
//   so we do not need try/catch.
// ---------------------------------------------------------------