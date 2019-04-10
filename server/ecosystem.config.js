module.exports = {
  apps: [
    {
      name: 'ghchat',
      script: './index.js',
      watch: true,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
