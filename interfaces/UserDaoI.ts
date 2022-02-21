/**
 * @file Implements the interface that the DAO needs to implement. This would
 * allow us to replace the DAO implementation without disrupting the rest of
 * the application. It would also allow creating several implementations and a
 * factory could choose between several alternatives at run time.
 */
import User from "../models/users/User";

export default interface UserDaoI {
    findAllUsers (): Promise<User[]>;
    findUserById (uid: string): Promise<any>;
    createUser (user: User): Promise<User>;
    updateUser (uid: string, user: User): Promise<any>;
    deleteUser (uid: string): Promise<any>;
    deleteAllUsers (): Promise<any>;
};