export type TemplateConfigType = {
  google: {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
  };
  session: {
    secret: string;
  };
  frontendUrl: string;
};
