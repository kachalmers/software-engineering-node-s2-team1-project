/**
 * @file Implements DAO managing data storage of messages. Uses mongoose
 * MessageModel to integrate with MongoDB.
 */
import MessageDaoI from "../interfaces/MessageDaoI";
import MessageModel from "../mongoose/messages/MessageModel";
import Message from "../models/messages/Message";

/**
 * @class MessageDao Implements Data Access Object managing data storage of
 * Messages.
 * @property {MessageDao} messageDao Private single instance of MessageDao
 */
export default class MessageDao implements MessageDaoI {
    private static messageDao: MessageDao | null = null;

    /**
     * Creates singleton DAO instance.
     * @returns MessageDao
     */
    public static getInstance = (): MessageDao => {
        if (MessageDao.messageDao === null) {
            MessageDao.messageDao = new MessageDao();
        }
        return MessageDao.messageDao;
    }

    private constructor() {}

    /**
     * Uses MessageModel to retrieve all message documents from messages
     * collection.
     * @returns Promise To be notified when the messagesare retrieved from
     * the database
     */
    findAllMessages = async (): Promise<Message[]> =>
        MessageModel.find();

    /**
     * Uses MessageModel to retrieve all message documents sent by user
     * provided.
     * @param {string} uid Primary key of user that sent the messages
     */
    findAllMessagesSentByUser = async (uid: string): Promise<Message[]> =>
        MessageModel
            .find({from: uid})
            .populate("message")
            .exec();

    /**
     * Uses MessageModel to retrieve all message documents received by user
     * provided.
     * @param {string} uid Primary key of user that received the messages
     */
    findAllMessagesSentToUser = async (uid: string): Promise<Message[]> =>
        MessageModel
            .find({to: uid})
            .populate("message")
            .exec();

    /**
     * Removes message from the database.
     * @param {string} mid Primary key of message to be removed
     * @returns Promise to be notified when message is removed from the database
     */
    userDeletesMessage = async (mid: string): Promise<any> =>
        MessageModel.deleteOne({_id: mid});

    /**
     * Inserts message instance into the database.
     * @param {string} uid Primary key of user sending the message
     * @param {string} ouid Primary key of user receiving the message
     * @param {string} message Message body to send from one user to the other
     */
    userMessagesUser = async (uid: string, ouid: string, message: Message): Promise<Message> =>
        MessageModel.create({...message, from: uid, to: ouid});
}




