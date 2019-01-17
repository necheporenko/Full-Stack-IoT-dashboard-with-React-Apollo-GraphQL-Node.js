export const env = process.env.NODE_ENV || 'development';
export const SERVER_PORT = parseInt(process.env.PORT, 10) || 4000;
export const corsDomain = process.env.CORS_DOMAIN || '*';
export const DB_HOST = 'localhost';
export const DB_PORT = 27017;
export const DB_NAME = 'qraphql';

