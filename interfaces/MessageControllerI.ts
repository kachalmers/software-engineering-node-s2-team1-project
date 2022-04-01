/**
 * @file implements the interface for the Message controller.
 */
import {Request, Response} from "express";

export default interface MessageControllerI {
    findAllMessages (req: Request, res: Response): void;
    userMessagesUser (req: Request, res: Response): void;
    findAllMessagesSentByUser (req: Request, res: Response): void;
    findAllMessagesSentToUser (req: Request, res: Response): void;
    findMessageById (req: Request, res: Response): void;
    updateMessage (req: Request, res: Response): void;
    userDeletesMessage (req: Request, res: Response): void;
};