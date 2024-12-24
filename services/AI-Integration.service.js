const { GoogleGenerativeAI } = require("@google/generative-ai");
const { OpenAI } = require("openai"); // Add this line to import OpenAIAPI
const { RunwayML } = require("@runwayml/sdk"); // Add this line to import RunwayMLAPI
const { ElevenLabsClient, play } = require("elevenlabs");
const ApiError = require("../utils/ApiError")
const config = require('../config/config');
const { uploadImage } = require("../utils/uplaodDocument")


// - Gemini: Text → Text  
// - OpenAI: Text → Text  
// - RunwayML: Text + Images → Video    
// - Eleven Labs: Text → Audio  



const selectAIServiceProvider = async (req, res) => {

    if (!req.user) throw new ApiError(404, "User Not Found!")

    const { searchModel } = req.query 

    switch (searchModel) { // Added switch statement
        case '1':
            return await geminiTextToText(req, res);
        case '2':
            return await openAITextToText(req, res);
        case '3':
            return await runwayMLTextImageToVideo(req, res);
        case '4':
            return await elevenLabsTextToAudio(req, res);
        default:
            throw new ApiError(400, "Invalid Model Input");
    }

}
 
const geminiTextToText = async (req, res) => {

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
        throw new ApiError(400, error)
    }

}


const openAITextToText = async (req, res) => {

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

        return {
            status: 400,
            data: "",
            success: false,
            error: error
            
        }     
    }
}


const runwayMLTextImageToVideo = async (req, res) => {

    try {

        if (!req.files || req.files.length === 0) throw new ApiError(404, "Image Not Found!")
        //console.log(req.files)
        const image = await uploadImage(req)
        console.log(image)
        const runwayML = new RunwayML({
            apiKey: req.user.runwayMLKey, // This is the default and can be omitted
        });
        console.log(req.user.runwayMLKey)
        const imageToVideo = await runwayML.imageToVideo.create({
            model: 'gen3a_turbo',
            promptImage: image,
            promptText: req.body.prompt,
        });
        
        console.log(imageToVideo.id);

    } catch (error) {
       // console.log(error)
        throw new ApiError(400, error)
    }
}


const elevenLabsTextToAudio = async (req, res) => {

    try {

        const elevenlabs = new ElevenLabsClient({
            apiKey: req.user.elevenLabsKey, // Defaults to process.env.ELEVENLABS_API_KEY
        });
        
        const voices = await elevenlabs.textToVoice.createPreviews({
            voice_description: "Generate audio in a polite man voice",
            text: req.body.prompt
        });

        const voicePreview1 = voices.previews[0].audio_base_64;
        const uniqueFileName = `voicePreview_${Date.now()}.mp3`;
        const filePath = path.join(__dirname, '..', 'public', 'audio', uniqueFileName);
        fs.writeFileSync(filePath, Buffer.from(voicePreview1, 'base64'));
        const audioLink = process.env.NODE_ENV === 'production' ? `${process.env.BASE_URL_PRODUCTION}/public/audio/${uniqueFileName}` : `${process.env.BASE_URL_DEVELOPMENT}/public/audio/${uniqueFileName}`;

        return {
            voicePreview1,
            audioLink
        }

    } catch (error) {
        console.log(error)
        throw new ApiError(400, error)

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
