const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; // I need to get it from .env
console.log('Fetching OpenRouter models...');
fetch('https://openrouter.ai/api/v1/models')
  .then(r => r.json())
  .then(data => {
      const freeModels = data.data.filter(m => m.id.includes('free') && m.id.includes('gemini'));
      console.log('Available Gemini Free Models:');
      console.log(freeModels.map(m => m.id).join('\n'));
  })
  .catch(console.error);
