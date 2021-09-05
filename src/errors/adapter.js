class MissingApiKeyError extends Error {
  constructor() {
    super();
    this.name = "MissingApiKeyError";
    this.message =
      "missing API key parameter: it should be passed as a first paramter to call: `new CloudFirestoreAdapter(apiKey, projectId)`";
  }
}

class MissingProjectIdError extends Error {
  constructor() {
    super();
    this.name = "MissingProjectIdError";
    this.message =
      "missing API key parameter: it should be passed as a second paramter to call: `new CloudFirestoreAdapter(apiKey, projectId)`";
  }
}

module.exports = { MissingApiKeyError, MissingProjectIdError };
