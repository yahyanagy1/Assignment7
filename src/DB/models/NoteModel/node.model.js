import { model, Schema } from "mongoose";

const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
        validate: {
            validator: (value) => value !== value.toUpperCase(),
            message: "title must not be entirely uppercase"
        }
    },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, {
    timestamps: true
})

export const NoteModel = model("Note", noteSchema)

// ---------------------------------------------------------------
// WHAT WE DID ABOVE 
//
// - title and content are required text.
// - Custom validator for title:
//   value.toUpperCase() changes the title to capital letters.
//   If the title is the same as its capital version,
//   it is all uppercase, so we reject it.
//   "FIRST NOTE" is rejected. "First Note" is accepted.
// - userId keeps the id of the user who owns the note.
//   ref: "User" connects it to the Users collection.
// - timestamps: true adds createdAt and updatedAt by itself.
// ---------------------------------------------------------------