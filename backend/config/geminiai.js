import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
});

const generationConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 2048,
};

const run = async (prompt) => {
    if (typeof prompt !== 'string') {
        throw new TypeError("Prompt must be a string.");
    }

    const chatSession = model.startChat({
        generationConfig,
        history: [
            {
                role: "user",
                parts: [
                    {
                        text: `You will create a detailed trip itinerary in a structured and standardized format. Use numbered points for each activity, and format all titles and headings in bold without adding asterisks at the beginning or end of the text.
    
                        Follow this structure for each day:
    
                        Day X: [Day Summary]
    
                        1. Activity: [Activity Name] (Use bold text for the activity name and include relevant emojis)
                           - Location: [Place Location] (Include the full address if possible)
                           - Nearest Hotel: [Hotel Name and Location] (Provide the nearest recommended hotel with its address)
    
                        2. Activity: [Next Activity Name] (Follow the same structure for each activity)
                           - Location: [Place Location] 
                           - Nearest Hotel: [Hotel Name and Location]
    
                        Pro Tips:
                        - Provide any additional notes or tips for the day here.
    
                        Ensure that the response is clear, organized, and follows this format strictly. Do not include extra text or deviations from the structure provided.`
                    },
                ],
            },
            {
                role: "model",
                parts: [
                    { text: `Day 1: Arrival in Paris & Exploring Montmartre\n\n1. Activity: Arrive at Charles de Gaulle Airport (CDG) ✈️\n   - Location: Paris, France\n - Nearest Hotel: Hôtel de France, 9 Rue de France, 75009 Paris\n - \n\n2. Activity: Check into your hotel and relax 🛌\n - Location: Hôtel de France, 9 Rue de France, 75009 Paris\n - Nearest Hotel: Hôtel de France, 9 Rue de France, 75009 Paris\n - \n\n3. Activity: Explore the charming streets of Montmartre 🎨\n - Location: 18th arrondissement, Paris\n - Nearest Hotel: Hôtel du Pré Catelan, 12 Rue de Messine, 75017 Paris\n \n\n4. Activity: Enjoy dinner with a view at the Sacré-Cœur Basilica ⛪️\n - Location: Place du Tertre, 75018 Paris\n - Nearest Hotel: Hôtel du Pré Catelan, 12 Rue de Messine, 75017 Paris\n - \n\nNotes:\n- Take a leisurely stroll through Montmartre and admire the street art.\n- Enjoy a Parisian dinner at a restaurant with stunning views of the city.` }
                ],
            },
        ],
    });

    try {
        const result = await chatSession.sendMessage(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};


export default run;
