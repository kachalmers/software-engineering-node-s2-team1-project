/**
 * @file Implements helper service for retrieving tuit information.
 */
import LikeDao from "../daos/LikeDao";
import DislikeDao from "../daos/DislikeDao";
import TagDao from "../daos/TagDao";
import Tuit2TagDao from "../daos/Tuit2TagDao";
import Tuit from "../models/tuits/Tuit";
import Tuit2Tag from "../models/tags/Tuit2Tag";

/**
 * @class TuitService Implements Tuit service to help with tuit data
 * retrieval and checking.
 */
export default class TuitService {
    public static tuitService: TuitService | null = null;
    private static likeDao: LikeDao = LikeDao.getInstance();
    private static dislikeDao: DislikeDao = DislikeDao.getInstance();
    private static tagDao: TagDao = TagDao.getInstance();
    private static tuit2TagDao: Tuit2TagDao = Tuit2TagDao.getInstance();

    /**
     * Creates singleton TuitService instance.
     * @returns TuitService
     */
    public static getInstance = (): TuitService => {
        if (TuitService.tuitService === null) {
            TuitService.tuitService = new TuitService();
        }
        return TuitService.tuitService;
    }

    private constructor() {
    }

    /**
     * Loop through given tuits and check for tuit-user relationships,
     * including ownership of a given tuit by the given user, likes of a given
     * tuit by the given user, and dislikes of a given tuit by the given user.
     * If any checks pass, an ownedByMe, likedByMe, and/or dislikedByMe
     * attribute will be added to the tuit to assist the client in determining
     * the user's relationships with the tuit.
     * @param {any} userId Primary key of user
     * @param {Tuit[]} tuits Array of tuits
     */
    public markTuitsForUserInvolvement = async (userId: any, tuits: Tuit[]): Promise<any[]> => {
        let likesOfTuitsByUser: any[] = []
        let dislikesOfTuitsByUser: any[] = []

        // For each tuit...
        tuits.forEach((tuit: any) => {
            // Find like of tuit by user if it exists
            let likeOfTuitByUser = TuitService.likeDao
                .findUserLikesTuit(userId, tuit._id);

            // Find dislike of tuit by user if it exists
            let dislikesOfTuitByUser = TuitService.dislikeDao
                .findUserDislikesTuit(userId, tuit._id);

            // Add likeOfTuitByUser to list of likes of tuits by user
            likesOfTuitsByUser.push(likeOfTuitByUser);

            // Add dislikesOfTuitByUser to list of dislikes of tuits by user
            dislikesOfTuitsByUser.push(dislikesOfTuitByUser);
        })

        // Wait for all likes/dislikes by user to be found
        const allLikesOfTuitsByUser = await Promise.all(likesOfTuitsByUser);
        const allDislikesOfTuitsByUser = await Promise.all(dislikesOfTuitsByUser);

        // Store array of ids of likes of tuits by user
        const allLikesOfTuitsByUserIds = allLikesOfTuitsByUser
            .map((like) => {
                if (like) {
                    return like.tuit.toString();
                }
            })

        // Store array of ids of dislikes of tuits by user
        const allDislikesOfTuitsByUserIds = allDislikesOfTuitsByUser
            .map((dislike) => {
                if (dislike) {
                    return dislike.tuit.toString();
                }
            })

        const markedTuits = tuits.map((tuit: any) => {
            let tuitCopy = tuit.toObject();

            // If tuit has been liked by given user...
            if (allLikesOfTuitsByUserIds.indexOf(tuit._id.toString()) >= 0) {
                // Mark the likedByMe flag as true
                tuitCopy = {...tuitCopy, likedByMe: true};
            }
            // If tuit has been disliked by given user...
            if (allDislikesOfTuitsByUserIds.indexOf(tuit._id.toString()) >= 0) {
                // Mark the dislikedByMe flag as true
                tuitCopy = {...tuitCopy, dislikedByMe: true};
            }
            // If tuit's postedBy attribute matches the given userId...
            if (tuitCopy.postedBy && tuitCopy.postedBy._id.toString() === userId.toString()) {
                // Marked the ownedByMe flag as true
                tuitCopy = {...tuitCopy, ownedByMe: true};
            }
            return tuitCopy;
        })
        return markedTuits;
    }


