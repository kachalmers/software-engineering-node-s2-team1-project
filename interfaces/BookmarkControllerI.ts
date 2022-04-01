/**
 * @file Declares Controller RESTful Web service API for bookmarks resource
 */
import {Request, Response} from "express";

export default interface BookmarkControllerI {
    userBookmarksTuit(req: Request, res: Response): void;
    userUnbookmarksTuit(req: Request, res: Response): void;
    findAllTuitsBookmarkedByUser(req: Request, res: Response): void;
    findAllUsersThatBookmarkedTuit(req: Request, res: Response): void;
    findAllBookmark(req: Request, res: Response): void;
}