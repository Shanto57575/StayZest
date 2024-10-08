import run from "../config/geminiai.js";

const tripPlanner = async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const response = await run(prompt);
        return res.status(200).json({ plan: response });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while generating the trip plan." });
    }
};

export default tripPlanner;