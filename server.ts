import express from 'express';
const app = express();

app.get('/hello', (req, res) =>
    res.send('Hello World!'));

app.get('/add/:a/:b', (req, res) => {
    res.send(req.params.a + req.params.b);
})

const PORT = 4000;
app.listen(process.env.PORT || PORT);