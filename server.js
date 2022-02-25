const express = require('express');
const app = express();

// Hello world
app.get('/hello', (req, res) =>
    res.send('Hello World!'));

/**
 * Start a server listening at port 4000 locally.
 */
const PORT = 4000;
app.listen(PORT);
