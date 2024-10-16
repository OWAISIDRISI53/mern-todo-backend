import Joi from "joi"
import Note from "../../models/notes.js"
import notes from "../../models/notes.js"

const noteController = {
    addNote: async (req, res) => {
        // CHECKLIST
        // [ DONE: ] validate the request
        // [ DONE: ] prepare model
        // [ DONE: ] store in database
        // [ DONE: ] send response

        // validate the request
        const schema = Joi.object({
            title: Joi.string().min(3).required(),
            description: Joi.string().min(5).required(),
            tag: Joi.string().allow("").optional()
        })

        const { error } = schema.validate(req.body)

        if (error) {
            return res.status(400).send({ error: error.details[0].message })
        }

        const { title, description, tag } = req.body
        const note = new Note({ title, description, tag, user: req.user.id, })
        try {
            const savedNote = await note.save()
            return res.status(201).send({ message: "TODO saved successfully", success: true, note: savedNote })

        } catch (err) {
            return res.status(500).send({ error: err.message, customError: "Something went wrong" })
        }
    },

    getAllNote: async (req, res) => {
        try {
            const notes = await Note.find({ user: req.user.id })
            return res.status(200).send(notes)
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: "Internal Server Error" });
        }
    },

    updateNote: async (req, res, next) => {
        // create a new note object
        const { title, description, tag } = req.body
        try {
            const newNote = {}
            if (title) newNote.title = title
            if (description) newNote.description = description
            if (tag) newNote.tag = tag

            // find note
            let note = await Note.findById(req.params.id)
            if (!note) {
                return res.status(404).send({ message: "Not found" })
            }

            if (note.user.toString() !== req.user.id) {
                return res.status(401).send({ message: "Not allowed" })
            }

            note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
            return res.status(201).send({ note, success: true })
        } catch (err) {
            console.log(err)
            return res.status(500).send({ error: "Internal Server Error" })
        }
    },

    deleteNote: async (req, res, next) => {
        try {
            // Find the note to be delete and delete it
            let note = await Note.findById(req.params.id)
            if (!note) {
                return res.status(404).send({ message: "Todo not found" })
            }
            // Allow deletion only if user owns this Note
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send({ message: "Not allowed" })
            }

            note = await Note.findByIdAndDelete(req.params.id)
            return res.status(200).send({ message: "Todo deleted successfully", success: true, note: note })
        } catch (err) {
            console.log(err);
            return res.status(500).send({ error: "Internal Server Error" })
        }
    }

}
export default noteController