/**
 * @file Implements DAO managing data storage of tuits. Uses mongoose TuitModel
 * to integrate with MongoDB
 */
import Tuit from "../models/tuits/Tuit";
import TuitDaoI from "../interfaces/TuitDaoI";
import TuitModel from "../mongoose/tuits/TuitModel";

/**
 * @class TuitDao Implements Data Access Object managing data storage
 * of Tuits
 * @property {TuitDao} tuitDao Private single instance of TuitDao
 */
export default class TuitDao implements TuitDaoI {
    private static tuitDao: TuitDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns TuitDao
     */
    public static getInstance(): TuitDao {
        if (TuitDao.tuitDao === null) {
            TuitDao.tuitDao = new TuitDao();
        }
        return TuitDao.tuitDao;
    }

    private constructor() {}

    /**
     * Uses TuitModel to retrieve all tuits documents from tuits collection
     * @returns Promise To be notified when the tuits are retrieved from
     * database
     */
    findAllTuits = async (): Promise<Tuit[]> =>
        TuitModel.find()
            .sort({postedOn: -1})
            .populate('postedBy')
            .exec();

    /**
     * Uses TuitModel to retrieve all tuits documents posted by a particular
     * user from tuits collection
     * @param {string} uid User's primary key
     * @returns Promise To be notified when the tuits are retrieved from
     * database
     */
    findTuitsByUser = async (uid: string): Promise<Tuit[]> =>
        TuitModel.find({postedBy: uid})
            .sort({postedOn: -1})
            .populate("postedBy")
            .exec();

    /**
     * Uses TuitModel to retrieve single tuit document from tuits collection
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when the tuit is retrieved from database
     */
    findTuitById = async (tid: string): Promise<any> =>
        TuitModel.findById(tid).populate("postedBy").exec();

    /**
     * Inserts tuit instance into the database
     * @param {Tuit} tuit Instance to be inserted into the database
     * @returns Promise To be notified when tuit is inserted into the database
     */
    createTuit = async (tuit: Tuit): Promise<Tuit> =>
        TuitModel.create(tuit);

    /**
     * Inserts tuit instance for a particular user into the database
     * @param {string} uid User's primary key
     * @param {Tuit} tuit Instance to be inserted into the database
     * @returns Promise To be notified when tuit is inserted into the database
     */
    createTuitByUser = async (uid: string, tuit: Tuit): Promise<Tuit> =>
        TuitModel.create({...tuit, postedBy: uid})

    /**
     * Updates tuit with new values in database
     * @param {string} tid Tuit's primary key
     * @param {Tuit} tuit Tuit object containing properties and their new values
     * @returns Promise To be notified when tuit is updated in the database
     */
    updateTuit = async (tid: string, tuit: Tuit): Promise<any> =>
        TuitModel.updateOne({_id: tid}, {$set: tuit})

    /**
     * Updates tuit with new stats in database
     * @param {string} tid Tuit's primary key
     * @param {any} newStats Stats object containing properties and their new values
     * @returns Promise To be notified when tuit is updated in the database
     */
    updateLikes = async (tid: string, newStats: any): Promise<any> =>
        TuitModel.updateOne(
            {_id: tid},
            {$set: {stats: newStats}}
        );

    /**
     * Removes tuit from the database
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when tuit is removed from the database
     */
    deleteTuit = async (tid: string): Promise<any> =>
        TuitModel.deleteOne({_id: tid});

    /**
     * Removes tuit that matches the content
     * @param {string} content Tuit's content
     * @returns Promise To be notified when tuit is removed from the database
     */
    deleteTuitByContent = async (content: string): Promise<any> =>
        TuitModel.deleteMany({tuit: content})
}