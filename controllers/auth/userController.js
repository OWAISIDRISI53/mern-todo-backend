import User from "../../models/user.js"

const userController = {
    me: async (req, res, next) => {
        try {
            const user = await User.findOne({ _id: req.user.id })
            if (!user) return res.status(404).send({ error: "User not found" });

            return res.status(200).send({ user })
        } catch (err) {
            return res.status(500).send({ error: err.message || "An error occurred while retrieving user data" });

        }
    }
}

export default userController