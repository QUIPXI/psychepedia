const fs = require('fs');
const path = require('path');

const AR_PATH = 'E:\\opencode\\project1\\psychepedia\\content\\articles\\ar\\foundations.json';
const EN_PATH = 'E:\\opencode\\project1\\psychepedia\\content\\articles\\en\\foundations.json';

function addEthicsDifficulty() {
  try {
    const arData = JSON.parse(fs.readFileSync(AR_PATH, 'utf8'));
    const enData = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));

    // Fix Ethics
    if (arData.foundations && arData.foundations.ethics) {
      console.log('Adding difficulty to AR ethics');
      arData.foundations.ethics.difficulty = 'intermediate';
    }
    
    if (enData.ethics) {
      console.log('Adding difficulty to EN ethics');
      enData.ethics.difficulty = 'intermediate';
    }

    fs.writeFileSync(AR_PATH, JSON.stringify(arData, null, 2), 'utf8');
    fs.writeFileSync(EN_PATH, JSON.stringify(enData, null, 2), 'utf8');
    console.log('Updated ethics difficulty.');

  } catch (e) {
    console.error(e);
  }
}

addEthicsDifficulty();
