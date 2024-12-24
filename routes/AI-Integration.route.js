const { Router } = require("express");
const { selectAIServiceProvider } = require("../controllers/AI-Integration.controller");
const { isAuthenticatedUser } = require("../middlewares/userAuth")
const router = Router()

router.post('/ai/services', isAuthenticatedUser, selectAIServiceProvider);

module.exports =  router