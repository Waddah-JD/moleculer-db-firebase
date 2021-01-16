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

module.exports = { conditionsSchema };
