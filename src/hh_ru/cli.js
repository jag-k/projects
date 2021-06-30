import { getResumeId } from './index.js';
import { getApi } from './helpers.js';

const main = async () => {
  const api = await getApi();
  const resume = await getResumeId(api);
  console.log('Resume ID:', resume)
}

await main().catch(console.error)
