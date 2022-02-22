/**
 * @file Declares API for Messages related data access object methods.
 */
import Message from "../models/messages/Message";

export default interface MessageDaoI {
    findAllMessages (): Promise<Message[]>;
    userMessagesUser (uid: string, ouid: string, message: Message): Promise<Message>;
    findAllMessagesSentByUser (uid: string): Promise<Message[]>;
    findAllMessagesSentToUser (uid: string): Promise<Message[]>;
    findMessageById (mid: string): Promise<Message[]>
    updateMessage (mid: string, message: Message): Promise<Message>;
    userDeletesMessage (mid: string): Promise<any>;
};