/**
 * @file Implements an Express HTTP server. Declares RESTful Web services
 * enabling CRUD operations on the following resources:
 * <ul>
 *     <li>users</li>
 *     <li>tuits</li>
 *     <li>dislikes</li>
 *     <li>likes</li>
 *     <li>bookmarks</li>
 *     <li>follows</li>
 *     <li>messages</li>
 * </ul>
 *
 * Connects to a remote MongoDB instance hosted on the Atlas cloud database
 * service.
 */
import express from 'express';
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import TuitController from "./controllers/TuitController";
import UserController from "./controllers/UserController";
import AuthenticationController from "./controllers/AuthenticationController";
import LikeController from "./controllers/LikeController";
import DislikeController from "./controllers/DislikeController";
import FollowController from "./controllers/FollowController";
import BookmarkController from "./controllers/BookmarkController";
import MessageController from "./controllers/MessageController";

const session = require("express-session");
dotenv.config();    // Configure environment variables in .env file
const app = express();

const CORS_ORIGIN = process.env.CORS_ORIGIN;// || 'http://localhost:3000';
const CORS_ORIGINs = //[CORS_ORIGIN, 'http://localhost']  // add localhost for local testing
app.use(cors({
    credentials: true,
    origin: CORS_ORIGIN
}));

let sess = {
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
        sameSite: process.env.ENVIRONMENT === "PRODUCTION" ? 'none' : 'lax',
        secure: process.env.ENVIRONMENT === "PRODUCTION",
    }
}

if (process.env.ENVIRONMENT === 'PRODUCTION') {
    app.set('trust proxy', 1) // trust first proxy
}

app.use(session(sess));

// build the connection string
const PROTOCOL = "mongodb+srv";
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const HOST = "cluster0.txaig.mongodb.net";
const DB_NAME = "tuiter";
const DB_QUERY = "retryWrites=true&w=majority";
const connectionString = `${PROTOCOL}://${DB_USERNAME}:${DB_PASSWORD}@${HOST}/${DB_NAME}?${DB_QUERY}`;// connect to the database
mongoose.connect(connectionString);


// configure HTTP body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Create RESTful Web service API
const userController = UserController.getInstance(app);
const tuitController = TuitController.getInstance(app);
const likeController = LikeController.getInstance(app);
const dislikeController = DislikeController.getInstance(app);
const followController = FollowController.getInstance(app);
const bookmarkController = BookmarkController.getInstance(app);
const messageController = MessageController.getInstance(app);
const authenticationController = AuthenticationController.getInstance(app);

/**
 * Start a server listening at port 4000 locally, but use environment
 * variable PORT on Heroku if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT);