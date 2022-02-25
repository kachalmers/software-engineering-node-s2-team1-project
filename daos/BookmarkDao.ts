/**
 * @file Implements DAO managing data storage of bookmarks. Uses mongoose BookmarkModel
 * to integrate with MongoDB
 */
import BookmarkDaoI from "../interfaces/BookmarkDaoI";
import BookmarkModel from "../mongoose/bookmarks/BookmarkModel";
import Bookmark from "../models/bookmarks/Bookmark";

/**
 * @class BookmarkDao Implements Data Access Object managing data storage
 * of Bookmarks.
 * @property {BookmarkDao} bookmarkDao Private single instance of BookmarkDao
 */
export default class BookmarkDao implements BookmarkDaoI {
    private static bookmarkDao: BookmarkDao | null = null;

    /**
     * Creates singleton DAO instance.
     * @returns {BookmarkDao} BookmarkDao
     */
    public static getInstance = (): BookmarkDao => {
        if(BookmarkDao.bookmarkDao === null) {
            BookmarkDao.bookmarkDao = new BookmarkDao();
        }
        return BookmarkDao.bookmarkDao;
    }

    private constructor() {}

    /**
     * Uses BookmarkModel to retrieve all bookmark documents from bookmarks
     * collection.
     * @returns {Promise} Promise to be notified when the bookmarks are
     * retrieved from database
     */
    findAllBookmarks = async (): Promise<Bookmark[]> =>
        BookmarkModel.find();

    /**
     * Uses BookmarkModel to retrieve all bookmark documents representing
     * bookmarks of tuits by a user.
     * @param {string} uid Primary key of user that bookmarked tuit
     * @returns {Promise} Promise to be notified when bookmarks are retrieved
     * from the database
     */
    findBookmarksOfTuitsByUser = async (uid: string): Promise<Bookmark[]> =>
        BookmarkModel
            .find({bookmarkedBy:uid})
            .populate("tuit")
            .exec();

    /**
     * Uses BookmarkModel to retrieve all bookmark documents representing
     * bookmarks of a tuit by users.
     * @param {string} tid Primary key of tuit bookmarked by users
     * @returns {Promise} Promise to be notified when bookmarks are retrieved
     * from the database
     */
    findBookmarksOfTuitByUsers = async (tid: string): Promise<Bookmark[]> =>
        BookmarkModel
            .find({tuit: tid})
            .populate("bookmarkedBy")
            .exec();

    /**
     * Inserts bookmark instance into the database.
     * @param {string} uid Primary key of user to bookmark tuit
     * @param {string} tid Primary key of tuit to be bookmarked
     * @returns {Promise} Promise to be notified when bookmark is inserted
     * into the database
     */
    userBookmarksTuit = async (uid: string, tid: string): Promise<any> =>
        BookmarkModel.create({tuit: tid, bookmarkedBy: uid});

    /**
     * Removes bookmark from the database.
     * @param {string} uid Primary key of user unbookmarking tuit
     * @param {string} tid Primary key of tuit to be unbookmarked
     * @returns {Promise} Promise to be notified when bookmark is removed from the database
     */
    userUnbookmarksTuit = async (uid: string, tid: string): Promise<any> =>
        BookmarkModel.deleteOne({tuit: tid, bookmarkedBy: uid});

}