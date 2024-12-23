const userRepository = require("../repositories/user.repository");
const crypto = require("crypto"); // Import crypto for encoding/decoding


const userRegistration = async (req) => {
    const { email, geminiKey, openAIKey, elevenLabsKey, runwayMLKey } = req.body
    console.log(req.body)
    const _user = await userRepository.findUserByEmail(email)
    
    const token = await generateTokenAndExpiry()

    let tokens = []
    if (_user){
        tokens = _user.tokens
        tokens.push(token)
    }else{
        tokens.push(token)
    }

    const userData = {
        tokens,
        email,
        geminiKey,
        openAIKey,
        elevenLabsKey,
        runwayMLKey
    }

    if(!_user){

        const user = await userRepository.registerUser(userData)
    
    }else{
        
        const updatedUser = await userRepository.updateUser(_user.id, userData)

    }

    return token
}


const generateTokenAndExpiry = async () => {
    const token = crypto.randomBytes(20).toString("hex");
    return token
};



module.exports = {
    userRegistration
};
