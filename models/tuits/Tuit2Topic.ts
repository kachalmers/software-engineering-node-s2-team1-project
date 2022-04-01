/**
 * @file Declares Tuit2Topic data type representing relationship
 * between tuits and topics, as in a tuit has a topic
 */
import Tuit from './Tuit'

/**
 * @typedef Tuit2Topic Represents relationship between tuits and topics
 * that is a tuit has a topic.
 * @property {string} topic Topic name.
 * @property {Tuit} tuit Tuit that has the topic.
 */
export default class Tuit2Topic {
    private topic: string = '';
    private tuit: Tuit | null = null;
}