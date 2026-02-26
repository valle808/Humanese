import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./assets/JSON/questions-es.json');

try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let updatedCount = 0;

    data.challenges.forEach(challenge => {
        if (challenge.options) {
            challenge.options.forEach(option => {
                if (!option.tts || option.tts === "") {
                    // Generate Google Translate TTS URL
                    option.tts = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=es&q=${encodeURIComponent(option.text)}`;
                    updatedCount++;
                }
            });
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    console.log(`Successfully updated ${updatedCount} option TTS URLs in questions-es.json.`);
} catch (error) {
    console.error('Error updating JSON:', error);
}
