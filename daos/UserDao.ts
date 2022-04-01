/**
 * @file Implements DAO managing data storage of users. Uses mongoose UserModel
 * to integrate with MongoDB
 */
import User from "../models/users/User";
import UserModel from "../mongoose/users/UserModel";
import UserDaoI from "../interfaces/UserDaoI";

/**
 * @class UserDao Implements Data Access Object managing data storage
 * of Users
 * @property {UserDao} userDao Private single instance of UserDao
 */
export default class UserDao implements UserDaoI {
    private static userDao : UserDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns UserDao
     */
    public static getInstance = (): UserDao => {
        if (UserDao.userDao === null) {
            UserDao.userDao = new UserDao();
        }
        return UserDao.userDao;
    }

    /**
     * Uses UserModel to retrieve all user documents from users collection
     * @returns Promise To be notified when the users are retrieved from
     * database
     */
    findAllUsers = async (): Promise<User[]> =>
        UserModel.find().exec();

    /**
     * Uses UserModel to retrieve single user document from users collection
     * @param {string} uid User's primary key
     * @returns Promise To be notified when user is retrieved from the database
     */
    findUserById = async (uid: string): Promise<any> =>
        UserModel.findById(uid);

    /**
     * Inserts user instance into the database
     * @param {User} user Instance to be inserted into the database
     * @returns Promise To be notified when user is inserted into the database
     */
    createUser = async (user: User): Promise<User> =>
        UserModel.create(user);

    /**
     * Removes user from the database.
     * @param {string} uid Primary key of user to be removed
     * @returns Promise To be notified when user is removed from the database
     */
    deleteUser = async (uid: string): Promise<any> =>
        UserModel.deleteOne({_id: uid});

    /**
     * Updates user with new values in database
     * @param {string} uid Primary key of user to be modified
     * @param {User} user User object containing properties and their new values
     * @returns Promise To be notified when user is updated in the database
     */
    updateUser = async (uid: string, user: User): Promise<any> =>
        UserModel.updateOne({_id: uid}, {$set: user});

    /**
     * Uses UserModel to retrieve a single user document from users collection
     * using the credential
     * @param {string} username User's username
     * @param {string} password User's password
     * @returns Promise To be notified when user is retrieved from the database
     */
    findUserByCredentials = async (username: string, password: string): Promise<any> =>
        UserModel.findOne({username, password});

    /**
     * Uses UserModel to retrieve a single user document from users collection
     * using the given username
     * @param {string} username User's username
     * @returns Promise To be notified when user is retrieved from the database
     */
    findUserByUsername = async (username: string): Promise<any> =>
        UserModel.findOne({username});

    /**
     * Removes the user instance in the database that matches the username
     * @param {string} username User's username
     * @returns Promise To be notified when user is removed from the database
     */
    deleteUserByUsername = async (username: string): Promise<any> =>
        UserModel.deleteMany({username});
}