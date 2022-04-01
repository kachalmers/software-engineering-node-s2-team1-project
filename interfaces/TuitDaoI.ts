/**
 * @file Declares API for Tuits related data access object methods
 */
import Tuit from "../models/tuits/Tuit";

export default interface TuitDaoI {
    findAllTuits(): Promise<Tuit[]>;
    findTuitsByUser(uid: string): Promise<Tuit[]>;
    findTuitById(tid: string): Promise<Tuit>;
    createTuit(tuit: Tuit): Promise<Tuit>;
    createTuitByUser(uid: string, tuit: Tuit): Promise<Tuit>;
    updateTuit(tid: string, tuit: Tuit): Promise<any>;
    deleteTuit(tid: string): Promise<any>;
    deleteTuitByContent(content: string): Promise<any>;
    updateLikes(tid: string, newStats: any): Promise<any>;
}