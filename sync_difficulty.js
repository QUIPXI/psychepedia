const fs = require('fs');
const path = require('path');

const BASE_DIR = 'E:\\opencode\\project1\\psychepedia\\content\\articles';
const CATEGORIES = [
  'applied',
  'biological',
  'clinical',
  'cognitive',
  'developmental',
  'foundations',
  'new-and-now',
  'social-personality'
];

function syncDifficulty() {
  CATEGORIES.forEach(category => {
    const enFilePath = path.join(BASE_DIR, 'en', `${category}.json`);
    const arFilePath = path.join(BASE_DIR, 'ar', `${category}.json`);

    try {
      if (!fs.existsSync(enFilePath) || !fs.existsSync(arFilePath)) {
        console.log(`Skipping ${category}: One or both files missing.`);
        return;
      }

      const enData = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
      const arData = JSON.parse(fs.readFileSync(arFilePath, 'utf8'));

      // The structure is { "categoryName": { "articleId": { ... } } }
      // But based on previous output, the root key usually matches the category name, EXCEPT maybe strictly.
      // Let's look at the structure from previous reads.
      // en/cognitive.json -> { "cognitive": { "cognitive-psychology": ... } }
      // ar/applied.json -> { "applied": { "forensic-psychology": ... } }
      
      // We assume the root key is the category name. 
      // However, sometimes file name matches root key, sometimes it might be slightly different?
      // Let's rely on Object.keys(data)[0] to get the main container key.
      
      const enRootKey = Object.keys(enData)[0];
      const arRootKey = Object.keys(arData)[0];

      if (!enRootKey || !arRootKey) {
        console.log(`Skipping ${category}: Root key missing.`);
        return;
      }

      const enArticles = enData[enRootKey];
      const arArticles = arData[arRootKey];

      let enChanged = false;
      let arChanged = false;

      // Get all unique article IDs from both
      const allArticleIds = new Set([
        ...Object.keys(enArticles),
        ...Object.keys(arArticles)
      ]);

      allArticleIds.forEach(articleId => {
        const enArticle = enArticles[articleId];
        const arArticle = arArticles[articleId];

        // Ensure both exist (if one is missing entirely, we can't sync difficulty to it strictly speaking without creating the article, 
        // but the user said "make the articles that have the difficulity have it in both languages", implies the article exists in both).
        
        if (enArticle && arArticle) {
          const enDiff = enArticle.difficulty;
          const arDiff = arArticle.difficulty;

          if (enDiff && !arDiff) {
            console.log(`[${category}/${articleId}] Copying difficulty '${enDiff}' from EN to AR`);
            arArticle.difficulty = enDiff;
            arChanged = true;
          } else if (!enDiff && arDiff) {
            console.log(`[${category}/${articleId}] Copying difficulty '${arDiff}' from AR to EN`);
            enArticle.difficulty = arDiff;
            enChanged = true;
          }
        }
      });

      if (enChanged) {
        fs.writeFileSync(enFilePath, JSON.stringify(enData, null, 2), 'utf8');
        console.log(`Saved updates to ${enFilePath}`);
      }
      if (arChanged) {
        fs.writeFileSync(arFilePath, JSON.stringify(arData, null, 2), 'utf8');
        console.log(`Saved updates to ${arFilePath}`);
      }

    } catch (err) {
      console.error(`Error processing ${category}:`, err.message);
    }
  });
}

syncDifficulty();
