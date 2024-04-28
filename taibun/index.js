const fs = require('fs');
const path = require('path');

const wordDict = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/words.json'), 'utf8'));
const tradDict = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/simplified.json'), 'utf8'));
const simplifiedDict = Object.entries(tradDict).reduce((acc, [k, v]) => ({ ...acc, [v]: k }), { '臺': '台' });

// Helper to check if the character is a Chinese character
function isCjk(input) {
	return [...input].every(char => {
		const code = char.charCodeAt(0);
		return (
			(0x4E00 <= code && code <= 0x9FFF) ||  // BASIC
			(0x3400 <= code && code <= 0x4DBF) ||  // Ext A
			(0x20000 <= code && code <= 0x2A6DF) ||  // Ext B
			(0x2A700 <= code && code <= 0x2EBEF) ||  // Ext C,D,E,F
			(0x30000 <= code && code <= 0x323AF) ||  // Ext G,H
			(0x2EBF0 <= code && code <= 0x2EE5F)  // Ext I
		);
	});
}

// Convert Simplified to Traditional characters
function toTraditional(input) {
	return [...input].map(c => tradDict[c] || c).join('');
}

// Convert Traditional to Simplified characters
function toSimplified(input) {
	return [...input].map(c => simplifiedDict[c] || c).join('');
}


// const re = require('re');
class Tokeniser {
	constructor() { }

	// Tokenise the text into separate words
	tokenise(input) {
		let tokenised = [];
		let traditional = toTraditional(input);
		while (traditional) {
			for (let j = 4; j > 0; j--) {
				if (traditional.length < j) {
					continue;
				}
				let word = traditional.slice(0, j);
				if (wordDict[word] || j === 1) {
					if (j === 1 && tokenised.length && !(isCjk(tokenised[tokenised.length - 1]) || isCjk(word))) {
						tokenised[tokenised.length - 1] += word;
					} else {
						tokenised.push(word);
					}
					traditional = traditional.slice(j);
					break;
				}
			}
			if (traditional.length === 0) {
				traditional = "";
			}
		}
		return tokenised;
	}
}

module.exports = {
	Tokeniser,
	isCjk,
	toTraditional,
	toSimplified
};