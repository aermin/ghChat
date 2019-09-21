export const environment = {
  production: true,
  dbConnection: secrets.db,
  baseApi: 'api/v1',
  secret: (secrets && secrets.secretValue)
};
