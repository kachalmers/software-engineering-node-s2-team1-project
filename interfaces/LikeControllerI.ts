/**
 * @file Declares Controller RESTful Web service API for likes resource
 */
import {Request, Response} from "express";

export default interface LikeControllerI {
    findAllUsersThatLikedTuit(req: Request, res: Response): void;
    findAllTuitsLikedByUser(req: Request, res: Response): void;
    userLikesTuit(req: Request, res: Response): void;
    userUnLikesTuit(req: Request, res: Response): void;
    findAllLike(req: Request, res: Response): void;
    userTogglesTuitLikes(req: Request, res: Response): void;
}