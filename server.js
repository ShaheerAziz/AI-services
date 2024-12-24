const config = require('./config/config.js');
const express = require("express")
var cors = require("cors")
const path = require('path');

var bodyParser = require('body-parser')



const app = express()
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(express.json())


app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).send('Something broke!'); // Send a generic error response
});

app.get('/', (req, res) => {

    return res.send("Welcome From AI-Services Node Server!")

})

const PORT = process.env.PORT || 3000

app.listen(PORT, "0.0.0.0", function () {
    console.log('Server up and running', PORT);
 });


app.use("/api/v1", require("./routes/user.route.js"))
app.use("/api/v1", require("./routes/AI-Integration.route.js"))

