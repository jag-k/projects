import { join } from 'path';
import { __dirname as dirname } from '../environment.js';

export const CLIENT_ID = process.env.CLIENT_ID || "KDB6Q09U4EKMFOQQCQ0P4H00JG9TBJILK0NLHJ3FOF2P928A5PKBUFPPMRNGNEG0";
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
if (!CLIENT_SECRET || !CLIENT_ID) {
  throw new Error("CLIENT_ID and CLIENT_SECRET required");
}

export const __dirname = join(dirname, "hh_ru")
export const CREDENTIAL_PATH = process.env.CREDENTIAL_PATH || join(__dirname, 'hh_ru.secret.json');
export const HH_API_URL = process.env.HH_API_URL || "https://api.hh.ru/";
export const PORT = 6483;
export const REDIRECT_URI = encodeURIComponent(`http://localhost:${PORT}/oauth`);
export const GITHUB_ACTIONS = process.env.GITHUB_ACTIONS === "true";

const secret_href = GITHUB_ACTIONS ? `https://github.com/${process.env.GITHUB_REPOSITORY}/settings/secrets/actions` : "https://docs.github.com/en/actions/reference/encrypted-secrets";

export default {
  CREDENTIAL_PATH,
  HH_API_URL,
  PORT,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  secret_href,
  GITHUB_ACTIONS,
  __dirname
}