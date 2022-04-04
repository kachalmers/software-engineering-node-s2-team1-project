/**
 * @file Implements DAO managing data storage of Explore. Uses mongoose TuitModel
 * to integrate with MongoDB.
 */
import Tuit from "../models/tuits/Tuit";
import TuitModel from "../mongoose/tuits/TuitModel";
import ExploreDaoI from "../interfaces/ExploreDaoI";
import Tuit2Tag from "../models/tuits/Tuit2Tag";


/**
 * @class ExploreDao Implements Data Access Object managing data storage
 * of Explore
 * @property {ExploreDao} exploreDao Private single instance of ExploreDao
 */
export default class ExploreDao implements ExploreDaoI {
    private static exploreDao: ExploreDao | null = null;

    /**
     * Creates singleton DAO instance for explore.
     * @returns ExploreDao
     */
    public static getInstance = (): ExploreDao => {
        if (ExploreDao.exploreDao === null) {
            ExploreDao.exploreDao = new ExploreDao();
        }
        return ExploreDao.exploreDao;
    }

    private constructor() {}

    /**
     * Retrieves all tuit documents posted with a given tag.
     * @param {string} tag labeled tag of a tuit
     * @returns Promise To be notified when the tuits are retrieved from
     * database
     */
    findTuitsByTag = async (searchedTag: string): Promise<Tuit[]> =>
        TuitModel.find({tag: searchedTag})
            .sort({postedOn: -1})
            .populate("tag")
            .exec();

    /**
     * Retrieves all tuit documents from the database.
     * @returns Promise To be notified when the tuits are retrieved from
     * database
     */
    findAllTags = async (): Promise<Tuit2Tag[]> =>
        TuitModel.find()
            .sort({postedOn: -1})
            .populate('postedBy')
            .exec();
}