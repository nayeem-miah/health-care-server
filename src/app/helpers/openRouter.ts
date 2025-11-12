import OpenAI from 'openai';
import config from '../../config';

// step 1-->> copy form openRouter doc
export const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: config.openRouterApiKey,
});
