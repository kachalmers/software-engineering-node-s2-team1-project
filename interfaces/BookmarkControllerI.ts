/**
 * @file implements the interface for the Bookmark controller.
 */
import {Request, Response} from "express";

export default interface BookmarkControllerI {
    findAllBookmarks (req: Request, res: Response): void;
    findBookmarksOfTuitByUsers (req: Request, res: Response): void;
    findBookmarksOfTuitsByUser (req: Request, res: Response): void;
    userBookmarksTuit (req: Request, res: Response): void;
    userUnbookmarksTuit (req: Request, res: Response): void;
    findUsersThatBookmarkedTuit (req: Request, res: Response): void;
    findTuitsBookmarkedByUser (req: Request, res: Response): void;
}