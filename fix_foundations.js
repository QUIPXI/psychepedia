const fs = require('fs');
const path = require('path');

const AR_PATH = 'E:\\opencode\\project1\\psychepedia\\content\\articles\\ar\\foundations.json';
const EN_PATH = 'E:\\opencode\\project1\\psychepedia\\content\\articles\\en\\foundations.json';

function fixFoundations() {
  try {
    const arData = JSON.parse(fs.readFileSync(AR_PATH, 'utf8'));
    const enData = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));

    // Structure is slightly different or the previous script missed it
    // Check 'foundations' -> 'history-and-systems' and 'research-methods'

    // history-and-systems
    const arHist = arData?.foundations?.['history-and-systems'];
    const enHist = enData?.['history-and-systems'];

    let changed = false;

    if (arHist && enHist) {
      if (enHist.difficulty && !arHist.difficulty) {
        console.log(`Copying difficulty '${enHist.difficulty}' to AR history-and-systems`);
        arHist.difficulty = enHist.difficulty;
        changed = true;
      }
    }

    // research-methods
    const arRes = arData?.foundations?.['research-methods'];
    const enRes = enData?.['research-methods'];

    if (arRes && enRes) {
      if (enRes.difficulty && !arRes.difficulty) {
        console.log(`Copying difficulty '${enRes.difficulty}' to AR research-methods`);
        arRes.difficulty = enRes.difficulty;
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(AR_PATH, JSON.stringify(arData, null, 2), 'utf8');
      console.log('Successfully updated Arabic foundations file.');
    } else {
      console.log('No changes needed or structure mismatch.');
    }

  } catch (e) {
    console.error('Error:', e);
  }
}

fixFoundations();
