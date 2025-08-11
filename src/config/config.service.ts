/* eslint-disable comma-dangle */
const path = require('path');

// Load file env theo NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = nodeEnv === 'production' ? '.env' : '.env.dev';

try {
  require('dotenv').config({ path: envFile });
  console.log(`Loaded environment from: ${envFile}`);
} catch (error) {
  console.log(`Environment file ${envFile} not found, using default .env`);
  require('dotenv').config();
}

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getEnv(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getEnv(k, true));
    return this;
  }

  public getPort() {
    return this.getEnv('PORT', true);
  }

  public getRedisConfig() {
    return {
      redisURL: this.getEnv('REDIS_URL'),
      host: this.getEnv('REDIS_HOST'),
      port: parseInt(this.getEnv('REDIS_PORT'))
    };
  }

  // public getPostgresConfig() {
  //   return {
  //     host: this.getEnv('DB_HOST'),
  //     port: parseInt(this.getEnv('DB_PORT')),
  //     username: this.getEnv('DB_USERNAME'),
  //     password: this.getEnv('DB_PASSWORD'),
  //     database: this.getEnv('DB_DATABASE')
  //   };
  // }

  public getMongoConfig() {
    return {
      uri: this.getEnv('MONGO_URI')
    };
  }

  // public getTypeOrmConfig() {
  //   return {
  //     type: 'postgres',

  //     host: this.getEnv('DB_HOST'),
  //     port: parseInt(this.getEnv('DB_PORT')),
  //     username: this.getEnv('DB_USERNAME'),
  //     password: this.getEnv('DB_PASSWORD'),
  //     database: this.getEnv('DB_DATABASE'),
  //     entities: ['dist/src/**/*.entity{.ts,.js}'],
  //     migrations: ['dist/src/migration/**/*{.js,.ts}'],
  //     migrationsTableName: 'migration',
  //     migrationsRun: false,
  //     seeds: ['dist/src/database/seeds/**/*.seed{.js,.ts}'],
  //     cli: {
  //       migrationsDir: 'src/migration'
  //     },
  //     logging: this.getEnv('LOGGING', false)
  //   };
  // }

  public getMinIOConfig() {
    return {
      STORAGE_LOCAL_ENDPOINT: this.getEnv('STORAGE_LOCAL_ENDPOINT'),
      MINIO_UPLOAD_LOCAL_PORT: this.getEnv('MINIO_UPLOAD_LOCAL_PORT'),
      USE_SSL: this.getEnv('USE_SSL'),
      STORAGE_ENDPOINT: this.getEnv('STORAGE_ENDPOINT'),
      MINIO_UPLOAD_PORT: this.getEnv('MINIO_UPLOAD_PORT'),
      MINIO_UPLOAD_ACCESS_KEY: this.getEnv('MINIO_UPLOAD_ACCESS_KEY'),
      MINIO_UPLOAD_SECRET_KEY: this.getEnv('MINIO_UPLOAD_SECRET_KEY'),
      MINIO_UPLOAD_BUCKET_NAME: this.getEnv('MINIO_UPLOAD_BUCKET_NAME')
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  // 'DB_HOST',
  // 'DB_PORT',
  // 'DB_USERNAME',
  // 'DB_PASSWORD',
  // 'DB_DATABASE',
  'MONGO_URI',
  'REDIS_URL',
  'REDIS_HOST',
  'REDIS_PORT',
  'JWT_SECRET'
]);

export { configService };
