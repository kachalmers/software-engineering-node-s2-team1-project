/**
 * @file Controller RESTful Web service API for messages resource
 */
import {Express, Request, Response} from "express";
import MessageControllerI from "../interfaces/MessageControllerI";
import MessageDao from "../daos/MessageDao";
import Message from "../models/messages/Message";

/**
 * @class MessageController Implements RESTful Web service API for messages resource
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/messages/sent to retrieve all messages that a user has sent </li>
 *     <li>GET /api/users/:uid/messages/received to retrieve all messages that a user received </li>
 *     <li>GET /api/messages to retrieve all messages from the database for testing purpose </li>
 *     <li>POST /api/users/:uid/messages/:auid to record that a user messages another user </li>
 *     <li>DELETE /api/messages/:mid to record that a user deletes a message </li>
 * </ul>
 * @property {MessageDao} messageDao Singleton DAO implementing like CRUD operations
 * @property {MessageController} messageController Singleton controller implementing
 * RESTful Web service API
 */
export default class MessageController implements MessageControllerI {
    private static messageDao: MessageDao = MessageDao.getInstance();
    private static messageController: MessageController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service API
     * @returns MessageController
     */
    public static getInstance = (app: Express): MessageController => {
        if (MessageController.messageController === null) {
            MessageController.messageController = new MessageController();
            app.get('/api/users/:uid/messages/sent', MessageController.messageController.findAllMessageSent);
            app.get('/api/users/:uid/messages/received', MessageController.messageController.findAllMessageReceived);
            app.get('/api/messages', MessageController.messageController.findAllMessage);
            app.post('/api/users/:uid/messages/:auid', MessageController.messageController.userSendsMessage);
            app.delete('/api/messages/:mid', MessageController.messageController.userDeletesMessage);
        }
        return MessageController.messageController;
    }

    private constructor() {}

    /**
     * Retrieves all messages that a user have sent to others
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user that sent messages to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllMessageSent = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessageSent(req.params.uid)
            .then((messages: Message[]) => res.json(messages));

    /**
     * Retrieves all messages that a user has received from others
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user that received messages to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllMessageReceived = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessageReceived(req.params.uid)
            .then((messages: Message[]) => res.json(messages));

    /**
     * Creates a new message instance to record that a user messages another user
     * @param {Request} req Represents request from client, including body
     * containing the JSON object for the new message to be inserted in the database
     * and path parameter uid and auid representing the user who sends the
     * messages and the user who will receive the message
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new message that was inserted in the
     * database
     */
    userSendsMessage = (req: Request, res: Response) =>
        MessageController.messageDao.userSendsMessage(req.body, req.params.uid, req.params.auid)
            .then((message: Message) => res.json(message));

    /**
     * Removes a message instance from the database
     * @param {Request} req Represents request from client, including path
     * parameter mid identifying the primary key of the message to be removed
     * @param {Response} res Represents response to client, including status
     * on whether deleting a message was successful or not
     */
    userDeletesMessage = (req: Request, res: Response) =>
        MessageController.messageDao.userDeletesMessage(req.params.mid)
            .then(status => res.send(status));

    /**
     * Retrieves all message documents from the database and returns an array of messages
     * (including messages between all users)
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects (including
     * all messages between all users)
     */
    findAllMessage = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessage()
            .then((messages: Message[]) => res.json(messages));
}