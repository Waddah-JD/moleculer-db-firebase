const singleIdSchema = [
  { type: "string" },
  { type: "number" },
  { type: "uuid" },
];

const multipleIdsSchema = [
  { type: "array", items: "string" },
  { type: "array", items: "number" },
  { type: "array", items: "uuid" },
];

const conditionSchema = {
  type: "array",
  optional: false,
  length: 3,
  items: [{ type: "string" }, { type: "number", convert: false }],
};

const conditionsSchema = {
  type: "array",
  optional: true,
  items: conditionSchema,
};

const limitSchema = {
  type: "number",
  integer: true,
  positive: true,
  convert: true,
  optional: true,
};

const requiredObjectSchema = { type: "object", optional: false };

const orderBySchema = {
  type: "array",
  optional: true,
  items: { type: "string" },
};

module.exports = {
  singleIdSchema,
  multipleIdsSchema,
  conditionsSchema,
  limitSchema,
  orderBySchema,
  requiredObjectSchema,
};
