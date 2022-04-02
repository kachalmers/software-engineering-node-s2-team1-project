/**
 * @file Declares Controller RESTful Web service API for users resource
 */
import {Request, Response} from "express";

export default interface UserControllerI {
    findAllUsers(req: Request, res: Response): void;
    findUserById(req: Request, res: Response): void;
    createUser(req: Request, res: Response): void;
    deleteUser(req: Request, res: Response): void;
    updateUser(req: Request, res: Response): void;
    login(req: Request, res: Response): void;
    register(req: Request, res: Response): void;
    deleteUserByUsername(req: Request, res: Response): void;
}