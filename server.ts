import express from 'express';
import UserController from './controllers/UserController';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import TuitController from "./controllers/TuitController";

const app = express();

app.get('/hello', (req, res) =>
    res.send('Hello World!'));

app.get('/add/:a/:b', (req, res) => {
    res.send(req.params.a + req.params.b);
})

mongoose.connect('mongodb+srv://kchalmers:DBCS5500@cluster0.6gwsm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
mongoose.connect('mongodb://localhost:27017/tuiter');

app.use(bodyParser.json())

const userController = UserController.getInstance(app);
const tuitController = TuitController.getInstance(app);

const PORT = 4000;
app.listen(process.env.PORT || PORT);
