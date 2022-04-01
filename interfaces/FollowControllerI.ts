/**
 * @file Declares Controller RESTful Web service API for follows resource
 */
import {Request, Response} from "express";

export default interface FollowControllerI {
    userFollowsAnotherUser(req: Request, res: Response): void;
    userUnfollowsAnotherUser(req: Request, res: Response): void;
    findAllFollowing(req: Request, res: Response): void;
    findAllFollowers(req: Request, res: Response): void;
    findAllFollow(req: Request, res: Response): void;
}