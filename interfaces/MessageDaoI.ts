/**
 * @file Declares API for Messages related data access object methods
 */
import Message from "../models/messages/Message";

export default interface MessageDaoI {
    userSendsMessage(message: Message, from: string, to: string): Promise<Message>;
    userDeletesMessage(mid: string): Promise<any>;
    findAllMessageSent(uid: string): Promise<Message[]>;
    findAllMessageReceived(uid: string): Promise<Message[]>;
    findAllMessage(): Promise<Message[]>;
}