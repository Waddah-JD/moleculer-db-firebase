"use strict";

const { ServiceBroker } = require("moleculer");
const firebase = require("firebase");

const CloudFirestoreAdapter = require("./CloudFirestore");
const {
  MissingApiKeyError,
  MissingProjectIdError,
} = require("../errors/adapter");

describe("CloudFirestore", () => {
  const broker = new ServiceBroker({ logger: false });
  const service = broker.createService({
    name: "srv",
    collection: "posts",
  });

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("constructor", () => {
    it("should be created with required 'public' methods", () => {
      const adapter = new CloudFirestoreAdapter("apiKey", "projectId");

      expect(adapter).toBeDefined();
      expect(adapter).toBeInstanceOf(CloudFirestoreAdapter);
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

  describe("init", () => {
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

    it("should have a valid 'instance' if the adapter was passed valid paramters", () => {
      const adapter = new CloudFirestoreAdapter("apiKey", "projectId");
      adapter.init(broker, service);

      expect(adapter.instance).toBeInstanceOf(firebase.app.App);
    });
  });

  describe("connect", () => {
    it("should have a vaild 'db' field", () => {
      const adapter = new CloudFirestoreAdapter("apiKey", "projectId");
      adapter.init(broker, service);
      expect(adapter.db).toBeUndefined();
      expect(adapter.collection).toBeUndefined();
      adapter.connect();
      expect(adapter.db).toBeInstanceOf(firebase.firestore.Firestore);
      expect(adapter.collection).toBeDefined();
    });
  });

  describe("disconnect", () => {
    it("should clear 'db' and 'collection' on disconnect", () => {
      const adapter = new CloudFirestoreAdapter("apiKey", "projectId");
      adapter.init(broker, service);
      adapter.disconnect();
      expect(adapter.db).toBeNull();
      expect(adapter.collection).toBeNull();
    });
  });
});
