// Test case for bold text highlighting fix

// Simulate the original text with ** markers
const originalText = "This is **cognitive bias** and it affects decision making.";

// Simulate what happens when user selects bold text
const selectedText = "**cognitive bias**";
const cleanText = selectedText.replace(/\*\*/g, '').trim();
console.log("Selected text:", selectedText);
console.log("Clean text:", cleanText);

// Simulate the matching logic
const plainText = originalText.replace(/\*\*/g, '');
console.log("Plain text:", plainText);

// Create regex for matching
const escapedText = cleanText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const regex = new RegExp(escapedText, 'gi');
const match = regex.exec(plainText);

if (match) {
  console.log("Match found at position:", match.index);
  console.log("Matched text:", match[0]);
  
  // This should work correctly now
  const matchedText = plainText.slice(match.index, match.index + match[0].length);
  console.log("Extracted highlight text:", matchedText);
  
  // Verify it matches the clean text
  if (matchedText.toLowerCase() === cleanText.toLowerCase()) {
    console.log("✅ SUCCESS: Highlight text matches correctly!");
  } else {
    console.log("❌ FAIL: Highlight text doesn't match");
  }
} else {
  console.log("❌ FAIL: No match found");
}