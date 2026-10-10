import { Types } from "mongoose"
import { NoteModel } from "../../DB/models/NoteModel/node.model.js"
import { UserModel } from "../../DB/models/UserModel/user.model.js"
import { errRes } from "../../utils/err.hanle.js"

const getOwnedNote = async (noteId, userId) => {
    const note = await NoteModel.findById(noteId)
    if (!note) errRes({ msg: "Note not found", statusCode: 404 })
    if (note.userId.toString() !== userId) errRes({ msg: "You are not the owner", statusCode: 403 })
    return note
}

export const createNoteService = async (userId, { title, content }) => {
    await NoteModel.create({ title, content, userId })
    return { message: "Note created" }
}

export const updateNoteService = async (noteId, userId, { title, content }) => {
    await getOwnedNote(noteId, userId)
    const note = await NoteModel.findByIdAndUpdate(noteId, { title, content }, { new: true, runValidators: true })
    return { message: "updated", data: { note } }
}

export const replaceNoteService = async (noteId, userId, { title, content }) => {
    await getOwnedNote(noteId, userId)
    const note = await NoteModel.findOneAndReplace(
        { _id: noteId },
        { title, content, userId },
        { new: true, runValidators: true }
    )
    return { message: "updated", data: { note } }
}

export const updateAllTitlesService = async (userId, { title }) => {
    const result = await NoteModel.updateMany({ userId }, { title }, { runValidators: true })
    if (result.matchedCount === 0) errRes({ msg: "No note found", statusCode: 404 })
    return { message: "All notes updated" }
}

export const deleteNoteService = async (noteId, userId) => {
    await getOwnedNote(noteId, userId)
    const note = await NoteModel.findByIdAndDelete(noteId)
    return { message: "deleted", data: { note } }
}

export const paginateNotesService = async (userId, { page = 1, limit = 10 }) => {
    page = Number(page)
    limit = Number(limit)
    const notes = await NoteModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
    return { data: { notes } }
}

export const getNoteByIdService = async (noteId, userId) => {
    const note = await getOwnedNote(noteId, userId)
    return { data: { note } }
}

export const getNoteByContentService = async (userId, content) => {
    const note = await NoteModel.findOne({ userId, content })
    if (!note) errRes({ msg: "No note found", statusCode: 404 })
    return { data: { note } }
}

export const getNotesWithUserService = async (userId) => {
    const notes = await NoteModel.find({ userId })
        .select("title userId createdAt")
        .populate("userId", "email")
    return { data: { notes } }
}

export const aggregateNotesService = async (userId, title) => {
    const match = { userId: new Types.ObjectId(userId) }
    if (title) match.title = { $regex: title, $options: "i" }

    const notes = await NoteModel.aggregate([
        { $match: match },
        { $lookup: { from: UserModel.collection.name, localField: "userId", foreignField: "_id", as: "user" } },
        { $unwind: "$user" },
        { $project: { _id: 0, title: 1, userId: 1, createdAt: 1, "user.name": 1, "user.email": 1 } }
    ])
    return { data: { notes } }
}

export const deleteAllNotesService = async (userId) => {
    await NoteModel.deleteMany({ userId })
    return { message: "Deleted" }
}

// ---------------------------------------------------------------
// WHAT WE DID ABOVE
//
// - getOwnedNote is a helper. It finds the note by id.
//   If there is no note, it sends 404.
//   If the note belongs to another user, it sends 403 (not allowed).
//   Many functions use it, so we write it only once.
//
// 1) createNoteService: save a new note with title, content and user id.
//
// 2) updateNoteService:
//    - Check the owner first.
//    - findByIdAndUpdate changes title and content.
//    - new: true gives back the updated note.
//    - runValidators: true checks the uppercase rule again.
//
// 3) replaceNoteService:
//    - Check the owner first.
//    - findOneAndReplace swaps the WHOLE note with the new data.
//    - We keep userId, so the note still has its owner.
//
// 4) updateAllTitlesService:
//    - updateMany changes the title of ALL notes of this user.
//    - matchedCount is how many notes were found. If 0, send 404.
//
// 5) deleteNoteService:
//    - Check the owner, then findByIdAndDelete removes the note.
//
// 6) paginateNotesService:
//    - sort({ createdAt: -1 }) puts the newest notes first.
//    - skip((page - 1) * limit) jumps over the previous pages.
//    - limit(limit) takes only the number of notes we want.
//
// 7) getNoteByIdService: use the helper, then send the note.
//
// 8) getNoteByContentService:
//    - findOne looks for a note with this user id AND this content.
//    - If there is none, send 404.
//
// 9) getNotesWithUserService:
//    - select keeps only title, userId and createdAt.
//    - populate replaces userId with the real user. We ask for email only.
//
// 10) aggregateNotesService:
//    - Aggregate is a pipeline. Data goes through steps.
//    - $match: keep only this user's notes. If a title is sent,
//      search it with $regex. "i" means ignore big or small letters.
//    - $lookup: join with the users collection.
//    - $unwind: change the user array into one object.
//    - $project: choose which fields to show.
//    - new Types.ObjectId(userId) is needed because aggregate
//      does not change strings to ObjectId by itself.
//
// 11) deleteAllNotesService: deleteMany removes ALL notes of this user.
// ---------------------------------------------------------------