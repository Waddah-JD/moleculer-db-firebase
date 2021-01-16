const singleId = [{ type: "string" }, { type: "number" }, { type: "uuid" }];

const multipleIds = [
  { type: "array", items: "string" },
  { type: "array", items: "number" },
  { type: "array", items: "uuid" },
];

module.exports = { singleId, multipleIds };
