import { TemplateConfigType } from 'src/utils/config.type';

export const config: TemplateConfigType = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  session: {
    secret: process.env.AT_SECRET,
  },
  frontendUrl: process.env.FRONTEND_URL,
};

export default config;
