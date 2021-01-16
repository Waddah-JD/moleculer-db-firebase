const { singleIdSchema, multipleIdsSchema } = require("./id");
const { conditionsSchema } = require("./conditions");
const { limitSchema } = require("./limit");
const { orderBySchema } = require("./orderBy");
const { requiredObjectSchema } = require("./object");

module.exports = {
  singleIdSchema,
  multipleIdsSchema,
  conditionsSchema,
  limitSchema,
  orderBySchema,
  requiredObjectSchema,
};
