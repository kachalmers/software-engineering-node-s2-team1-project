/**
 * @file Implements DAO managing data storage of tuits. Uses mongoose TuitModel
 * to integrate with MongoDB.
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
     * Creates singleton DAO instance for tuit.
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
     * Retrieves all tuit documents from the database.
     * @returns Promise To be notified when the tuits are retrieved from
     * database
     */
    findAllTuits = async (): Promise<Tuit[]> =>
        TuitModel.find()
            .sort({postedOn: -1})
            .populate('postedBy')
            .exec();

    /**
     * Retrieves all tuit documents posted by a given user.
     * @param {string} uid Primary key of user
     * @returns Promise To be notified when the tuits are retrieved from
     * database
     */
    findTuitsByUser = async (uid: string): Promise<Tuit[]> =>
        TuitModel.find({postedBy: uid})
            .sort({postedOn: -1})
            .populate("postedBy")
            .exec();

    /**
     * Retrieves tuit with given primary key.
     * @param {string} tid Primary key of tuit
     * @returns Promise To be notified when the tuit is retrieved from database
     */
    findTuitById = async (tid: string): Promise<any> =>
        TuitModel.findById(tid).populate("postedBy").exec();

    /**
     * Inserts tuit document into the database.
     * @param {Tuit} tuit Tuit to insert into database
     * @returns Promise To be notified when tuit is inserted into the database
     */
    createTuit = async (tuit: Tuit): Promise<Tuit> =>
        TuitModel.create(tuit);

    /**
     * Inserts tuit document into the database to be posted by a given user.
     * @param {string} uid Primary key of user
     * @param {Tuit} tuit Tuit to be inserted into the database
     * @returns Promise To be notified when tuit is inserted into the database
     */
    createTuitByUser = async (uid: string, tuit: Tuit): Promise<Tuit> =>
        TuitModel.create({...tuit, postedBy: uid})

    /**
     * Updates tuit with new values in the database.
     * @param {string} tid Primary key of tuit
     * @param {Tuit} tuit Tuit body with new values for tuit
     */
    updateTuit = async (tid: string, tuit: Tuit): Promise<any> =>
        TuitModel.updateOne({_id: tid}, {$set: tuit})

    /**
     * Updates the stats of a given tuit in the database.
     * @param {string} tid Primary key of a given tuit
     * @param {any} newStats Stats body with new tuit stats values
     */
    updateTuitStats = async (tid: string, newStats: any): Promise<any> =>
        TuitModel.updateOne(
            {_id: tid},
            {$set: {stats: newStats}}
        );

    /**
     * Removes tuit document with a given primary key from the database.
     * @param {string} tid Primary key of tuit
     * @returns Promise To be notified when tuit is removed from the database
     */
    deleteTuit = async (tid: string): Promise<any> =>
        TuitModel.deleteOne({_id: tid});

    /**
     * Removes tuit document with given tuit text from the database.
     * @param {string} tuitText Tuit text
     * @returns Promise To be notified when tuit is removed from the database
     */
    deleteTuitByTuitText = async (tuitText: string): Promise<any> =>
        TuitModel.deleteMany({tuit: tuitText})
}