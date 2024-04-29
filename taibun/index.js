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
	static suffixToken = '[ЅFFX_ТКŊ]';
	static tt = '[ТŊ_ТКŊ]';
	static defaultDelimiter = {};
	static defaultSandhi = {};
	static suffixes = ['啊', '矣', '喂', '欸', '唅', '嘿', '諾', '乎', '唷', '喔', '嘖', '的'];
	static noSandhi = ['這', '彼', '遮', '遐'];
	static location = ['頂', '跤', '外', '內'];

	constructor({ system = 'Tailo', dialect = 'south', format = 'mark', delimiter = Converter.defaultDelimiter, sandhi = Converter.defaultSandhi, punctuation = 'format', convertNonCjk = false } = {}) {
		this.system = system.toLowerCase();
		this.dialect = dialect.toLowerCase();
		this.format = format;
		this.delimiter = delimiter !== Converter.defaultDelimiter ? delimiter : this.setDefaultDelimiter();
		this.sandhi = sandhi !== Converter.defaultSandhi ? sandhi : this.setDefaultSandhi();
		this.punctuation = punctuation;
		this.convertNonCjk = convertNonCjk;
	}


	////// Interface functions

	// Convert tokenised text into specified transliteration system
	get(input) {
		let converted = new (require('./index.js').Tokeniser)().tokenise(toTraditional(input));
		converted = this.toneSandhiPosition(converted).map(i => this.convertTokenised(i).trim()).join(' ').trim();
		return converted;
	}


	////// Input formatting

	// Helper to convert separate words
	convertTokenised(word) {
		if (word[0] in wordDict) {
			word = [wordDict[word[0]], ...word.slice(1)];
			if (word[0].includes("/")) {
				let dialectPart = this.dialect === 'north' ? word[0].split("/")[1] : word[0].split("/")[0];
				word = [dialectPart, ...word.slice(1)];
			}
		} else if (!this.convertNonCjk) {
			return word[0];
		}
		word = this.systemConversion(word).replace('---', '--');
		if (this.format === 'number' && ['tailo', 'poj'].includes(this.system)) {
			word = this.markToNumber(word);
		}
		if (this.format === 'strip') {
			if (this.system === 'tlpa') {
				word = word.replace(/[1234578]/g, '');
			}
			if (this.system === 'zhuyin') {
				word = word.replace(/[ˋ˪ˊ˫˙]/g, '');
			}
			if (this.system === 'ipa') {
				word = word.replace(/[¹²³⁴⁵]/g, '');
			} else {
				word = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
			}
		}
		return word.replace('--', this.suffixToken).replace('-', this.delimiter).replace(this.suffixToken, '--');
	}


	// Helper switch for converting 漢字 based on defined transliteration system
	systemConversion(word) {
		if (this.system === 'poj') return this.tailoToPoj(word);
		if (this.system === 'zhuyin') return this.tailoToZhuyin(word);
		if (this.system === 'tlpa') return this.tailoToTlpa(word);
		if (this.system === 'pingyim') return this.tailoToPingyim(word);
		if (this.system === 'tongiong') return this.tailoToTi(word);
		if (this.system === 'ipa') return this.tailoToIpa(word);
		if (['auto', 'exc_last', 'incl_last'].includes(this.sandhi)) return this.tailoToTailo(word);
		else return word[0];
	}


	// Helper functions to set delimiter according to transliteration system if wasn't explicitly defined by user
	setDefaultDelimiter() {
		if (this.system === 'tlpa' || this.system === 'zhuyin' || this.system === 'ipa') {
			return ' ';
		}
		if (this.system === 'pingyim') {
			return '';
		}
		return '-';
	}


	// Helper functions to set sandhi according to transliteration system if wasn't explicitly defined by user
	setDefaultSandhi() {
		if (this.system === 'tongiong') {
			return 'auto';
		}
		return 'none';
	}


	////// Conversion functions

	// Helper to get number tones
	getNumberTones(input) {
		return input;
	}


	// Helper to convert between transliteration systems
	replacementTool(dictionary, input) {
		return input;
	}


	// Helper to convert word from Tai-lo to number
	markToNumber(input) {
		return input;
	}


	// Helper to convert syllable from Tai-lo diacritic tones to number tones
	getNumberTone(input) {
		return input;
	}


	// Helper to break down a word into syllables for conversion
	preprocessWord(word) {
		return word;
	}


	// Helper to convert syllable from Tai-lo number tones to diacritic tones
	getMarkTone(input, placement, tones) {
		return input;
	}


	// Helper to apply tone sandhi to a word
	toneSandhi(word, last) {
		return word;
	}


	// Helpre to define which words should be sandhi'd fully
	toneSandhiPosition(input) {
		const sandhiLogic = {
			'exc_last': input.map((char, i) => [char, i !== input.length - 1]),
			'incl_last': input.map(char => [char, true]),
		};
		let resultList = [];
		for (let i = 0; i < input.length; i++) {
			let result;
			if (i < input.length - 1 && Converter.location.includes(input[i + 1])) {
				result = false;
			} else if (Converter.location.includes(input[i]) || Converter.noSandhi.includes(input[i])) {
				result = false;
			} else if (input[i].length > 1 && input[i].endsWith("仔")) {
				result = "a suff";
			} else {
				result = i < input.length - 1 && isCjk(input[i + 1]);
			}
			resultList.push([input[i], result]);
		}
		resultList = sandhiLogic[this.sandhi] || resultList;
		for (let i = resultList.length - 2; i >= 0; i--) {
			if (Converter.suffixes.includes(resultList[i + 1][0])) {
				resultList[i] = [resultList[i][0], false];
			}
		}
		return resultList;
	}


	////// Tai-lo to other transliteration systems converting

	// Helper to convert syllable from Tai-lo to Tai-lo
	// (called only in cases when tone sandhi is applied)
	tailoToTailo(input) {
		return input;
	}


	// Helper to convert syllable from Tai-lo to POJ
	tailoToPoj(input) {
		return input;
	}


	// Helper to convert syllable from Tai-lo to 方音符號 (zhuyin)
	tailoToZhuyin(input) {
		return input;
	}


	// Helper to convert syllable from Tai-lo to TLPA
	tailoToTlpa(input) {
		return input;
	}


	// Helper to convert syllable from Tai-lo to Bbanlam pingyim
	tailoToPingyim(input) {
		return input;
	}


	// Helper to convert syllable from Tai-lo to Tong-iong ping-im
	tailoToTi(input) {
		return input;
	}


	// Helper to convert syllable from Tai-lo to International Phonetic Alphabet
	tailoToIpa(input) {
		return input;
	}


	////// Converted output formatting

	// Helper to convert Chinese punctuation to Latin punctuation with appropriate spacing
	formatPunctuationWestern(input) {
		return input;
	}


	// Helper to restore original CJK punctuation with appropriate spacing
	formatPunctuationCJK(input) {
		return input;
	}


	// Helper to capitalise text in according to punctuation
	formatText(input) {
		return input;
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
	Converter,
	Tokeniser,
	isCjk,
	toTraditional,
	toSimplified
};