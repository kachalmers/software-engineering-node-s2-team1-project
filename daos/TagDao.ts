/**
 * @file DAO that implements asynchronous functions associated with Tags
 *       using the TagModel.
 */

import TagDaoI from "../interfaces/TagDaoI";
import TagModel from "../mongoose/tags/TagModel";
import Tag from "../models/Tags/Tag";
import Tuit from "../models/tuits/Tuit";
import TuitModel from "../mongoose/tuits/TuitModel";
export default class TagDao implements TagDaoI {
    private static tagDao: TagDao | null = null;
    public static getInstance = (): TagDao => {
        if(TagDao.tagDao === null) {
            TagDao.tagDao = new TagDao();
        }
        return TagDao.tagDao;
    }
    private constructor() {}
    findAllUsersThatTaggedTuit = async (tid: string): Promise<Tag[]> =>
        TagModel
            .find({tuit: tid})
            .populate("taggedBy")
            .exec();
    findAllTuitsTaggedByUser = async (uid: string): Promise<Tag[]> =>
        TagModel
            .find({taggedBy: uid})
            .populate({
                path: "tuit",
                populate: {
                    path: "postedBy"
                }
            })
            .exec();
    userTagsTuit = async (uid: string, tid: string): Promise<any> =>
        TagModel.create({tuit: tid, taggedBy: uid});
    findUserTagsTuit = async (uid: string, tid: string): Promise<any> =>
        TagModel.findOne({tuit: tid, taggedBy: uid});
    userUntagsTuit = async (uid: string, tid: string): Promise<any> =>
        TagModel.deleteOne({tuit: tid, taggedBy: uid});
    countHowManyTaggedTuit = async (tid: string): Promise<any> =>
        TagModel.count({tuit: tid});
    /**
     * Inserts tag document into the database.
     * @param {Tag} tag Tag to insert into database
     * @returns Promise To be notified when tag is inserted into the database
     */
    createTag = async (tag: Tag): Promise<Tag> =>
        TagModel.create(tag);
}