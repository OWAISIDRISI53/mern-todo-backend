import Joi from "joi"
import User from "../../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const registerController = {
    register: async (req, res, next) => {
        // CHECKLIST
        // [ DONE: ] validate the request
        // [ DONE: ] authorise the request
        // [ DONE: ] check if user is in the database already
        // [ DONE: ] prepare model
        // [ DONE: ] store in database
        // [ DONE: ] generate jwt token
        // [ DONE: ] send response


        //  validate the request
        const schema = Joi.object({
            name: Joi.string().min(3).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        })

        const { error } = schema.validate(req.body)  // validate request data
        if (error) {
            return res.status(400).send({ error: error.details[0].message })
        }

        // ckeck if the user is already exists in database
        try {
            const exist = await User.exists({ email: req.body.email })
            if (exist) {
                return res.status(409).send({ error: 'User already exists' })
            }

        } catch (err) {
            return res.status(500).send({ error: err.message, customError: "Something went wrong" })
        }

        // prepare the model
        const { name, email, password } = req.body

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ name, email, password: hashedPassword })

        try {
            const newUser = await user.save()
            // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

            return res.status(201).send({ message: "User registered successfully", token: token, success: true })

        } catch (err) {
            return res.status(500).send({ error: "Error saving user to database", message: err.message })
        }
    },

}

export default registerController
