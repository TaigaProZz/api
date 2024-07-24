export default () => ({
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  adminjsCookiePassword: process.env.ADMINJS_COOKIE_PASSWORD,
  adminJsSessionSecret: process.env.ADMINJS_SESSION_SECRET,
});