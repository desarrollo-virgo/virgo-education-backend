export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    connectionString: process.env.CONNECTION_STRING,
  },
  base_url_store: process.env.BASE_URL_STORE,
  azureConnection: process.env.AZURE_CONNECTION,
});
