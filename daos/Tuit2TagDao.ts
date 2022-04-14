/**
 * @file DAO that implements asynchronous functions associated with
 * the Tuit2TagModel.
 */

import Tuit2TagDaoI from "../interfaces/Tuit2TagDaoI";
import Tuit2TagModel from "../mongoose/tags/Tuit2TagModel";
import Tuit2Tag from "../models/tags/Tuit2Tag";
import TagDao from "./TagDao";
import Tuit from "../models/tuits/Tuit";
import Tag from "../models/tags/Tag";
import TuitModel from "../mongoose/tuits/TuitModel";

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
     * Retrieves all Tuit2Tag documents from the database.
     */
    findAllTuit2Tags = async (): Promise<Tuit2Tag[]> =>
        Tuit2TagModel.find().exec();

    /**
     * Inserts a tuit2tag document into the database.
     * @param {string} tuitID the id of the tuit in the Tuit2Tag to be
     * inserted in the database
     * @param {string} tagID the id of the tag in the Tuit2Tag to be
     * inserted in the database
     * @returns Promise To be notified when tuit2tag is inserted
     */
    createTuit2Tag = async (tuitID: string, tagID: string): Promise<Tuit2Tag> =>
        Tuit2TagModel.create({tuit: tuitID, tag: tagID});

    /**
     * Removes tuit2tag document from a given tuit ID from the database
     * @param {string} tuitID Primary key of the tuit component of the t2t
     * @returns Promise To be notified when tuit2tag is removed from
     * the database
     */
    deleteTuit2Tag = async (tuitID: string, tagID: string): Promise<any> =>
        Tuit2TagModel.deleteMany({tuit: tuitID, tag: tagID});

    deleteTuit2TagById = async (t2tID: string): Promise<any> =>
        Tuit2TagModel.deleteOne({_id: t2tID});

    /**
     * Returns an array of t2ts from the database where the given tuit
     * is its tuit component
     * @param {string} tid the primary key of the tuit
     */
    findTuit2TagsByTuit = async (tuitID: string): Promise<Tuit2Tag[]> =>
        Tuit2TagModel.find({tuit: tuitID})
            .populate("tag")
            .exec();

    /**
     * Returns an array of t2ts from the database where the given tag
     * is its tag component
     * @param {string} tagID the primary key of the tag
     */
    findTuit2TagsByTag = async (tagID: string): Promise<Tuit2Tag[]> =>
        Tuit2TagModel.find({tag: tagID})
            .populate("tuit")
            .exec();

    /**
     * Retrieves all tag documents that have been added as a tag for a tuit
     * with the given tuitID.
     * @param {string} tuitID Primary key of tuit
     */
    findTagsByTuit = async (tuitID: string): Promise<Tag[]> => {
        let tuit2tags = await Tuit2TagModel
            .find({tuit: tuitID})
            .populate("tag")
            .exec();

        return tuit2tags.map(tuit2tag => tuit2tag.tag);
    }

    /**
     * Retrieves all tuit documents that have been tagged with a tag with
     * the given tag text.
     * @param {string} tagText Text of tag
     */
    findTuitsByTagText = async (tagText: string): Promise<Tuit[]> => {
        const tag = await Tuit2TagDao.tagDao.findTagByText(tagText);
        let tuit2tags : Tuit2Tag[] = [];

        if (tag !== null) {
            tuit2tags = await Tuit2TagModel
                .find({tag: tag._id})
                .populate("tuit")
                .exec();
        }

        return tuit2tags.map(tuit2tag => tuit2tag.tuit);
    }

}