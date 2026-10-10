import { UserModel } from "../../DB/models/UserModel/user.model.js"
import { errRes } from "../../utils/err.hanle.js"

export const signupService = async (body) => {
    const exists = await UserModel.findOne({ email: body.email })
    if (exists) errRes({ msg: "Email already exists.", statusCode: 409 })
    await UserModel.create(body)
    return { message: "User added successfully." }
}

export const loginService = async ({ email, password }) => {
    const user = await UserModel.findOne({ email, password })
    if (!user) errRes({ msg: "Invalid email or password", statusCode: 401 })
    return { message: "Login successful", data: { userId: user._id } }
}

export const updateUserService = async (id, body) => {
    const { password, ...data } = body
    if (data.email) {
        const exists = await UserModel.findOne({ email: data.email, _id: { $ne: id } })
        if (exists) errRes({ msg: "Email already exists.", statusCode: 409 })
    }
    const user = await UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    if (!user) errRes({ msg: "User not found", statusCode: 404 })
    return { message: "User updated" }
}

export const deleteUserService = async (id) => {
    const user = await UserModel.findByIdAndDelete(id)
    if (!user) errRes({ msg: "User not found", statusCode: 404 })
    return { message: "User deleted" }
}

export const getUserService = async (id) => {
    const user = await UserModel.findById(id)
    if (!user) errRes({ msg: "User not found", statusCode: 404 })
    return { data: user.toObject() }
}

// ---------------------------------------------------------------
// WHAT WE DID ABOVE
//
// - We removed the imports we did not use (Types and NoteModel).
//   Now the file imports only UserModel and errRes.
//
// 1) signupService:
//    - Look for a user with the same email (findOne).
//    - If we find one, send an error (409 = conflict).
//    - If not, save the new user (create).
//
// 2) loginService:
//    - Look for a user with the same email AND password.
//    - If nobody matches, send an error (401 = not allowed).
//    - If we find one, send back the user id.
//
// 3) updateUserService:
//    - Take the password out, so it cannot be changed here.
//    - If there is a new email, check that NO OTHER user has it.
//      ($ne means "not equal". We skip the same user.)
//    - findByIdAndUpdate updates the user.
//      new: true -> give back the updated user.
//      runValidators: true -> check the schema rules (age 18-60).
//    - If the user is not found, send 404.
//
// 4) deleteUserService:
//    - findByIdAndDelete finds the user by id and deletes it.
//    - If the user is not found, send 404.
//
// 5) getUserService:
//    - findById finds the user by id.
//    - If not found, send 404. If found, send the user data.
// ---------------------------------------------------------------