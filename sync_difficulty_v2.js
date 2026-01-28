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

function isArticle(obj) {
  return obj && typeof obj === 'object' && (obj.title || obj.sections || obj.fullSections);
}

function getArticlesMap(data) {
  const keys = Object.keys(data);
  if (keys.length === 0) return data;

  // Case 1: Root is the map (flat structure)
  // Check if the first key points to an article-like object
  if (isArticle(data[keys[0]])) {
    return data;
  }

  // Case 2: Root contains a wrapper (nested structure)
  // Check if the first key's value contains articles
  const container = data[keys[0]];
  if (container && typeof container === 'object') {
    const subKeys = Object.keys(container);
    if (subKeys.length > 0 && isArticle(container[subKeys[0]])) {
      return container;
    }
  }

  return data;
}

function syncDifficulty() {
  CATEGORIES.forEach(category => {
    const enFilePath = path.join(BASE_DIR, 'en', `${category}.json`);
    const arFilePath = path.join(BASE_DIR, 'ar', `${category}.json`);

    try {
      if (!fs.existsSync(enFilePath) || !fs.existsSync(arFilePath)) {
        return;
      }

      const enData = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
      const arData = JSON.parse(fs.readFileSync(arFilePath, 'utf8'));

      const enArticles = getArticlesMap(enData);
      const arArticles = getArticlesMap(arData);

      let enChanged = false;
      let arChanged = false;

      const allIds = new Set([...Object.keys(enArticles), ...Object.keys(arArticles)]);

      allIds.forEach(id => {
        const enArt = enArticles[id];
        const arArt = arArticles[id];

        if (enArt && arArt) {
           const enDiff = enArt.difficulty;
           const arDiff = arArt.difficulty;

           if (enDiff && !arDiff) {
             console.log(`[${category}/${id}] Syncing Difficulty: EN ('${enDiff}') -> AR`);
             arArt.difficulty = enDiff;
             arChanged = true;
           } else if (!enDiff && arDiff) {
             console.log(`[${category}/${id}] Syncing Difficulty: AR ('${arDiff}') -> EN`);
             enArt.difficulty = arDiff;
             enChanged = true;
           }
        }
      });

      if (enChanged) {
        fs.writeFileSync(enFilePath, JSON.stringify(enData, null, 2), 'utf8');
        console.log(`Updated ${enFilePath}`);
      }
      if (arChanged) {
        fs.writeFileSync(arFilePath, JSON.stringify(arData, null, 2), 'utf8');
        console.log(`Updated ${arFilePath}`);
      }

    } catch (err) {
      console.error(`Error in ${category}:`, err.message);
    }
  });
}

syncDifficulty();
