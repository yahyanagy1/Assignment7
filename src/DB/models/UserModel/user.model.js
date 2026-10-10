import { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, min: 18, max: 60 }
})

export const UserModel = model("User", userSchema)

// ---------------------------------------------------------------
// WHAT WE DID ABOVE 
//
// - A schema is the shape of a user in the database.
// - name, email, password and phone are required.
// - email is unique. Two users cannot have the same email.
// - age must be a number between 18 and 60.
// - model("User", userSchema) makes the Users collection.
// - We export UserModel so other files can use it.
// ---------------------------------------------------------------