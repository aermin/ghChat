import configs from '@configs';
import * as jwt from 'jsonwebtoken';
import * as request from 'request-promise';
import { ServicesContext } from '../context';

async function getAccessToken(ctx) {
  try {
    const { code, clientId } = ctx.request.body;
    const date = {
      code,
      client_secret: configs.client_secret,
      client_id: clientId,
    };
    const options = {
      method: 'POST',
      uri: 'https://github.com/login/oauth/access_token',
      body: date,
      json: true, // Automatically stringifies the body to JSON
    };
    const response = await request(options);
    return response.access_token;
  } catch (error) {
    throw new Error(error);
  }
}

export const githubOAuthController = async (ctx, next) => {
  const { userService } = ServicesContext.getInstance();

  try {
    const accessToken = await getAccessToken(ctx);
    const options = {
      uri: 'https://api.github.com/user',
      qs: {
        access_token: accessToken, // -> uri + '?access_token=xxxxx%20xxxxx'
      },
      headers: {
        'User-Agent': 'Request-Promise',
      },
      json: true,
    };
    const response = await request(options);
    const { avatar_url, html_url, bio, login, location, id, blog, company } = response;
    const payload = { id };
    const token = jwt.sign(payload, configs.jwt_secret, {
      expiresIn: Math.floor(Date.now() / 1000) + 24 * 60 * 60 * 7, // 一周
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
      company,
      user_id: null,
    };
    const RowDataPacket = await userService.findGithubUser(id); // judge if this github account exist
    let githubUser = JSON.parse(JSON.stringify(RowDataPacket));
    if (githubUser.length > 0) {
      await userService.updateGithubUser(data);
    } else {
      await userService.insertGithubData(data);
      const RowDataPacket = await userService.findGithubUser(id);
      githubUser = JSON.parse(JSON.stringify(RowDataPacket));
    }
    data.user_id = githubUser[0].id;
    console.log('github res && ctx.body', response, data);
    ctx.body = data;
  } catch (error) {
    throw new Error(error);
  }
};
