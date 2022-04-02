/**
 * @file Declares API for Users related data access object methods
 */
import User from "../models/users/User"

export default interface UserDaoI {
    findAllUsers(): Promise<User[]>;
    findUserById(uid: string): Promise<any>;
    createUser(user: User): Promise<User>;
    updateUser(uid: string, user: User): Promise<any>;
    deleteUser(uid: string): Promise<any>;
    findUserByCredentials(username: string, password: string): Promise<any>;
    findUserByUsername(username: string): Promise<any>;
    deleteUserByUsername(username: string): Promise<any>;
}