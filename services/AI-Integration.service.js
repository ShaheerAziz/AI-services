const { GoogleGenerativeAI } = require("@google/generative-ai");
const { OpenAI } = require("openai"); // Add this line to import OpenAIAPI
const { RunwayMLAPI } = require("@runwayml/sdk"); // Add this line to import RunwayMLAPI
const { ElevenLabsAPI } = require("elevenlabs"); // Add this line to import ElevenLabsAPI
const { ApiError } = require("../utils/ApiError")
const path = require('path')
const multiparty = require('multiparty')
const config = require('../config/config');


// - Gemini: Text → Text  
// - OpenAI: Text → Text  
// - RunwayML: Text + Images → Video    
// - Eleven Labs: Text → Audio  



const selectAIServiceProvider = async (req) => {

    if (!req.user) throw new ApiError(404, "User Not Found!")
    console.log(req.user.dataValues)
    const { searchModel } = req.query 

    switch (searchModel) { // Added switch statement
        case '1':
            return await geminiTextToText(req);
        case '2':
            return await openAITextToText(req);
        case '3':
            return await runwayMLTextToText(req);
        case '4':
            return await elevenLabsTextToText(req);
        default:
            throw new ApiError(400, "Invalid Model Input");
    }

}
 
const geminiTextToText = async (req) => {

    try{

        const genAI = new GoogleGenerativeAI(req.user.geminiKey);

        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_TEXT_MODEL});
    
        // Getting prompt from body
        const prompt = req.body.prompt
    
        // Generating response against the given promp
        const result = await model.generateContent(prompt);
        const data = result.response.text();

        //console.log(data);
        return data

    }catch(error){

        res.status(400).json({
            status: 400,
            data: "",
            success: false,
            error: error
            
        })  
    }

}


const openAITextToText = async (req) => {

    try {
        const openAI = new OpenAI({
            apiKey: req.user.openAIKey
        });
        const response = await openAI.chat.completions.create({
            model: process.env.OPEN_AI_TEXT_MODEL,
            messages: [{ role: "user", content: req.body.prompt }], // Added messages parameter
            max_tokens: 50  // Adjust max_tokens as needed to control the length of the generated text
        })

        return response.choices[0].message.content

    } catch (error) {
        console.log(error)
    }
}


const runwayMLTextImageToVideo = async (req) => {

    try {
        const runwayML = new RunwayMLAPI(config.apiKey);
        const model = runwayML.getGenerativeModel({ model: config.textImgModel });
        const result = await model.generateContent(query);
        const data = result.response.text();
        // Saving data to the database
        await dbService.saveData(req.username, query, data, "");
        res.status(200).json({
            status: 200,
            data: data,
            success: true,
            error: ""
        });
    } catch (error) {
        res.status(400).json({
            status: 400,
            data: "",
            success: false,
            error: error
        });
    }
}


const elevenLabsTextToAudio = async (req) => {

    try {
        const elevenLabs = new ElevenLabsAPI(config.apiKey);
        const model = elevenLabs.getGenerativeModel({ model: config.textModel });
        const result = await model.generateContent(query);
        const data = result.response.text();
        // Saving data to the database
        await dbService.saveData(req.username, query, data, "");
        res.status(200).json({
            status: 200,
            data: data,
            success: true,
            error: ""
        });
    } catch (error) {
        res.status(400).json({
            status: 400,
            data: "",
            success: false,
            error: error
        });
    }
}




// Converts local file information to a GoogleGenerativeAI.Part object.
async function fileToGenerativePart(path, mimeType) {

    const fs = require("fs");

    return {
        inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType
        },
    };
    
}

module.exports = { 
    selectAIServiceProvider 
}
