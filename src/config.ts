import dotenv from 'dotenv';

dotenv.config({ quiet: true });

interface Config {
  port: number;
  nodeEnv: string;
  BASE_URL: string;
  DB_NAME: string;
}

const config: Config = {
  port: Number(process.env.PORT) as number,
  nodeEnv: process.env.NODE_ENV as string,
  BASE_URL: process.env.BASE_URL as string,
  DB_NAME: process.env.DB_NAME as string ,
};

export default config;