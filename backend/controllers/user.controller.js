import User from "../models/user.model.js";

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        console.log(user)
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
    console.log("req.file", req.file)
    try {
        if (req.file) {
            userData.profilePicture = req.file.path
        }

        const user = await User.findByIdAndUpdate(userId, userData, { new: true })

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(200).json({ error: error });
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
        res.status(500).json({ error: error.message });
    }
}

const getAllUsersWithBookingCount = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'bookings',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'bookings'
                }
            },
            {
                $addFields: {
                    bookingCount: { $size: '$bookings' }
                }
            },
            {
                $project: {
                    _id: 1,
                    profilePicture: 1,
                    username: 1,
                    email: 1,
                    role: 1,
                    bookingCount: 1,
                    createdAt: 1
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

export {
    getAllUsersWithBookingCount,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}