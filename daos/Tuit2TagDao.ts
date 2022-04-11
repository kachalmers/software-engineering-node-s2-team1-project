/**
 * @file DAO that implements asynchronous functions associated with
 * the Tuit2TagModel.
 */

import Tuit2TagDaoI from "../interfaces/Tuit2TagDaoI";
import Tuit2TagModel from "../mongoose/tag/Tuit2TagModel";
import Tuit2Tag from "../models/tags/Tuit2Tag";
import TagDao from "./TagDao";

export default class Tuit2TagDao implements Tuit2TagDaoI {
    private static tuit2tagDao: Tuit2TagDao | null = null;
    private static tagDao: TagDao = TagDao.getInstance();

    public static getInstance = (): Tuit2TagDao => {
        if (Tuit2TagDao.tuit2tagDao === null) {
            Tuit2TagDao.tuit2tagDao = new Tuit2TagDao();
        }
        return Tuit2TagDao.tuit2tagDao;
    }

    private constructor() {
    }

    /**
     * Inserts a tuit2tag document into the database.
     * @param {string} tuit the id of the tuit in the Tuit2Tag to be
     * inserted in the database
     * @param {string} tag the id of the tuit in the Tuit2Tag to be
     * inserted in the database
     * @returns Promise To be notified when tuit2tag is inserted
     */

        // TODO: should the data type below be string or a tuit/tag object?
    createTuit2Tag = async (tuitID: string, tagID: string): Promise<Tuit2Tag> =>
        Tuit2TagModel.create({tuit: tuitID, tag: tagID});

    /**
     * Removes tuit2tag document with a given t2t ID from the database
     * @param {string} t2tID Primary key of tuit2tag
     * @returns Promise To be notified when tuit2tag is removed from
     * the database
     */
    deleteTuit2Tag = async (tuitID: string, tagID: string): Promise<any> =>
        Tuit2TagModel.deleteOne({tuit: tuitID, tag: tagID});


    findTagsByTuit = async (tid: string): Promise<Tuit2Tag[]> =>
        Tuit2TagModel.find({tuit: tid})
            .populate("tag")
            .exec();


}
/*
ADD THESE:
createTuit2Tag(tid, tagID
findTagsByTu)it(tid)
deleteTuit2Tag(tid, tagID)
*/