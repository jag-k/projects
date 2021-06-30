import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import axios from 'axios';
import express from 'express';
import open from 'open';

import constants from './constants.js';
import { __dirname } from './constants.js';
import readline from 'readline';

String.prototype.templateString = function (params) {
  return new Function(...Object.keys(params), `return \`${this}\`;`)(...Object.values(params))
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

export function readJSON(path, defaultValue = {}) {
  try {
    return JSON.parse(readFileSync(path, { encoding: 'utf8' }));
  } catch (e) {
    return defaultValue;
  }
}

export function writeJSON(path, obj) {
  return writeFileSync(path, JSON.stringify(obj), { encoding: 'utf8' });
}

export function dataToFormUrlencoded(element, key, list) {
  var list = list || [];
  if (typeof (element) == 'object') {
    for (var idx in element)
      dataToFormUrlencoded(element[idx], key ? key + '[' + idx + ']' : idx, list);
  } else {
    list.push(key + '=' + element);
  }
  return list.join('&');
}

export async function getApi() {
  let cred = await credential.get();
  let token = cred.token

  if (token.due_date <= Date.now()) {
    cred = await cred.updateExpiredToken();
  }
  return axios.create({
    baseURL: constants.HH_API_URL,
    headers: {
      'User-Agent': constants.USER_AGENT,
      'Authorization': `${token.token_type.capitalize()} ${token.access_token.trim()}`
    }
  });
}

export const credential = {
  _data: null,

  async _getTokenData(data) {
    return (await axios.post('https://hh.ru/oauth/token', dataToFormUrlencoded(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': USER_AGENT,
      }
    })).data
  },

  async updateExpiredToken() {
    this._data = await _getTokenData({
      grant_type: "refresh_token",
      refresh_token: this._data.token.refresh_token,
    })
    return this
  },

  async get() {
    if (constants.GITHUB_ACTIONS) return this._data = JSON.parse(process.env.CREDENTIAL);

    const cred = this._data ? this._data : readJSON(constants.CREDENTIAL_PATH);
    this._data = cred;
    const that = this;
    if (!cred.token) {
      let promise = new Promise((resolve, reject) => {
        let result;
        const app = express();
        app.get('/oauth', async function (req, res) {
          let code = req.query.code;

          result = await that._getTokenData({
            grant_type: "authorization_code",
            client_id: constants.CLIENT_ID,
            client_secret: constants.CLIENT_SECRET,
            redirect_uri: constants.REDIRECT_URI,
            code,
          })

          // language=HTML
          res.end(readFileSync(join(__dirname, "hh_done.html"), { encoding: 'utf8' }).templateString({
            code: JSON.stringify(result),
            ...constants,
          }));
          console.log("Credentials saved successfully!");

          if (result.access_token) {
            result.due_date = Date.now() + result.expires_in * 1000;
          } else {
            result = that._data.token;
          }

          try {
            return resolve(result);
          } finally {
            server.close();
          }
        });

        let server;
        const rl = readline.createInterface(process.stdin, process.stdout);
        rl.question("Press ENTER to open hh.ru auth in browser. ", () => {
          server = app.listen(constants.PORT);
          open(`https://hh.ru/oauth/authorize?response_type=code&client_id=${constants.CLIENT_ID}&redirect_uri=${constants.REDIRECT_URI}`);
          rl.close();
        });
        process.stdin.resume();
      })

      this._data.token = await promise;
      this.save();
      return this;
    }
    return this
  },
  save() {
    if (constants.GITHUB_ACTIONS) return;// TODO CREATE THIS LOGIC
    writeJSON(constants.CREDENTIAL_PATH, this._data);
  },

  get token() {
    return this._data.token
  },

  get resume_id() {
    return this._data.resume_id
  }
}

const packageJson = readJSON('package.json');
const USER_AGENT = process.env.HH_USER_AGENT || `${packageJson.name}/${packageJson.version} (${packageJson.author.email})`;
