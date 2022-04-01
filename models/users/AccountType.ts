/**
 * @file Declares AccountType data type representing user's account type.
 */

/**
 * @typedef AccountType Represents user's account type.
 * @property {string} Personal "PERSONAL"
 * @property {string} Academic "ACADEMIC"
 * @property {string} Professional "PROFESSIONAL"
 */
enum AccountType {
    Personal = 'PERSONAL',
    Academic = 'ACADEMIC',
    Professional = 'PROFESSIONAL'
}

export default AccountType;