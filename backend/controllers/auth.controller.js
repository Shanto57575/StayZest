import User from "../models/user.model.js";
import bcrypt from 'bcrypt'
import { generateToken } from "../utils/jwtUtils.js";


const signUp = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(404).json({ error: 'All Fields are required!' })
    }

    try {
        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already in Use' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        generateToken(res, newUser);

        const { password: pass, ...userData } = { ...newUser._doc };

        res.status(201).json({ message: "Signed Up successfully!", userData })

    } catch (error) {
        console.error(`Sign Up Failed !${error}`);
        res.status(500).json({ error: error.message });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)

    if (!email || !password) {
        return res.status(404).json({ error: 'All Fields are required!' })
    }

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ error: "Wrong Email or Password" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" })
        }

        generateToken(res, user);

        const { password: pass, ...userData } = { ...user._doc };

        res.status(200).json({ message: "Signed in successfully", user: userData })
    } catch (error) {
        console.error(`Sign In Failed !${error.message}`);
        res.status(500).json({ error: error.message });
    }
}

const logOut = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: "Logged out successfully!" })
}

export { signUp, login, logOut };