import User from "../models/user.model.js";

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        const { password: pass, ...allUsers } = { ...users };
        res.status(200).json(allUsers)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        res.status(200).json(user)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;

    try {
        if (req.file) {
            userData.profilePicture = req.file.path;
        }

        let emailChanged = false

        let findEmail = await User.findById(userId);

        if (userData?.email !== findEmail.email) {
            emailChanged = true;
        }

        console.log(userData.email)
        console.log(findEmail.email)

        const user = await User.findByIdAndUpdate(userId, userData, { new: true });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: 'User updated successfully', user, emailChanged });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByIdAndDelete(userId)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}