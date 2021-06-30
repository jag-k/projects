import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
export const __dirname = dirname(fileURLToPath(import.meta.url))

dotenv.config({
  path: join(__dirname, '../.env'),
  encoding: 'utf8',
})