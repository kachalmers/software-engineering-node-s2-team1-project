/**
 * @file implements the interface for the Like controller.
 */
import {Request, Response} from "express";

export default interface LikeControllerI {
    findLikesOfTuitsByUser (req: Request, res: Response): void;
    findLikesOfTuitByUsers (req: Request, res: Response): void;
    findUsersThatLikedTuit (req: Request, res: Response): void;
    findTuitsLikedByUser (req: Request, res: Response): void;
    userLikesTuit (req: Request, res: Response): void;
    userUnlikesTuit (req: Request, res: Response): void;
};