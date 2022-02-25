/**
 * @file Controller RESTful Web service API for bookmarks resource.
 */
import {Express, Request, Response} from "express";
import BookmarkDao from "../daos/BookmarkDao";
import BookmarkControllerI from "../interfaces/BookmarkControllerI";
import Bookmark from "../models/bookmarks/Bookmark"

/**
 * @class BookmarkController Implements RESTful Web service API for bookmarks resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:uid/bookmarks/:tid to record that a user bookmarks
 *     a tuit</li>
 *     <li>DELETE /api/users/:uid/bookmarks/:tid to record that a user
 *     no longer bookmarks a tuit</li>
 *     <li>GET /api/users/:uid/bookmarks to retrieve all the tuits bookmarked
 *     by a user </li>
 *     <li>GET /api/tuits/:tid/bookmarks to retrieve all users that bookmarked
 *     a tuit</li>
 *     <li>GET /api/bookmarks to retrieve all bookmarks</li>
 *     <li>GET /api/bookmarks/tuits/:tid to retrieve all bookmarks of tuit</li>
 *     <li>GET /api/bookmarks/users/:uid to retrieve all bookmarks by user</li>
 * </ul>
 * @property {BookmarkDao} bookmarkDao Singleton DAO implementing bookmarks CRUD operations
 * @property {BookmarkController} BookmarkController Singleton controller implementing
 * RESTful Web service API
 */
export default class BookmarkController implements BookmarkControllerI {
    private static bookmarkDao: BookmarkDao = BookmarkDao.getInstance();
    private static bookmarkController: BookmarkController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     */
    public static getInstance = (app: Express): BookmarkController => {
        if(BookmarkController.bookmarkController === null) {
            BookmarkController.bookmarkController = new BookmarkController();
            app.post("/api/users/:uid/bookmarks/:tid", BookmarkController.bookmarkController.userBookmarksTuit);
            app.delete("/api/users/:uid/bookmarks/:tid", BookmarkController.bookmarkController.userUnbookmarksTuit);
            app.get("/api/users/:uid/bookmarks", BookmarkController.bookmarkController.findTuitsBookmarkedByUser);
            app.get("/api/tuits/:tid/bookmarks", BookmarkController.bookmarkController.findUsersThatBookmarkedTuit);
            app.get("/api/bookmarks", BookmarkController.bookmarkController.findAllBookmarks);
            app.get("/api/bookmarks/tuits/:tid", BookmarkController.bookmarkController.findBookmarksOfTuitByUsers);
            app.get("/api/bookmarks/users/:uid", BookmarkController.bookmarkController.findBookmarksOfTuitsByUser);
        }
        return BookmarkController.bookmarkController;
    }

    private constructor() {}

    /**
     * Retrieves all bookmarks from the database and returns an array of bookmarks.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the bookmark objects
     */
    findAllBookmarks = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllBookmarks()
            .then((bookmarks: Bookmark[]) => res.json(bookmarks));

    /**
     * Retrieves all bookmarks of a tuit by users from the database.
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the bookmarked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the bookmark objects
     * with the users that bookmarked the tuit
     */
    findBookmarksOfTuitByUsers = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findBookmarksOfTuitByUsers(req.params.tid)
            .then(bookmarks => res.json(bookmarks));

    /**
     * Retrieves all bookmarks of tuits by a user from the database.
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user that bookmarked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were
     * bookmarked
     */
    findBookmarksOfTuitsByUser = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findBookmarksOfTuitsByUser(req.params.uid)
            .then(bookmarks => res.json(bookmarks));

    /**
     * Retrieves all users that bookmarked a tuit from the database.
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the bookmarked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects that
     * bookmarked the tuit
     */
    findUsersThatBookmarkedTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findBookmarksOfTuitByUsers(req.params.tid)
            .then(bookmarks => res.json(bookmarks.map(bookmark => bookmark.bookmarkedBy)));

    /**
     * Retrieves all tuits bookmarked by a user from the database.
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user that bookmarked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were
     * bookmarked
     */
    findTuitsBookmarkedByUser = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findBookmarksOfTuitsByUser(req.params.uid)
            .then(bookmarks => res.json(bookmarks.map(bookmark => bookmark.tuit)));

    /**
     * Creates a new bookmark instance between a user and a tuit.
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is bookmarking
     * the tuit and the tuit being bookmarked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new bookmark that was inserted in
     * the database
     */
    userBookmarksTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.userBookmarksTuit(req.params.uid, req.params.tid)
            .then(bookmarks => res.json(bookmarks));

    /**
     * Removes a bookmark instance from the database.
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is unbookmarking
     * the tuit and the tuit being unbookmarked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the bookmark was successful or not
     */
    userUnbookmarksTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.userUnbookmarksTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));
};