class MissingApiKeyError extends Error {
  constructor() {
    super(
      "missing API key parameter: it should be passed as a first paramter to call: `new CloudFirestoreAdapter(apiKey, projectId)`"
    );
    this.name = "MissingApiKeyError";
  }
}

class MissingProjectIdError extends Error {
  constructor() {
    super(
      "missing API key parameter: it should be passed as a second paramter to call: `new CloudFirestoreAdapter(apiKey, projectId)`"
    );
    this.name = "MissingProjectIdError";
  }
}

module.exports = { MissingApiKeyError, MissingProjectIdError };
