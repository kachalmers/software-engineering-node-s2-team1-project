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
     * @returns {MessageDao} MessageDao
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
     * @returns {Promise} Promise to be notified when the messages are retrieved from
     * the database
     */
    findAllMessages = async (): Promise<Message[]> =>
        MessageModel.find();

    /**
     * Uses MessageModel to retrieve all message documents sent by user
     * provided.
     * @param {string} uid Primary key of user that sent the messages
     * @returns {Promise} Promise to be notified when messages are retrieved from the database
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
     * @returns {Promise} Promise to be notified when messages are retrieved from the database
     */
    findAllMessagesSentToUser = async (uid: string): Promise<Message[]> =>
        MessageModel
            .find({to: uid})
            .populate("message")
            .exec();

    /**
     * Uses MessageModel to retrieve message by its primary key.
     * @param {string} mid Primary key of user that received the messages
     * @returns {Promise} Promise to be notified when message is retrieved from the database
     */
    findMessageById = async (mid: string): Promise<Message[]> =>
        MessageModel
            .find({_id: mid});

    /**
     * Updates message with new values in database.
     * @param {string} mid
     * @param {Message} message Message object containing properties and their new values
     * @returns {Promise} Promise to be notified when message is updated
     */
    updateMessage = async (mid: string, message: Message): Promise<any> =>
        MessageModel.updateOne(
            {_id: mid},
            {$set: message});

    /**
     * Removes message from the database.
     * @param {string} mid Primary key of message to be removed
     * @returns {Promise} Promise to be notified when message is removed from the database
     */
    userDeletesMessage = async (mid: string): Promise<any> =>
        MessageModel.deleteOne({_id: mid});

    /**
     * Inserts message instance into the database.
     * @param {string} uid Primary key of user sending the message
     * @param {string} ouid Primary key of user receiving the message
     * @param {string} message Message body to send from one user to the other
     * @returns {Promise} Promise to be notified when message is created in the database
     */
    userMessagesUser = async (uid: string, ouid: string, message: Message): Promise<Message> =>
        MessageModel.create({...message, from: uid, to: ouid});
}




