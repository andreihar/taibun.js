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


class Converter {
	static suffix_token = '[ЅFFX_ТКŊ]';
	static tt = '[ТŊ_ТКŊ]';
	static DEFAULT_DELIMITER = {};
	static DEFAULT_SANDHI = {};
	static __suffixes = ['啊', '矣', '喂', '欸', '唅', '嘿', '諾', '乎', '唷', '喔', '嘖', '的'];
	static __no_sandhi = ['這', '彼', '遮', '遐'];
	static __location = ['頂', '跤', '外', '內'];

	constructor(system = 'Tailo', dialect = 'south', format = 'mark', delimiter = Converter.DEFAULT_DELIMITER, sandhi = Converter.DEFAULT_SANDHI, punctuation = 'format', convert_non_cjk = false) {
		this.system = system.toLowerCase();
		this.dialect = dialect.toLowerCase();
		this.format = format;
		this.delimiter = delimiter;
		this.sandhi = sandhi;
		this.punctuation = punctuation;
		this.convert_non_cjk = convert_non_cjk;
	}


	////// Interface functions

	// Convert tokenised text into specified transliteration system
	get(input) {
		return "";
	}


	////// Input formatting

	// Helper to convert separate words
	convertTokenised(word) {
		return "";
	}


	// Helper switch for converting 漢字 based on defined transliteration system
	systemConversion(word) {
		return "";
	}


	// Helper functions to set delimiter according to transliteration system if wasn't explicitly defined by user
	setDefaultDelimiter() {
		return "";
	}


	// Helper functions to set sandhi according to transliteration system if wasn't explicitly defined by user
	setDefaultSandhi() {
		return "";
	}


	////// Conversion functions

	// Helper to get number tones
	getNumberTones(input) {
		return "";
	}


	// Helper to convert between transliteration systems
	replacementTool(dictionary, input) {
		return "";
	}


	// Helper to convert word from Tai-lo to number
	markToNumber(input) {
		return "";
	}


	// Helper to convert syllable from Tai-lo diacritic tones to number tones
	getNumberTone(input) {
		return "";
	}


	// Helper to break down a word into syllables for conversion
	preprocessWord(word) {
		return "";
	}


	// Helper to convert syllable from Tai-lo number tones to diacritic tones
	getMarkTone(input, placement, tones) {
		return "";
	}


	// Helper to apply tone sandhi to a word
	toneSandhi(word, last) {
		return "";
	}


	// Helpre to define which words should be sandhi'd fully
	toneSandhiPosition(input) {
		return "";
	}


	////// Tai-lo to other transliteration systems converting

	// Helper to convert syllable from Tai-lo to Tai-lo
	// (called only in cases when tone sandhi is applied)
	tailoToTailo(input) {
		return "";
	}


	// Helper to convert syllable from Tai-lo to POJ
	tailoToPoj(input) {
		return "";
	}


	// Helper to convert syllable from Tai-lo to 方音符號 (zhuyin)
	tailoToZhuyin(input) {
		return "";
	}


	// Helper to convert syllable from Tai-lo to TLPA
	tailoToTlpa(input) {
		return "";
	}


	// Helper to convert syllable from Tai-lo to Bbanlam pingyim
	tailoToBbanlam(input) {
		return "";
	}


	// Helper to convert syllable from Tai-lo to Tong-iong ping-im
	tailoToTi(input) {
		return "";
	}


	// Helper to convert syllable from Tai-lo to International Phonetic Alphabet
	tailoToIpa(input) {
		return "";
	}


	////// Converted output formatting

	// Helper to convert Chinese punctuation to Latin punctuation with appropriate spacing
	formatPunctuationWestern(input) {
		return "";
	}


	// Helper to restore original CJK punctuation with appropriate spacing
	formatPunctuationCJK(input) {
		return "";
	}


	// Helper to capitalise text in according to punctuation
	formatText(input) {
		return "";
	}
}


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
		const punctuations = /([.,!?\"#$%&()*+/:;<=>@[\\\]^`{|}~\t。．，、！？；：（）［］【】「」“”])/;
		const indices = [0].concat(tokenised.map(item => item.length));
		tokenised = indices.slice(0, -1).map((_, i) => input.substring(indices.slice(0, i + 1).reduce((a, b) => a + b, 0), indices.slice(0, i + 1).reduce((a, b) => a + b, 0) + indices[i + 1]));
		tokenised = tokenised.flatMap(word => word.split(punctuations).flatMap(subword => subword ? subword.split(" ").filter(Boolean) : []));
		return tokenised.flatMap(word => (word.endsWith('的') || word.endsWith('矣')) && word.length > 1 ? [word.slice(0, -1), word.slice(-1)] : [word]);
	}
}

module.exports = {
	Tokeniser,
	isCjk,
	toTraditional,
	toSimplified
};