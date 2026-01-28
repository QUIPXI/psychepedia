const fs = require('fs');
const path = require('path');

const AR_PATH = 'E:\\opencode\\project1\\psychepedia\\content\\articles\\ar\\foundations.json';
const EN_PATH = 'E:\\opencode\\project1\\psychepedia\\content\\articles\\en\\foundations.json';

function forceSyncDifficulty() {
  try {
    const arData = JSON.parse(fs.readFileSync(AR_PATH, 'utf8'));
    const enData = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));

    let arChanged = false;
    let enChanged = false;

    // Helper to get nested article objects
    const getArArticle = (key) => arData.foundations ? arData.foundations[key] : null;
    const getEnArticle = (key) => enData[key];

    const articleKeys = ['history-and-systems', 'research-methods', 'ethics'];

    articleKeys.forEach(key => {
      const arArt = getArArticle(key);
      const enArt = getEnArticle(key);

      if (arArt && enArt) {
        console.log(`Checking ${key}: AR=${arArt.difficulty}, EN=${enArt.difficulty}`);

        if (enArt.difficulty && !arArt.difficulty) {
          console.log(` -> Copying '${enArt.difficulty}' to AR ${key}`);
          arArt.difficulty = enArt.difficulty;
          arChanged = true;
        } else if (!enArt.difficulty && arArt.difficulty) {
          console.log(` -> Copying '${arArt.difficulty}' to EN ${key}`);
          enArt.difficulty = arArt.difficulty;
          enChanged = true;
        }
        
        // Ensure consistency if both exist but differ (trust EN or AR? Let's trust existing non-null)
        // If different, we might want to standardize. Assuming they should match.
        if (enArt.difficulty && arArt.difficulty && enArt.difficulty !== arArt.difficulty) {
             console.log(` -> Mismatch! AR=${arArt.difficulty}, EN=${enArt.difficulty}. Syncing AR to EN.`);
             arArt.difficulty = enArt.difficulty;
             arChanged = true;
        }
      }
    });

    if (arChanged) {
      fs.writeFileSync(AR_PATH, JSON.stringify(arData, null, 2), 'utf8');
      console.log('Updated AR file.');
    }
    if (enChanged) {
      fs.writeFileSync(EN_PATH, JSON.stringify(enData, null, 2), 'utf8');
      console.log('Updated EN file.');
    }

  } catch (e) {
    console.error('Error:', e);
  }
}

forceSyncDifficulty();
