const config = require('./config/config.js');
const express = require("express")
var cors = require("cors")


const app = express()
app.use(cors())
app.use("/images", express.static("./uploads/images"))
app.use(express.json())



app.get('/', (req, res) => {

    return res.send("Welcome From AI-Services Node Server!")

})

const PORT = process.env.PORT || 3000

app.listen(PORT, "0.0.0.0", function () {
    console.log('Server up and running', PORT);
 });

 

//app.use("/api/ai-services", require("./routes/googleAPIs"))

