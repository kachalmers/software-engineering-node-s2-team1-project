/**
 * @file implements the interface for the Bookmark controller.
 */
import {Request, Response} from "express";

export default interface BookmarkControllerI {
    findAllBookmarks (req: Request, res: Response): void;
    userBookmarksTuit (req: Request, res: Response): void;
    userUnbookmarksTuit (req: Request, res: Response): void;
    findAllUsersThatBookmarkedTuit (req: Request, res: Response): void;
    findAllTuitsBookmarkedByUser (req: Request, res: Response): void;
}