/**
 * @file Controller RESTful Web service API for bookmarks resource
 */
import {Express, Request, Response} from "express";
import BookmarkControllerI from "../interfaces/BookmarkControllerI";
import BookmarkDao from "../daos/BookmarkDao";
import Bookmark from "../models/bookmarks/Bookmark";

/**
 * @class BookmarkController Implements RESTful Web service API for bookmarks resource
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/user/:uid/bookmarks to retrieve all tuits bookmarked by a user </li>
 *     <li>GET /api/user/:tid/bookmarks to retrieve all users that bookmarked a tuit </li>
 *     <li>GET /api/bookmarks to retrieve all the bookmark documents for testing purpose </li>
 *     <li>POST /api/users/:uid/bookmarks/:tid to record that a user bookmarks a tuit </li>
 *     <li>DELETE /api/users/:uid/unbookmarks/:tid to record that a user no longer
 *     bookmarks a tuit </li>
 * </ul>
 * @property {BookmarkDao} bookmarkDao Singleton DAO implementing like CRUD operations
 * @property {BookmarkController} bookmarkController Singleton controller implementing
 * RESTful Web service API
 */
export default class BookmarkController implements BookmarkControllerI {
    private static bookmarkDao: BookmarkDao = BookmarkDao.getInstance();
    private static bookmarkController: BookmarkController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service API
     * @returns BookmarkController
     */
    public static getInstance = (app: Express): BookmarkController => {
        if (BookmarkController.bookmarkController === null) {
            BookmarkController.bookmarkController = new BookmarkController();
            app.get('/api/users/:uid/bookmarks', BookmarkController.bookmarkController.findAllTuitsBookmarkedByUser);
            app.get('/api/tuits/:tid/bookmarks', BookmarkController.bookmarkController.findAllUsersThatBookmarkedTuit);
            app.get('/api/bookmarks', BookmarkController.bookmarkController.findAllBookmark);
            app.post('/api/users/:uid/bookmarks/:tid', BookmarkController.bookmarkController.userBookmarksTuit);
            app.delete('/api/users/:uid/unbookmarks/:tid', BookmarkController.bookmarkController.userUnbookmarksTuit);
        }
        return BookmarkController.bookmarkController;
    }

    /**
     * Retrieves all tuits that bookmarked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user liked the tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were bookmarked
     */
    findAllTuitsBookmarkedByUser = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllTuitsBookmarkedByUser(req.params.uid)
            .then((bookmarks: Bookmark[]) => res.json(bookmarks));

    /**
     * Retrieves all users that bookmarked a tuit from the database
     * @param {Request} req Represents request from client, including path
     * parameter tid representing the bookmarked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatBookmarkedTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllUsersThatBookmarkedTuit(req.params.tid)
            .then((bookmarks: Bookmark[]) => res.json(bookmarks));

    /**
     * Creates a new bookmark instance to record that a user bookmarks a tuit
     * @param {Request} req Represents request from client, including path
     * parameter uid and tid representing the user that is bookmarking the tuit
     * and the tuit being bookmarked
     * @param {Response} res Represents response from client, including the
     * body formatted as JSON containing the new bookmark that was inserted in
     * the database
     */
    userBookmarksTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.userBookmarksTuit(req.params.uid, req.params.tid)
            .then((bookmark: Bookmark) => res.json(bookmark));

    /**
     * Removes a bookmark instance to record that user no longer bookmarks the tuit
     * @param {Request} req Represents request from client, including the path
     * parameter uid and tid representing the user is unbookmarking the tuit and
     * the tuit being unbookmarked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the bookmark was successful or not
     */
    userUnbookmarksTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.userUnbookmarksTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));

    /**
     * Retrieves all bookmarks from the database and returns an array of bookmarks (including
     * all tuits being bookmarked and users bookmarking the tuit)
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the bookmark objects (including all
     * tuits being bookmarked and users bookmarking the tuit)
     */
    findAllBookmark = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllBookmark()
            .then((bookmarks: Bookmark[]) => res.json(bookmarks));
}