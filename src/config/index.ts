import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/flower-shop',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret',
    accessExpire: process.env.JWT_EXPIRE || '30d',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '60d',
  },
  saltRounds: 10,
};

export default config;
