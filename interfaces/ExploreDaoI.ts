/**
 * @file Declares API for Tuits related data access object methods
 */
import Tuit from "../models/tuits/Tuit";
import Tuit2Tag from "../models/tuits/Tuit2Tag";

export default interface ExploreDaoI {
    findAllTags(): Promise<Tuit2Tag[]>;
    findTuitsByTag(tag: string): Promise<Tuit[]>;
}
