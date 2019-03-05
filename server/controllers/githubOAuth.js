const request = require('request-promise');
const jwt = require('jsonwebtoken');
const secret = require('../../secret');
const config = require('../config');
const userModel = require('../models/userInfo');

async function getAccessToken(ctx) {
  try {
    const { code, clientId } = ctx.request.body;
    const date = {
      code,
      client_secret: secret.client_secret,
      client_id: clientId
    };
    console.log('oauth body', date);
    const options = {
      method: 'POST',
      uri: 'https://github.com/login/oauth/access_token',
      body: date,
      json: true // Automatically stringifies the body to JSON
    };
    const response = await request(options);
    return response.access_token;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = async (ctx, next) => {
  try {
    const accessToken = await getAccessToken(ctx);
    const options = {
      uri: 'https://api.github.com/user',
      qs: {
        access_token: accessToken // -> uri + '?access_token=xxxxx%20xxxxx'
      },
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    };
    const response = await request(options);
    const {
      avatar_url, html_url, bio, login, location, id, blog
    } = response;
    const payload = { id };
    const token = jwt.sign(payload, config.secret, {
      expiresIn: Math.floor(Date.now() / 1000) + 24 * 60 * 60 * 7 // 一周
    });
    const data = {
      avatar: avatar_url,
      github: html_url,
      intro: bio,
      name: login,
      location,
      token,
      github_id: id,
      website: blog,
    };
    const RowDataPacket = await userModel.findGithubUser(id); // judge if this github account exist
    let githubUser = JSON.parse(JSON.stringify(RowDataPacket));
    console.log('githubUser', githubUser);
    if (githubUser.length > 0) {
      await userModel.updateGithubUser(data);
    } else {
      await userModel.insertGithubData(data);
      const RowDataPacket = await userModel.findGithubUser(id);
      githubUser = JSON.parse(JSON.stringify(RowDataPacket));
    }
    data.user_id = githubUser[0].id;
    console.log('oauth 2333 res', data);
    ctx.body = data;
  } catch (error) {
    throw new Error(error);
  }
};
