/**
 * @file implements the interface for the Follow controller.
 */
import {Request, Response} from "express";

export default interface FollowControllerI {
    userFollowsUser (req: Request, res: Response): void;
    userUnfollowsUser (req: Request, res: Response): void;
    findAllUsersFollowingUser (req: Request, res: Response): void;
    findAllUsersFollowedByUser (req: Request, res: Response): void;
}