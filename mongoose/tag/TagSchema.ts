/**
 * @file Implements mongoose schema for tags
 */
import mongoose, {Schema} from "mongoose";
import Tag from "../../models/tags/Tag";   // make sure this matches

/**
 * @typedef TagSchema Represents likes relationship between tuits and tags
 * @property {String} tag the name of the tag which corresponds to the topic
 * being identified
 * @property {Number} count the total number of uses of this tag in the system
 */
const TagSchema = new mongoose.Schema<Tag>({
    tag: {type: String, required: true},
    count: {type: Number, default: 1}
}, {collection: "tags"})

export default TagSchema