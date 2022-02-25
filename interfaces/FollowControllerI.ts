/**
 * @file implements the interface for the Follow controller.
 */
import {Request, Response} from "express";

export default interface FollowControllerI {
    findAllFollows (req: Request, res: Response): void;
    findFollowsByFollowee (req: Request, res: Response): void;
    findFollowsByFollower (req: Request, res: Response): void;
    userFollowsUser (req: Request, res: Response): void;
    userUnfollowsUser (req: Request, res: Response): void;
    findUsersFollowingUser (req: Request, res: Response): void;
    findUsersFollowedByUser (req: Request, res: Response): void;
    findFollowByUsers (req: Request, res: Response): void;
}