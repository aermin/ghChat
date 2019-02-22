module.exports = {
  apps: [
    {
      name: 'airChat',
      script: './index.js',
      watch: true,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
