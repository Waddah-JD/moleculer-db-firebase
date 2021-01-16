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

module.exports = { singleIdSchema, multipleIdsSchema };
