import { Grapher } from "meteor/cultofcoders:grapher";
import { Mongo } from "meteor/mongo";
import { DocumentNode } from "graphql";

declare module "meteor/mongo" {
  module Mongo {
    interface Options {}

    interface Collection<T = {}, U = T> {
      attachSchema(schema: T): void;
      astToQuery(
        ast: DocumentNode,
        query: Grapher.GraphQLQuery<T extends object ? T : {}>
      ): Mongo.Cursor<T>;
      createQuery(name: string, body: Grapher.Body<T> | {}, options?: {}): Grapher.Query;
      createQuery(body: Grapher.Body<T> | {}, options?: {}): Grapher.Query;
      expose: Grapher.Exposure;
      addLinks(links: Grapher.Link): void;
      addReducers(): void;
      rawCollection(): {
        findOne(selector: any): Promise<U | null>;
        find(selector: any): any;
        deleteMany(selector: any): Promise<{ deletedCount: number }>;
        updateMany(
          selector: any,
          modifier: any,
          options?: { upsert?: boolean }
        ): Promise<{ modifiedCount: number; upsertedCount?: number }>;
      };}
  }
}