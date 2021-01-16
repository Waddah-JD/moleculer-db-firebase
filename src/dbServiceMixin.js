"use strict";

const _ = require("lodash");
const { ValidationError } = require("moleculer").Errors;

const pkg = require("../package.json");
const {
  singleIdSchema,
  multipleIdsSchema,
  conditionsSchema,
  limitSchema,
  orderBySchema,
  requiredObjectSchema,
} = require("./paramsSchemas");

/**
 * Service mixin to access database entities
 *
 * @name dbServiceMixin
 * @module Service
 */
module.exports = {
  // Must overwrite it
  name: "",

  // Service's metadata
  metadata: {
    $category: "database",
    $description: "Firestore cloud service",
    $official: true,
    $package: {
      name: pkg.name,
      version: pkg.version,
      repo: pkg.repository ? pkg.repository.url : null,
    },
  },

  adapter: null,

  /**
   * Default settings
   */
  settings: {
    /** @type {String} Name of ID field. */
    idField: "_id",

    /** @type {Number} Default page size in `list` action. */
    pageSize: 10,

    /** @type {Number} Maximum page size in `list` action. */
    maxPageSize: 100,

    /** @type {Number} Maximum value of limit in `find` action. Default: `-1` (no limit) */
    maxLimit: -1,

    /** @type {Object|Function} Validator schema or a function to validate the incoming entity in `create` & 'insert' actions. */
    entityValidator: null,
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Get a document by ID(s)
     *
     * @actions
     *
     * @param {String|UUID|Array<String>|Array<UUID>} id
     *
     * @returns {Object} document
     */
    get: {
      cache: { keys: ["id"] },
      rest: "GET /:id",
      params: { id: [...singleIdSchema, ...multipleIdsSchema] },
      handler(ctx) {
        const { id } = ctx.params;

        if (_.isArray(id)) {
          return this.findByIds(ctx);
        } else {
          return this.get(ctx);
        }
      },
    },

    /**
     * Find documents
     *
     * @actions
     *
     * @param {Array?<Array<String>} conditions
     * @param {Number?} limit
     * @param {Array?<String>} orderBy
     *
     * @returns {Array} documents
     */
    find: {
      params: {
        conditions: conditionsSchema,
        limit: limitSchema,
        orderBy: orderBySchema,
      },
      handler(ctx) {
        return this.find(ctx);
      },
    },

    /**
     * Create a document
     *
     * @actions
     *
     * @param {Object} document
     *
     * @returns {Object} document
     */
    create: {
      rest: "POST /",
      params: { doc: requiredObjectSchema },
      handler(ctx) {
        return this.create(ctx);
      },
    },

    /**
     * Update a document
     *
     * @actions
     *
     * @param {String|UUID} id
     * @param {Object} values
     *
     * @returns {Object} document
     */
    update: {
      rest: "PUT /:id",
      params: { id: singleIdSchema, values: requiredObjectSchema },
      handler(ctx) {
        return this.update(ctx);
      },
    },

    /**
     * Delete a document
     *
     * @actions
     *
     * @param {String|UUID} id
     *
     * @returns {Object} document
     */
    delete: {
      rest: "DELETE /:id",
      params: { id: singleIdSchema },
      handler(ctx) {
        return this.delete(ctx);
      },
    },
  },

  /**
   * Methods
   */
  methods: {
    /**
     * Connect to database.
     *
     * @methods
     *
     * @returns {Promise}
     */
    connect() {
      this.adapter.connect();

      return Promise.resolve();
    },

    /**
     * Disconnect from database.
     *
     * @methods
     *
     * @returns {Promise}
     */
    disconnect() {
      this.adapter.connect();

      return Promise.resolve();
    },

    /**
     * Clear the cache & call entity lifecycle events
     *
     * @methods
     *
     * @param {String} type
     * @param {Object} json
     * @param {Context} ctx
     */
    entityChanged(type, json, ctx) {
      this.clearCache();
      const eventName = `entity${_.capitalize(type)}`;
      if (this.schema[eventName] != null) {
        return this.schema[eventName].call(this, json, ctx);
      }
    },

    /**
     * Clear cached entities
     *
     * @methods
     */
    clearCache() {
      this.broker.broadcast(`cache.clean.${this.fullName}`);
      if (this.broker.cacher) {
        return this.broker.cacher.clean(`${this.fullName}.*`);
      }
    },

    /**
     * Sanitize document ID property
     *
     * @methods
     *
     * @param {Object} doc
     *
     * @returns {Object} entity
     */
    sanitizeId(doc) {
      const idField = this.settings.idField;
      let entity = _.cloneDeep(doc);

      if (!entity[idField]) {
        entity[idField] = this.broker.generateUid();
      }

      if (idField !== "_id" && entity[idField] !== undefined) {
        entity._id = entity[idField];
        delete entity[idField];
      }

      return entity;
    },

    /**
     * Find documents
     *
     * @methods
     *
     * @param {Context} ctx
     *
     * @returns {Object} a mapping of ids  to found documents
     */
    async find(ctx) {
      const { conditions, limit, orderBy } = ctx.params;

      return await this.adapter.find({ conditions, limit, orderBy });
    },

    /**
     * Get a document by ID
     *
     * @methods
     *
     * @param {Context} ctx
     *
     * @returns {Object} document
     */
    async get(ctx) {
      const { id } = ctx.params;

      return await this.adapter.findById(id);
    },

    /**
     * Get documents by their IDs
     *
     * @param {Array<String>|Array<UUID>} id
     *
     * @returns {Object} a mapping of ids  to found documents
     */
    async findByIds(ctx) {
      const { id } = ctx.params;

      return await this.adapter.findByIds(id);
    },

    /**
     * Create a document
     *
     * @methods
     *
     * @param {Context} ctx
     *
     * @returns {Object} document
     *
     */
    async create(ctx) {
      const { doc } = ctx.params;

      const entity = this.sanitizeId(doc);
      const newEntity = await this.adapter.create(entity);

      await this.entityChanged("created", newEntity, ctx);
      return newEntity;
    },

    /**
     * Update a document
     *
     * @methods
     *
     * @param {Context} ctx
     *
     * @returns {Object} document
     *
     */
    async update(ctx) {
      const { id, values } = ctx.params;

      const updatedEntity = await this.adapter.update(id, values);

      await this.entityChanged("updated", updatedEntity, ctx);
      return updatedEntity;
    },

    /**
     * Delete a document
     *
     * @methods
     *
     * @param {Context} ctx
     *
     * @returns {Object} document
     *
     */
    async delete(ctx) {
      const { id } = ctx.params;

      const deletedEntity = await this.adapter.delete(id);

      await this.entityChanged("removed", deletedEntity, ctx);
      return deletedEntity;
    },
  },

  /**
   * Service created lifecycle event handler
   *
   * @returns {Promise}
   */
  created() {
    // Compatibility with < 0.4
    if (_.isString(this.settings.fields)) {
      this.settings.fields = this.settings.fields.split(" ");
    }

    this.adapter = this.schema.adapter;

    this.adapter.init(this.broker, this);

    // Transform entity validation schema to checker function
    if (
      this.broker.validator &&
      _.isObject(this.settings.entityValidator) &&
      !_.isFunction(this.settings.entityValidator)
    ) {
      const check = this.broker.validator.compile(
        this.settings.entityValidator
      );
      this.settings.entityValidator = (entity) => {
        const res = check(entity);
        if (res === true) return Promise.resolve();
        else
          return Promise.reject(
            new ValidationError("Entity validation error!", null, res)
          );
      };
    }
  },

  /**
   * Service started lifecycle event handler
   *
   * @returns {Promise}
   *
   */
  started() {
    if (this.adapter) {
      return new Promise((resolve) => {
        let connecting = () => {
          this.connect()
            .then(resolve)
            .catch((err) => {
              this.logger.error("Connection error!", err);
              setTimeout(() => {
                this.logger.warn("Reconnecting...");
                connecting();
              }, 1000);
            });
        };

        connecting();
      });
    }

    return Promise.reject(new Error("Please set the store adapter in schema!"));
  },

  /**
   * Service stopped lifecycle event handler
   *
   * @returns {Promise}
   */
  stopped() {
    if (this.adapter) return this.disconnect();
  },
};