    public createTagsAndTuit2TagsForTuit = async (newTuit: Tuit): Promise<any> => {
        const tuitText = newTuit.tuit;
        const newTuitId = newTuit._id.toString();

        // Check if Tuit text contains a tag
        if (tuitText.includes('#')) {
            const splitTuit = tuitText.split(" ");

            let almostTag;  // initialize tag to feed into createTag
            let newTag; // initialize tag to be found by tag text after created

            // Loop through words
            for (let i = 0; i < splitTuit.length; i++) {
                // If the first char is #
                if (splitTuit[i].charAt(0) === '#') {
                    // Prep a Tag (use the word w/o the #)
                    almostTag = {
                        "tag": splitTuit[i].slice(1),
                        "count": 1
                    }
                    // Create the tag
                    await TuitService.tagDao.createTag(almostTag);
                    // Find the newly created Tag
                    newTag = await TuitService.tagDao.findTagByText(almostTag.tag);
                    // and make an entry in Tuit2Tag
                    await TuitService.tuit2TagDao.createTuit2Tag(newTuitId, newTag._id);
                }
            }
        }
        return;
    }

    /**
     * Removes Tuit2Tags and updates/removes Tags corresponding with the given tuits
     * from the database.
     * @param {Tuit[]} tuits2BeDeleted Array of tuits
     */
    public deleteTuit2TagsAndUpdateTagsByTuits = async (tuits2BeDeleted: Tuit[]): Promise<any> => {
        let tuit2TagsToBeDeleted: Tuit2Tag[] = []; // initialize list of tuit2Tags to remove
        let tuit2TagsForTuit: Tuit2Tag[] = [];   // initialize list of tuit2Tags for a tuit

        // For each tuit...
        for (let i = 0; i < tuits2BeDeleted.length; i++) {
            // Find tuit2Tags for tuit
            tuit2TagsForTuit = await TuitService.tuit2TagDao
                .findTuit2TagsByTuit(tuits2BeDeleted[i]._id.toString());

            // Add tuit2Tags for tuit to list of tuit2Tags to be removed
            tuit2TagsForTuit.map(tuit2TagForTuit => tuit2TagsToBeDeleted.push(tuit2TagForTuit));

            tuit2TagsForTuit = [];  // reset list of tags for next tuit
        }

        // Get list of tags to be deleted from tuit2Tags
        const tagsToBeDeleted = tuit2TagsToBeDeleted.map(tuit2Tag => tuit2Tag.tag);

        // For each of the tuit2tags related to the given tuits...
        for (let i = 0; i < tuit2TagsToBeDeleted.length; i++) {
            // Delete tuit2Tags by each of their IDs
            await TuitService.tuit2TagDao.deleteTuit2TagById(tuit2TagsToBeDeleted[i]._id.toString());
        }

        // Decrement count for tags or delete if count is down to 0
        let updatedTag;
        for (let i = 0; i < tagsToBeDeleted.length; i++) {
            // Retrieve a fresh copy of the tag from the database
            updatedTag = await TuitService.tagDao.findTagByText(tagsToBeDeleted[i].tag.toString());

            updatedTag.count--; // Decrement tag count

            // If the tag exists and the number of tuits with the tag is 0...
            if (updatedTag._id && updatedTag.count === 0) {
                // Remove tag from database
                await TuitService.tagDao.deleteTag(updatedTag._id.toString());
            } else {
                // Update the tag with the decremented count
                await TuitService.tagDao.updateTag(updatedTag);
            }
        }

        return;
    }
}