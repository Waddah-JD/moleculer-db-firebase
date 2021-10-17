/* eslint-disable no-undef */
"use strict";

const { ServiceBroker } = require("moleculer");
require("dotenv").config({ path: ".env.test" });

const dbServiceMixin = require("./dbServiceMixin");
const CloudFirestoreAdapter = require("./adapters/CloudFirestore");

describe("direct action calls", () => {
  const API_KEY = process.env.API_KEY;
  const PROJECT_ID = process.env.PROJECT_ID;

  const broker = new ServiceBroker({ logger: false });
  broker.createService({
    name: "posts",
    mixins: [dbServiceMixin],
    adapter: new CloudFirestoreAdapter(API_KEY, PROJECT_ID),
    collection: "posts",
  });

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  const firstPost = {
    _id: "1",
    title: "first!",
    category: "JS",
    author: "a name that starts with B",
    createdAt: 1,
  };
  const secondPost = {
    _id: "2",
    title: "third time is the charm",
    category: "JS",
    author: "a name that starts with A",
    createdAt: 2,
  };
  const postWithNoId = {
    title: "another one",
    category: "JS",
    author: "a name that starts with Z",
    createdAt: 3,
  };

  it("should create a new document with a predefined ID", async () => {
    const createdPost = await broker.call("posts.create", { doc: firstPost });

    expect(createdPost).toStrictEqual(firstPost);
  });

  it("should create a new document without explictly passing an ID", async () => {
    const createdPost = await broker.call("posts.create", {
      doc: postWithNoId,
    });

    expect(createdPost).toEqual(
      expect.objectContaining({ _id: expect.any(String), ...postWithNoId })
    );
  });

  it("should create another new document with a predefined ID", async () => {
    const createdPost = await broker.call("posts.create", {
      doc: secondPost,
    });

    expect(createdPost).toStrictEqual(secondPost);
  });

  it("should get document by ID", async () => {
    const doc1 = await broker.call("posts.get", { id: "1" });

    expect(doc1).toStrictEqual(firstPost);
  });

  it("should find multiple documents by IDs", async () => {
    const docs1and2 = await broker.call("posts.get", { id: ["1", "2"] });

    expect(docs1and2).toStrictEqual({
      1: firstPost,
      2: secondPost,
    });
  });

  it("should get all documents", async () => {
    const allDocs = await broker.call("posts.list");

    expect(Object.values(allDocs)).toEqual(
      expect.arrayContaining([
        firstPost,
        secondPost,
        expect.objectContaining({
          _id: expect.any(String),
          ...postWithNoId,
        }),
      ])
    );
  });

  it("should find multiple documents by some condtion", async () => {
    const allDocs = await broker.call("posts.find", {
      conditions: [["category", "==", "JS"]],
    });

    expect(Object.values(allDocs)).toEqual(
      expect.arrayContaining([
        firstPost,
        secondPost,
        expect.objectContaining({
          _id: expect.any(String),
          ...postWithNoId,
        }),
      ])
    );
  });

  it("should find multiple documents by some condtion and return sorted results", async () => {
    const allDocs = await broker.call("posts.find", {
      conditions: [["category", "==", "JS"]],
      orderBy: ["author", "createdAt"],
    });

    expect(Object.values(allDocs)).toEqual(
      expect.arrayContaining([
        secondPost,
        firstPost,
        expect.objectContaining({
          _id: expect.any(String),
          ...postWithNoId,
        }),
      ])
    );
  });

  it("should find multiple documents by some condtion and return limited number of results", async () => {
    const allDocs = await broker.call("posts.find", {
      conditions: [["category", "==", "JS"]],
      orderBy: ["author", "createdAt"],
      limit: 2,
    });

    expect(Object.values(allDocs)).toEqual(
      expect.arrayContaining([secondPost, firstPost])
    );
  });

  it("should update a document", async () => {
    const updatedDoc = await broker.call("posts.update", {
      id: "2",
      values: { author: "another name", createdAt: 999 },
    });
    expect(updatedDoc).toStrictEqual({
      ...secondPost,
      author: "another name",
      createdAt: 999,
    });

    const foundUpdatedDoc = await broker.call("posts.get", { id: "2" });
    expect(foundUpdatedDoc).toStrictEqual({
      ...secondPost,
      author: "another name",
      createdAt: 999,
    });
  });

  it("should delete a document", async () => {
    const deletedDoc = await broker.call("posts.delete", { id: "1" });
    expect(deletedDoc).toStrictEqual(firstPost);

    const foundDeletedDoc = await broker.call("posts.get", { id: "1" });
    expect(foundDeletedDoc).toBeUndefined();
  });
});
