import * as debug from 'debug';
import * as path from 'path';
import * as uri from 'urijs';

const log = debug('br:Config');

export class ConfigType {
  public bootstrap() {
    const env = process.env.NODE_ENV
      ? process.env.NODE_ENV.toLowerCase()
      : 'local';
    log(env);
    if (env === 'local' || env === 'development') {
      const envpath = path.resolve(__dirname + '/.env.development.local');
      log(envpath);
      require('dotenv').config({ path: envpath });
    }
    log(process.env.API_SERVER_HOST);
  }

  public getApiURI(): uri.URI {
    return uri({
      port: process.env.API_SERVER_PORT,
      protocol: process.env.API_SERVER_PROTOCOL,
      hostname: process.env.API_SERVER_HOST
    });
  }
}

export const Config = (() => {
  const config = new ConfigType();
  config.bootstrap();
  return config;
})();
