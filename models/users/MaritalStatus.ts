/**
 * @file Declares MaritalStatus data type which is
 * an enumeration to represents user's martial status.
 */

/**
 * @typedef MaritalStatus represents user's martial status
 * @property {string} Married "MARRIED"
 * @property {string} Single "SINGLE"
 * @property {string} Widowed "WIDOWED"
 */
enum MaritalStatus {
    Married = 'MARRIED',
    Single = 'SINGLE',
    Widowed = 'WIDOWED'
}

export default MaritalStatus;