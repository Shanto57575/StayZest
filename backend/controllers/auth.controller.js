import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/jwtUtils.js";

const googleAuth = async (req, res) => {
    const { uid, email, username, profilePicture } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            const truncatedUsername = username.length > 20 ? username.substring(0, 20) : username;

            user = new User({
                username: truncatedUsername,
                email,
                googleId: uid,
                profilePicture,
                role: "GUEST"
            });

            await user.save();
        }

        generateToken(res, user);

        res.status(200).json({ message: "Signed in successfully", user });
    } catch (error) {
        console.error(`Google Auth Failed: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    try {
        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        generateToken(res, newUser);

        const { password: _, ...userData } = newUser._doc;

        res.status(201).json({ message: "Signed up successfully!", userData });
    } catch (error) {
        console.error(`Sign Up Failed: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// Login Function
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "Wrong email or password" });
        }

        const isPasswordValid = bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        generateToken(res, user);

        const { password: _, ...userData } = user._doc;

        res.status(200).json({ message: "Signed in successfully", user: userData });
    } catch (error) {
        console.error(`Sign In Failed: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};


const logOut = (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: true,
            sameSite: 'strict',
        });
        res.status(200).json({ message: "Logged out successfully!" });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: "Logout failed!" });
    }
};


export { signUp, login, googleAuth, logOut };

