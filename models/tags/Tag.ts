/**
 * @file Declares Tag data type representing a user-generated category
 * marker which enables the sharing of a specific topic or theme.
 */

/**
 * @typedef Tag Represents a user-generated label for a topic or theme
 * @property {String} tag the name of the tag which corresponds to the topic
 * being identified
 * @property {Number} count the total number of uses of this tag in the system
 */
export default interface Tag {
    tag: String,
    count: Number
}