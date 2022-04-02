/**
 * @file Declares User data type representing users.
 */
import AccountType from "./AccountType";
import MaritalStatus from "./MaritalStatus";
import Location from "./Location";

/**
 * @typedef User represent user
 * @property {string} username user's username
 * @property {string} password user's password
 * @property {string} firstName user's first name
 * @property {string} lastName user's last name
 * @property {string} email user's email
 * @property {string} profilePhoto user's profile photo
 * @property {string} headerImage user's headerImage
 * @property {AccountType} accountType user's account type where AccountType is an enumeration
 * @property {MaritalStatus} maritalStatus user's marital status where MaritalStatus is an enumeration
 * @property {string} biography user's biography
 * @property {Date} dateOfBirth user's date of birth
 * @property {Date} joined user's joined date
 * @property {Location} location user's location
 */
export default class User {
    private username: string = '';
    private password: string = '';
    private firstName: string = '';
    private lastName: string = '';
    private email: string = '';
    private profilePhoto: string | null = null;
    private headerImage: string | null = null;
    private accountType: AccountType = AccountType.Personal;
    private maritalStatus: MaritalStatus = MaritalStatus.Single;
    private biography: string | null = null;
    private dateOfBirth: Date | null = null;
    private joined: Date = new Date();
    private location: Location | null = null;
}