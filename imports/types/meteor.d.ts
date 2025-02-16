declare module 'meteor/meteor' {
  namespace Meteor {
    interface Server {
      method_handlers: {
        [key: string]: Function;
      };
    }
    const server: Server;
  }
}
