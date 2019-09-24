module.exports = {
  apps: [
    {
      name: 'ghchat',
      script: './dist/index.js',
      watch: true,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
