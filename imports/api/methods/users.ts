import { Meteor } from "meteor/meteor";
import { createMethod } from "meteor/zodern:relay";
import { z } from "zod";

// Define a strict filter schema to prevent NoSQL injection
const userFilterSchema = z.object({
  _id: z.string().optional(),
  emails: z.array(z.object({
    address: z.string(),
    verified: z.boolean()
  })).optional(),
  profile: z.object({
    name: z.string()
  }).optional(),
  search: z.object({
    fields: z.array(z.string()).optional(),
    searchText: z.string().optional(),
  }).optional(),
  createdAt: z.array(z.string().nullable()).optional(),
}).strict();

export const listUsers = createMethod({
  name: "users.list",
  schema: z.object({
    options: z.object({
      limit: z.number().optional(),
      skip: z.number().optional(),
      sort: z.object({
        field: z.string(),
        direction: z.boolean()
      }).optional(),
    }),
    filters: userFilterSchema.optional()
  }),
  async run(args) {
    const { filters = {}, options } = args;

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

export const getUserDetails = createMethod({
  name: "users.details",
  schema: z.object({
    userId: z.string(),
  }),
  async run({ userId }) {
    return Meteor.users.findOne(userId);
  },
});
