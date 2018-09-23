// npm packages
const mongoose = require('mongoose');

// app imports
const { APIError } = require('../helpers');

// globals
const Schema = mongoose.Schema;

const thingSchema = new Schema({
  name: String,
  number: Number,
  stuff: [String],
  url: String
});

thingSchema.statics = {
  /**
   * Create a Single New Thing
   * @param {object} newThing - an instance of Thing
   * @returns {Promise<Thing, APIError>}
   */
  async createThing(newThing) {
    try {
      const duplicate = await this.findOne({ name: newThing.name });
      if (duplicate) {
        throw new APIError(
          409,
          'Thing Already Exists',
          `There is already a thing with name '${newThing.name}'.`
        );
      }
      const thing = await newThing.save();
      return thing.toObject();
    } catch (err) {
      return Promise.reject(err);
    }
  },
  /**
   * Delete a single Thing
   * @param {String} name - the Thing's name
   * @returns {Promise<Thing, APIError>}
   */
  async deleteThing(name) {
    try {
      const deleted = await this.findOneAndRemove({ name });
      if (!deleted) {
        throw new APIError(404, 'Thing Not Found', `No thing '${name}' found.`);
      }
      return deleted.toObject();
    } catch (err) {
      return Promise.reject(err);
    }
  },
  /**
   * Get a single Thing by name
   * @param {String} name - the Thing's name
   * @returns {Promise<Thing, APIError>}
   */
  async readThing(name) {
    try {
      const thing = await this.findOne({ name });

      if (!thing) {
        throw new APIError(404, 'Thing Not Found', `No thing '${name}' found.`);
      }
      return thing.toObject();
    } catch (err) {
      return Promise.reject(err);
    }
  },
  /**
   * Get a list of Things
   * @param {Object} query - pre-formatted query to retrieve things.
   * @param {Object} fields - a list of fields to select or not in object form
   * @param {String} skip - number of docs to skip (for pagination)
   * @param {String} limit - number of docs to limit by (for pagination)
   * @returns {Promise<Things, APIError>}
   */
  async readThings(query, fields, skip, limit) {
    try {
      const things = await this.find(query, fields)
        .skip(skip)
        .limit(limit)
        .sort({ name: 1 })
        .exec();
      if (!things.length) {
        return [];
      }
      return things.map(thing => thing.toObject());
    } catch (err) {
      return Promise.reject(err);
    }
  },
  /**
   * Patch/Update a single Thing
   * @param {String} name - the Thing's name
   * @param {Object} thingUpdate - the json containing the Thing attributes
   * @returns {Promise<Thing, APIError>}
   */
  async updateThing(name, thingUpdate) {
    try {
      const thing = await this.findOneAndUpdate({ name }, thingUpdate, {
        new: true
      });
      if (!thing) {
        throw new APIError(404, 'Thing Not Found', `No thing '${name}' found.`);
      }
      return thing.toObject();
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

/* Transform with .toObject to remove __v and _id from response */
if (!thingSchema.options.toObject) thingSchema.options.toObject = {};
thingSchema.options.toObject.transform = (doc, ret) => {
  const transformed = ret;
  delete transformed._id;
  delete transformed.__v;
  return transformed;
};

/** Ensure MongoDB Indices **/
thingSchema.index({ name: 1, number: 1 }, { unique: true }); // example compound idx

module.exports = mongoose.model('Thing', thingSchema);
