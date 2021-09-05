"use strict";

const { ServiceBroker } = require("moleculer");
const CloudFirestoreAdapter = require("./CloudFirestore");

describe("Test CloudFirestore adapter", () => {
  const broker = new ServiceBroker({ logger: false });

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
});
