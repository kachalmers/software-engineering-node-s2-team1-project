import MessageDaoI from "../interfaces/MessageDaoI";
import MessageModel from "../mongoose/messages/MessageModel";
import Message from "../models/messages/Message";

export default class MessageDao implements MessageDaoI {
    private static messageDao: MessageDao | null = null;
    public static getInstance = (): MessageDao => {
        if (MessageDao.messageDao === null) {
            MessageDao.messageDao = new MessageDao();
        }
        return MessageDao.messageDao;
    }

    private constructor() {
    }

    findAllMessages = async (): Promise<Message[]> =>
        MessageModel.find();

    findAllMessagesSentByUser = async (uid: string): Promise<Message[]> =>
        MessageModel
            .find({from: uid})
            .populate("message")
            .exec();

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

    userMessagesUser = async (uid: string, ouid: string, message: Message): Promise<Message> =>
        MessageModel.create({...message, from: uid, to: ouid});
}




