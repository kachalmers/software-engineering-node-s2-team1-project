/**
 * @file Implements DAO managing data storage of tuits. Uses mongoose TuitModel
 * to integrate with MongoDB.
 */
import TuitModel from "../mongoose/tuits/TuitModel";
import Tuit from "../models/tuits/Tuit";
import TuitDaoI from "../interfaces/TuitDaoI";

/**
 * @class TuitDao Implements Data Access Object managing data storage
 * of Tuits
 * @property {TuitDao} tuitDao Private single instance of TuitDao
 */
export default class TuitDao implements TuitDaoI{
    private static tuitDao: TuitDao | null = null;

    /**
     * Creates singleton DAO instance.
     * @returns TuitDao
     */
    public static getInstance = (): TuitDao => {
        if(TuitDao.tuitDao === null) {
            TuitDao.tuitDao = new TuitDao();
        }
        return TuitDao.tuitDao;
    }

    private constructor() {}

    /**
     * Uses TuitModel to retrieve all tuit documents from tuits collection.
     * @returns Promise to be notified when the tuits are retrieved from
     * database
     */
    findAllTuits = async (): Promise<Tuit[]> =>
        TuitModel.find();

    /**
     * Uses TuitModel to retrieve all tuit documents posted by user
     * provided.
     * @param {string} uid Primary key of user
     * @returns Promise to be notified when user is retrieved from the database
     */
    findAllTuitsByUser = async (uid: string): Promise<Tuit[]> =>
        TuitModel.find({postedBy: uid});

    /**
     * Uses TuitModel to retrieve single tuit document from tuits collection.
     * @param {string} uid Primary key of user
     * @returns Promise to be notified when tuit is retrieved from the database
     */
    findTuitById = async (uid: string): Promise<any> =>
        TuitModel.findById(uid)
            .populate("postedBy")
            .exec();

    /**
     * Inserts tuit instance into the database posted by user provided.
     * @param {string} uid Primary key of user posting new tuit
     * @param {Tuit} tuit instance to be inserted into the database
     * @returns Promise to be notified when tuit is inserted into the database
     */
    createTuitByUser = async (uid: string, tuit: Tuit): Promise<Tuit> =>
        TuitModel.create({...tuit, postedBy: uid});

    /**
     * Updates tuit with new values in database.
     * @param {string} uid User object by which tuit is posted
     * @param {Tuit} tuit Tuit object containing properties and their new values
     * @returns Promise to be notified when tuit is updated in the database
     */
    updateTuit = async (uid: string, tuit: Tuit): Promise<any> =>
        TuitModel.updateOne(
            {_id: uid},
            {$set: tuit});

    /**
     * Removes tuit from the database.
     * @param {string} tid Primary key of tuit to be removed
     * @returns Promise to be notified when tuit is removed from the database
     */
    deleteTuit = async (tid: string): Promise<any> =>
        TuitModel.deleteOne({_id: tid});
}