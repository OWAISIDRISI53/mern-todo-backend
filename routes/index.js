import express from "express";
import registerController from "../controllers/auth/registerController.js"
import loginController from "../controllers/auth/loginController.js"
import userController from "../controllers/auth/userController.js"
import authenticateUser from "../middlewares/auth.js";
import noteController from "../controllers/note/noteController.js";
const router = express.Router();


// User routes
router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get("/me", authenticateUser, userController.me)

// notes routes
router.post('/addnote', authenticateUser, noteController.addNote)
router.get('/getallnotes', authenticateUser, noteController.getAllNote)
router.put('/updatenote/:id', authenticateUser, noteController.updateNote)
router.delete('/deletenote/:id', authenticateUser, noteController.deleteNote)

export default router;