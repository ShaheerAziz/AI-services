const userRepository = require("../repositories/user.repository");


const userRegistration = async (req) => {
    const { email, geminiKey, openAIKey, elevenLabsKey, runwayMLKey } = req.body

    const user = await userRepository.registerUser({
        email,
        geminiKey,
        openAIKey,
        elevenLabsKey,
        runwayMLKey
    })


}


module.exports = {
    userRegistration
};
