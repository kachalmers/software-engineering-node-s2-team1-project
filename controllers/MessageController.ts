/**
 * @file Controller RESTful Web service API for messages resource
 */
import {Express, Request, Response} from "express";
import MessageDao from "../daos/MessageDao";
import Message from "../models/messages/Message"
import MessageControllerI from "../interfaces/MessageControllerI";

/**
 * @class MessageController Implements RESTful Web service API for messages resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/messages to retrieve all messages</li>
 *     <li>GET /api/users/:uid/messages to find messages sent by user</li>
 *     <li>GET /api/messages/:uid to find messages sent to user</li>
 *     <li>GET /api/messages/:mid to find message by its mid PK</li>
 *     <li>PUT /api/messages/:mid to update a message by its mid PK</li>
 *     <li>POST /api/users/:uid/messages/:ouid to send a message from one
 *     user to another</li>
 *     <li>DELETE /api/messages/:mid to delete a message by its mid PK</li>
 * </ul>
 * @property {MessageDao} messageDao Singleton DAO implementing messages CRUD operations
 * @property {MessageController} MessageController Singleton controller implementing
 * RESTful Web service API
 */
export default class MessageController implements MessageControllerI {
    private static messageDao: MessageDao = MessageDao.getInstance();
    private static messageController: MessageController | null = null;
    /**
     * Creates singleton controller instance.
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return {MessageController} MessageController
     */
    public static getInstance = (app: Express): MessageController => {
        if(MessageController.messageController === null) {
            MessageController.messageController = new MessageController();
            app.get("/api/messages", MessageController.messageController.findAllMessages);
            app.get("/api/users/:uid/messages", MessageController.messageController.findAllMessagesSentByUser);
            app.get("/api/users/messages/:uid", MessageController.messageController.findAllMessagesSentToUser);
            app.get("/api/messages/:mid", MessageController.messageController.findMessageById);
            app.put("/api/messages/:mid", MessageController.messageController.updateMessage);
            app.post("/api/users/:uid/messages/:ouid", MessageController.messageController.userMessagesUser);
            app.delete("/api/messages/:mid", MessageController.messageController.userDeletesMessage);
        }
        return MessageController.messageController;
    }

    private constructor() {}

    /**
     * Retrieves all messages from the database.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllMessages = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessages()
            .then(messages => res.json(messages));

    /**
     * Retrieves all messages sent by a user from the database.
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user who sent the messages
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllMessagesSentByUser = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessagesSentByUser(req.params.uid)
            .then(messages => res.json(messages));

    /**
     * Retrieves all messages sent to a user from the database.
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user that received the messages
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllMessagesSentToUser = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessagesSentToUser(req.params.uid)
            .then(messages => res.json(messages));

    /**
     * Retrieves message by its primary key.
     * @param {Request} req Represents request from client, including path
     * parameter mid identifying the primary key of the message to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the message that matches the message ID
     */
    findMessageById = (req: Request, res: Response) =>
        MessageController.messageDao.findMessageById(req.params.mid)
            .then(messages => res.json(messages));

    /**
     * Updates message by its primary key.
     * @param {Request} req Represents request from client, including path
     * parameter mid identifying the primary key of the message to be updated
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the message that matches the message ID
     */
    updateMessage = (req: Request, res: Response) =>
        MessageController.messageDao.updateMessage(req.params.mid, req.body)
            .then((message: Message) => res.json(message));

    /**
     * Creates message from one user to another.
     * @param {Request} req Represents request from client, including the
     * path parameters representing the user that is messaging the other user,
     * the user being messaged, and body containing the JSON object for the new
     * message
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