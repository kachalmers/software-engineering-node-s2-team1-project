import Tuit from "../models/Tuit";
import TuitModel from "../mongoose/TuitModel";
import TuitDaoI from "../interfaces/TuitDao";

export default class TuitDao implements TuitDaoI {
    static tuitDao: TuitDao = new TuitDao();
    static getInstance(): TuitDao { return this.tuitDao; }

    async findAllTuits(): Promise<Tuit[]> {
       return await TuitModel.find();
    }
    async findTuitsByUser(uid: string): Promise<Tuit[] | null> {
       return await TuitModel.findById(uid);
    }
    async findTuitById(tid: string): Promise<Tuit | null> {
       return await TuitModel.findById(tid);
    }
    async createTuit(tuit: Tuit): Promise<Tuit> {
       return await TuitModel.create(tuit);
    }
    async updateTuit(tid: string, tuit: Tuit): Promise<any> {
       return await TuitModel.updateOne({_id: tid}, {$set: tuit});
    }
    async deleteTuit(tid: string): Promise<any> {
       return await TuitModel.deleteOne({_id: tid});
    }
}
