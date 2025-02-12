import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import "../imports/api/methods";
import "./links";
Meteor.startup(async () => {
  if ((await Meteor.users.find().countAsync()) === 0) {
    Accounts.createUser({ email: "admin@determinds.com", password: "123456" });
  }
});
