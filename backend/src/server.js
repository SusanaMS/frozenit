const express = require("express");
const dotenv = require('dotenv');

// Init express
const app = express();

// Init environment
dotenv.config();

const port = Number(process.env.PORT || 3331);

// simple hello world test
app.get('/', (req, res) => {
    res.send('Hello World!')
})

// start  server
app.listen(port, () =>
    console.log(`Running on port ${port}!`));

module.exports = app;
