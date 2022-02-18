/**
 * @file Controller RESTful Web service API for messages resource
 */
import {Express, Request, Response} from "express";
import MessageDao from "../daos/MessageDao";
import Message from "../models/messages/Message"
import MessageControllerI from "../interfaces/MessageControllerI";

/**
 * @class UserController Implements RESTful Web service API for messages resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/messages to retrieve all the tuits messaged by a user
 *     </li>
 *     <li>GET/messages to retrieve all users that messaged a tuit
 *     </li>
 *     <li>POST /api/users/:u to record that a user messages a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid to record that a user
 *     no londer messages a tuit</li>
 * </ul>
 * @property {MessageDao} messageDao Singleton DAO implementing messages CRUD operations
 * @property {MessageController} MessageController Singleton controller implementing
 * RESTful Web service API
 */
export default class MessageController implements MessageControllerI {
    private static messageDao: MessageDao = MessageDao.getInstance();
    private static messageController: MessageController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return UserController
     */
    public static getInstance = (app: Express): MessageController => {
        if(MessageController.messageController === null) {
            MessageController.messageController = new MessageController();
            app.get("/api/messages", MessageController.messageController.findAllMessages);
            app.get("/api/users/:uid/messages", MessageController.messageController.findAllMessagesSentByUser);
            app.get("/api/messages/:uid", MessageController.messageController.findAllMessagesSentToUser);
            app.post("/api/users/:uid/messages/:ouid", MessageController.messageController.userMessagesUser);
            app.delete("/api/messages/:mid", MessageController.messageController.userDeletesMessage);
        }
        return MessageController.messageController;
    }

    private constructor() {}

    findAllMessages = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessages()
            .then(messages => res.json(messages));

    /**
     * Retrieves all messages sent by a user from the database
     * @param {Request} req Represents request from client, including the path
     representing the messaged tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllMessagesSentByUser = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessagesSentByUser(req.params.uid)
            .then(messages => res.json(messages));

    /**
     * Retrieves all messages sent to a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user messaged the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were messaged
     */
    findAllMessagesSentToUser = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessagesSentToUser(req.params.uid)
            .then(messages => res.json(messages));

    /**
     * Creates message from one user to another.
     * @param {Request} req Represents request from client, including the
     * path parame representing the user that is messaging the tuit
     * and the tuit being messaged
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new messages that was inserted in the
     * database
     */
    userMessagesUser = (req: Request, res: Response) =>
        MessageController.messageDao.userMessagesUser(req.params.uid, req.params.ouid, req.body)
            .then((message: Message) => res.json(message));

    /**
     *
     * @param {Request} req Represents request from client, including the
     * path parameters mid representing the message that is deleting
     * the message and the message being deleted
     * @param {Response} res Represents response to client, including status
     * on whether deleting the message was successful or not
     */
    userDeletesMessage = (req: Request, res: Response) =>
        MessageController.messageDao.userDeletesMessage(req.params.mid)
            .then(status => res.send(status));
};