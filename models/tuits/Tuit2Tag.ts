/**
 * @file Declares Tuit2Tag data type representing relation between
 * tuits and tags, as in a tuit has a tag
 */
import Tuit from './Tuit'

/**
 * @typedef Tuit2Tag Represents relationship between tuit and tag,
 * that is a tuit has a tag
 * @property {string} tag Tag name.
 * @property {Tuit} tuit Tuit that is tagged.
 */
export default class Tuit2Tag {
    private tag: string = '';
    private tuit: Tuit | null = null;
}