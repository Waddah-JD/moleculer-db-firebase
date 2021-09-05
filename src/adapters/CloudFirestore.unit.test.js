"use strict";

const { ServiceBroker } = require("moleculer");
const CloudFirestoreAdapter = require("./CloudFirestore");
const {
  MissingApiKeyError,
  MissingProjectIdError,
} = require("../errors/adapter");

describe("Test CloudFirestore adapter", () => {
  const broker = new ServiceBroker({ logger: false });
  const service = broker.createService({
    name: "srv",
    collection: "posts",
  });

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  it("should be created with required 'public' methods", () => {
    const adapter = new CloudFirestoreAdapter("apiKey", "projectId");

    expect(adapter).toBeDefined();
    expect(adapter.init).toBeInstanceOf(Function);
    expect(adapter.connect).toBeInstanceOf(Function);
    expect(adapter.disconnect).toBeInstanceOf(Function);
    expect(adapter.list).toBeInstanceOf(Function);
    expect(adapter.getAll).toBeInstanceOf(Function);
    expect(adapter.find).toBeInstanceOf(Function);
    expect(adapter.findById).toBeInstanceOf(Function);
    expect(adapter.findByIds).toBeInstanceOf(Function);
    expect(adapter.create).toBeInstanceOf(Function);
    expect(adapter.update).toBeInstanceOf(Function);
    expect(adapter.delete).toBeInstanceOf(Function);
  });

  it("should throw an error if any of the required parameters to create adapter are missing", () => {
    expect(() => {
      const adapter = new CloudFirestoreAdapter(undefined, "projectId");
      adapter.init(broker, service);
    }).toThrow(MissingApiKeyError);

    expect(() => {
      const adapter = new CloudFirestoreAdapter("apiKey");
      adapter.init(broker, service);
    }).toThrow(MissingProjectIdError);
  });
});
