import { Meteor } from "meteor/meteor";
import { createMethod } from "meteor/zodern:relay";
import { z } from "zod";

export const listUsers = createMethod({
  name: "users.list",
  schema: z.object({
    options: z.object({
      limit: z.number(),
      skip: z.number(),
      sort: z.object({
        field: z.string(),
        direction: z.boolean(),
      }),
    }),
    filters: z.unknown(),
  }),
  async run(args) {
    const { filters, options } = args;

    const data = await Meteor.users
      .createQuery({
        $filters: filters,
        $options: options,
        profile: 1,
        emails: 1,
        createdAt: 1,
      })
      .fetchAsync();

    const total = await Meteor.users.find(filters).countAsync();

    return { data, total };
  },
});
