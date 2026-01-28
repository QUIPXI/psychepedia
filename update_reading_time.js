const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = 'E:\\opencode\\project1\\psychepedia\\content\\articles';

function getAllJsonFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllJsonFiles(filePath, fileList);
    } else if (path.extname(file) === '.json') {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function countWords(text) {
  if (!text) return 0;
  // Remove markdown formatting characters (optional but good for accuracy)
  const cleanText = text.replace(/[*_#\[\]()]/g, ' ');
  // Split by whitespace
  return cleanText.trim().split(/\s+/).length;
}

function processObject(obj, articleId) {
  if (!obj || typeof obj !== 'object') return false;

  // Check if it's an article
  if (obj.fullSections || obj.sections) {
    let contentText = '';
    const sectionsSource = obj.fullSections || obj.sections;
    
    if (Array.isArray(sectionsSource)) {
      contentText = sectionsSource.map(section => section.content || '').join(' ');
    }

    const wordCount = countWords(contentText);
    const readingTime = Math.ceil(wordCount / 200);

    console.log(`  Article: ${articleId}, Existing: ${obj.readingTime}, Calculated: ${readingTime} (${wordCount} words)`);

    if (readingTime > 0 && obj.readingTime !== readingTime) {
      console.log(`  Updating ${articleId}: ${obj.readingTime} -> ${readingTime} mins`);
      obj.readingTime = readingTime;
      return true; // Changed
    }
    return false; // Not changed
  }

  // If not an article, recurse into children
  let anyChanged = false;
  Object.keys(obj).forEach(key => {
    if (processObject(obj[key], key)) {
      anyChanged = true;
    }
  });
  return anyChanged;
}

function updateReadingTime() {
  const files = getAllJsonFiles(ARTICLES_DIR);
  
  files.forEach(filePath => {
    console.log(`Processing ${filePath}...`);
    try {
      const rawData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(rawData);
      
      const changed = processObject(data, 'root');

      if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`  Saved updates to ${filePath}`);
      }
    } catch (err) {
      console.error(`Error processing ${filePath}:`, err.message);
    }
  });
}

updateReadingTime();
