/**
 * @file Declares Controller RESTful Web service API for messages resource
 */
import {Request, Response} from "express";

export default interface MessageControllerI {
    userSendsMessage(req: Request, res: Response): void;
    userDeletesMessage(req: Request, res: Response): void;
    findAllMessageSent(req: Request, res: Response): void;
    findAllMessageReceived(req: Request, res: Response): void;
    findAllMessage(req: Request, res: Response): void;
}