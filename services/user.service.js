const userRepository = require("../repositories/user.repository");
const crypto = require("crypto"); // Import crypto for encoding/decoding


const userRegistration = async (req) => {
    const { email, geminiKey, openAIKey, elevenLabsKey, runwayMLKey } = req.body

    const _user = await userRepository.findUserByEmail(email)
    const token = await generateTokenAndExpiry()

    const userData = {
        token,
        email,
        geminiKey,
        openAIKey,
        elevenLabsKey,
        runwayMLKey
    }

    if(!_user){

        const user = await userRepository.registerUser(userData)
    
    }else{

        _user.token.push(token)
        _user.geminiKey = geminiKey
        _user.openAIKey = openAIKey
        _user.elevenLabsKey = elevenLabsKey
        _user.runwayMLKey = runwayMLKey
        await _user.save()

    }

    return token
}


const generateTokenAndExpiry = async () => {
    const token = crypto.randomBytes(20).toString("hex");
    return token
};

const uodateUser = async (user) => {

}



module.exports = {
    userRegistration
};
