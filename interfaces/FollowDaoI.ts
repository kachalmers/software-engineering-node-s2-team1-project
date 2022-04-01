/**
 * @file Declares API for Follows related data access object methods
 */
import Follow from "../models/follows/Follow";

export default interface FollowDaoI {
    userFollowsAnotherUser(uid: string, auid: string): Promise<Follow>;
    userUnfollowsAnotherUser(uid: string, auid: string): Promise<any>;
    findAllFollowing(uid: string): Promise<Follow[]>;
    findAllFollowers(uid: string): Promise<Follow[]>;
    findAllFollow(): Promise<Follow[]>;
}