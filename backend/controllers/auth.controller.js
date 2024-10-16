import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { generateTokens, verifyAccessToken, verifyRefreshToken } from "../utils/jwtUtils.js";

const setTokens = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 15 * 24 * 60 * 60 * 1000,
    });
};

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

        const { accessToken, refreshToken } = generateTokens(user);
        setTokens(res, accessToken, refreshToken);

        res.status(200).json({ message: "Signed in successfully", user });
    } catch (error) {
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

        const { accessToken, refreshToken } = generateTokens(newUser);
        setTokens(res, accessToken, refreshToken);

        const { password: _, ...userData } = newUser._doc;

        res.status(201).json({ message: "Signed up successfully!", user: userData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        const { accessToken, refreshToken } = generateTokens(user);
        setTokens(res, accessToken, refreshToken);

        const { password: _, ...userData } = user._doc;

        res.status(200).json({ message: "Signed in successfully", user: userData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token not found' });
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }

    try {
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user);
        setTokens(res, newAccessToken, newRefreshToken);


        res.status(200).json({ message: 'Access token refreshed successfully' });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ error: 'Error refreshing token' });
    }
};

const checkAuth = async (req, res) => {
    const accessToken = req.cookies?.accessToken;
    console.log("Inside checkAuth", accessToken)

    if (!accessToken) {
        return res.status(401).json({ error: 'No Access Token' });
    }

    try {
        const decoded = verifyAccessToken(accessToken);

        if (!decoded) {
            return res.status(401).json({ error: 'Invalid access token' });
        }

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password: _, ...userData } = user._doc;

        res.status(200).json({ message: "Authenticated successfully", user: userData });
    } catch (error) {
        res.status(500).json({ error: 'Error checking authentication' });
    }
};

const logOut = (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
    });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
    });

    res.status(200).json({ message: "Successfully Logged Out!" });
};

export { signUp, login, googleAuth, refreshAccessToken, checkAuth, logOut };