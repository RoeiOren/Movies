import env from 'env-var';

const config = {
  server: {
    port: env.get('PORT').required().asPortNumber(),
    https_port: env.get('HTTPS_PORT').required().asPortNumber(),
  },
  mongo: {
    url: env.get('MONGO_URL').required().asString(),
    usersCollectionName: env.get('MONGO_USERS_COLLECTION_NAME').required().asString(),
    postsCollectionName: env.get('MONGO_POSTS_COLLECTION_NAME').required().asString(),
    commentsCollectionName: env.get('MONGO_COMMENTS_COLLECTION_NAME').required().asString(),
  },
  jwt: {
    secret: env.get('JWT_SECRET').required().asString(),
    refreshSecret: env.get('JWT_REFRESH_SECRET').required().asString(),
    expiration: env.get('JWT_EXPIRATION').required().asString(),
  },
  googleClientId: env.get('GOOGLE_CLIENT_ID').required().asString(),
  imdbURL: env.get('IMDB_URL').required().asString(),
};

export default config;
