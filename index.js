import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

config();

const app = express();
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const PORT = 3000;

// Helper function to generate content using the Gemini API
async function generateContentPrompt(prompt) {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        throw new Error("Error generating content: " + error.message);
    }
}

// Endpoint to generate HTML with template and content
app.post('/generate', async (req, res) => {
    const { template, content } = req.body;

    if (!template || !content) {
        return res.status(400).send({ error: 'Template and content are required' });
    }

    try {
        const prompt = `Insert the content "${content}" into the HTML template "${template}". Return only the modified HTML code, without explanations or formatting.`;
        const generatedHtml = await generateContentPrompt(prompt);
        res.status(200).send({ html: generatedHtml });
    } catch (error) {
        res.status(500).send({ error: 'Error generating HTML' });
    }
});

// Endpoint to modify existing HTML content
app.post('/modify', async (req, res) => {
    const { html, changes } = req.body;

    if (!html || !changes) {
        return res.status(400).send({ error: 'HTML and change instructions are required' });
    }

    try {
        const changesDescription = typeof changes === 'object'
            ? Object.entries(changes).map(([key, value]) => `${key}: ${value}`).join(', ')
            : changes;

        const prompt = `Modify the following HTML: "${html}". Apply the following changes: "${changesDescription}". Return only the modified HTML code, without explanations or extra formatting.`;
        const modifiedHtml = await generateContentPrompt(prompt);
        res.status(200).send({ html: modifiedHtml });
    } catch (error) {
        res.status(500).send({ error: 'Error modifying HTML' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
