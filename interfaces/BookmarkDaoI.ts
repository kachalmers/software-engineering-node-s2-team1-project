/**
 * @file Declares API for Bookmarks related data access object methods
 */
import Bookmark from "../models/bookmarks/Bookmark";

export default interface BookmarkDaoI {
    userBookmarksTuit(uid: string, tid: string): Promise<Bookmark>;
    userUnbookmarksTuit(uid: string, tid: string): Promise<any>;
    findAllTuitsBookmarkedByUser(uid: string): Promise<Bookmark[]>;
    findAllUsersThatBookmarkedTuit(tid: string): Promise<Bookmark[]>;
    findAllBookmark(): Promise<Bookmark[]>;
}