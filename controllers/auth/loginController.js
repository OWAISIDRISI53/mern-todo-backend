import Joi from "joi"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../../models/user.js"


const loginController = {
    login: async (req, res) => {

        // validate the request data
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        })

        const { error } = schema.validate(req.body)
        if (error) {
            return res.status(400).send({ error: error.details[0].message, success: false })
        }

        // step 2: check if the user exists in the database

        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(404).send({ error: "User not found", success: false })
            }

            // verify the password
            const isPasswordValid = await bcrypt.compare(req.body.password, user.password)

            if (!isPasswordValid) {
                return res.status(401).send({ error: "Invalid password", success: false })
            }

            // generate JWT token
            // const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" })
            const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET)

            // send response with the token
            return res.status(200).send({ message: "Login successfully", token: token, success: true });

        } catch (err) {
            return res.status(500).send({ error: "Internal server error", success: false })
        }
    }
}

export default loginController