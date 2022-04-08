/**
 * @file Declares API for Tuit2Tags related data access object methods
 */

import Tuit2Tag from "../models/tags/Tuit2Tag";

export default interface Tuit2TagDaoI {
    createTuit2Tag(tuit: string, tag: string): Promise<Tuit2Tag>;
    deleteTuit2Tag(t2tID: string): Promise<any>;
};