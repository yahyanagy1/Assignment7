import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { successRes } from "../../utils/success.res.js";
import {
    createNoteService,
    updateNoteService,
    replaceNoteService,
    updateAllTitlesService,
    deleteNoteService,
    paginateNotesService,
    getNoteByIdService,
    getNoteByContentService,
    getNotesWithUserService,
    aggregateNotesService,
    deleteAllNotesService
} from "./note.service.js";

const router = Router();

export const routes = {
    base: "/notes",
    root: "/",
    all: "/all",
    replace: "/replace/:noteId",
    paginate: "/paginate-sort",
    byContent: "/note-by-content",
    withUser: "/note-with-user",
    aggregate: "/aggregate",
    byId: "/:noteId"
}

router.post(routes.root, async (req, res) => {
    const { message } = await createNoteService(req.query.userId, req.body)
    successRes({ res, message, status: StatusCodes.CREATED })
})

router.patch(routes.all, async (req, res) => {
    const { message } = await updateAllTitlesService(req.query.userId, req.body)
    successRes({ res, message })
})

router.put(routes.replace, async (req, res) => {
    const { message, data } = await replaceNoteService(req.params.noteId, req.query.userId, req.body)
    successRes({ res, message, data })
})

router.get(routes.paginate, async (req, res) => {
    const { data } = await paginateNotesService(req.query.userId, req.query)
    successRes({ res, data })
})

router.get(routes.byContent, async (req, res) => {
    const { data } = await getNoteByContentService(req.query.userId, req.query.content)
    successRes({ res, data })
})

router.get(routes.withUser, async (req, res) => {
    const { data } = await getNotesWithUserService(req.query.userId)
    successRes({ res, data })
})

router.get(routes.aggregate, async (req, res) => {
    const { data } = await aggregateNotesService(req.query.userId, req.query.title)
    successRes({ res, data })
})

router.get(routes.byId, async (req, res) => {
    const { data } = await getNoteByIdService(req.params.noteId, req.query.userId)
    successRes({ res, data })
})

router.patch(routes.byId, async (req, res) => {
    const { message, data } = await updateNoteService(req.params.noteId, req.query.userId, req.body)
    successRes({ res, message, data })
})

router.delete(routes.root, async (req, res) => {
    const { message } = await deleteAllNotesService(req.query.userId)
    successRes({ res, message })
})

router.delete(routes.byId, async (req, res) => {
    const { message, data } = await deleteNoteService(req.params.noteId, req.query.userId)
    successRes({ res, message, data })
})

export default router;

// ---------------------------------------------------------------
// WHAT WE DID ABOVE
//
// - The controller only gets the request and sends the answer.
// - The user id comes from the query: ?userId=...
// - The note id comes from the URL: /notes/:noteId
// - ORDER IS IMPORTANT. Fixed paths (/all, /replace/..., /paginate-sort,
//   /note-by-content, /note-with-user, /aggregate) must be BEFORE /:noteId.
//   If not, Express thinks "aggregate" is a noteId and crashes.
// - POST /notes -> create a note (status 201).
// - PATCH /notes/all -> update the title of all my notes.
// - PUT /notes/replace/:noteId -> replace one whole note.
// - GET /notes/paginate-sort?page=1&limit=3 -> notes by pages.
// - GET /notes/note-by-content?content=... -> find a note by content.
// - GET /notes/note-with-user -> notes with the user email.
// - GET /notes/aggregate?title=... -> notes + user name and email.
// - GET /notes/:noteId -> one note, only for its owner.
// - PATCH /notes/:noteId -> update one note.
// - DELETE /notes -> delete all my notes.
// - DELETE /notes/:noteId -> delete one note.
// ---------------------------------------------------------------