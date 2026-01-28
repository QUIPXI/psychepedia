const fs = require('fs');
const AR_PATH = 'E:\\opencode\\project1\\psychepedia\\content\\articles\\ar\\foundations.json';
const EN_PATH = 'E:\\opencode\\project1\\psychepedia\\content\\articles\\en\\foundations.json';

const arData = JSON.parse(fs.readFileSync(AR_PATH, 'utf8'));
const enData = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));

console.log('AR Keys:', Object.keys(arData));
if (arData.foundations) {
  console.log('AR.foundations Keys:', Object.keys(arData.foundations));
  console.log('AR research-methods difficulty:', arData.foundations['research-methods']?.difficulty);
}

console.log('EN Keys:', Object.keys(enData));
console.log('EN research-methods difficulty:', enData['research-methods']?.difficulty);
