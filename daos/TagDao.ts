/**
 * @file DAO that implements asynchronous functions associated with Tags
 *       using the TagModel.
 */

import TagDaoI from "../interfaces/TagDaoI";
import TagModel from "../mongoose/tag/TagModel";
import Tag from "../models/tags/Tag";
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

    /**
     * Retrieves all tag documents from the database.
     * @returns Promise To be notified when the tags are retrieved from
     * database
     */
    findAllTags = async (): Promise<Tag[]> =>
        TagModel.find()
            //.sort({postedOn: -1})     Don't think this is needed
            //.populate('postedBy')     Don't know this is needed either --> would get from Tuit associated anyways
            .exec();

    /**
     * Updates tag with new values in the database.
     * @param {string} tid Primary key of tag
     * @param {Tuit} tag Tag body with new values for tag
     */
    updateTag = async (tag: Tag): Promise<any> =>
        TagModel.updateOne({tag: tag.tag}, {$set: tag})

    /**
     * Inserts tag document into the database.
     * @param {Tag} tag Tag to insert into database
     * @returns Promise To be notified when tag is inserted into the database
     */
    createTag = async (tag: Tag): Promise<Tag> =>   // Not sure if this needs to change also
        TagModel.create(tag);
}