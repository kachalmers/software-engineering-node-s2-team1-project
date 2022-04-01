/**
 * @file Implements mongoose schema for locations
 */
import mongoose from "mongoose";
import Location from "../../models/users/Location";

/**
 * @typedef LocationSchema Represents user's location
 * @property {number} latitude Latitude of location
 * @property {number} longitude Longitude of location
 */
const LocationSchema = new mongoose.Schema<Location>(
    {latitude: Number, longitude: Number})

export default LocationSchema