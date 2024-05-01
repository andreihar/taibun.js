const fs = require('fs');
const path = require('path');

const wordDict = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/words.json'), 'utf8'));
const tradDict = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/simplified.json'), 'utf8'));
const simplifiedDict = Object.entries(tradDict).reduce((acc, [k, v]) => ({ ...acc, [v]: k }), { '臺': '台' });

// Helper to check if the character is a Chinese character
function isCjk(input) {
	return [...input].every(char => {
		const code = char.codePointAt(0);
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


/*
Description: Converts Chinese characters to Taiwanese Hokkien phonetic transcriptions.
			 Supports both Traditional and Simplified characters.
Invariant: system = `Tailo` (default), `POJ`, `Zhuyin`, `TLPA`, `Pingyim`, `Tongiong`, `IPA`
		   dialect = `south` (Zhangzhou-leaning, default), `north` (Quanzhou-leaning)
		   format = `mark` (diacritical), `number` (numeric), `strip` (no tones)
		   delimiter = String that replaces the default delimiter
		   sandhi = `auto`, `none`, `excLast`, `inclLast`
		   punctuation = `format` (Latin-style, default), `none` (preserve original)
		   convertNonCjk = true, false (default)
*/
class Converter {
	static suffixToken = '[ЅFFX_ТКŊ]';
	static tt = '[ТŊ_ТКŊ]';
	static defaultDelimiter = {};
	static defaultSandhi = {};
	static suffixes = ['啊', '矣', '喂', '欸', '唅', '嘿', '諾', '乎', '唷', '喔', '嘖'];
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
		if (this.punctuation === 'format') {
			return this.formatText(this.formatPunctuationWestern(converted[0].toUpperCase() + converted.slice(1)));
		}
		return this.formatPunctuationCJK(converted);
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
		} else if (!this.convertNonCjk || ".,!?\"#$%&()*+/:;<=>@[\\]^`{|}~\t。．，、！？；：（）［］【】「」“”".includes(word[0])) {
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
		return word.replace(/--/g, Converter.suffixToken).replace(/-/g, this.delimiter).replace(new RegExp(Converter.suffixToken.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '--');
	}


	// Helper switch for converting 漢字 based on defined transliteration system
	systemConversion(word) {
		if (this.system === 'poj') return this.tailoToPoj(word);
		if (this.system === 'zhuyin') return this.tailoToZhuyin(word);
		if (this.system === 'tlpa') return this.tailoToTlpa(word);
		if (this.system === 'pingyim') return this.tailoToPingyim(word);
		if (this.system === 'tongiong') return this.tailoToTi(word);
		if (this.system === 'ipa') return this.tailoToIpa(word);
		if (['auto', 'excLast', 'inclLast'].includes(this.sandhi)) return this.tailoToTailo(word);
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
		const words = this.preprocessWord(input[0]);
		let numberTones = words.filter(w => w.length > 0).map(w => this.getNumberTone(w));
		if (this.sandhi === 'auto' || this.sandhi === 'excLast' || this.sandhi === 'inclLast' || this.format === 'number') {
			let replaceWithZero = false;
			numberTones = numberTones.map(s => replaceWithZero || (replaceWithZero = s[s.length - 1] === '0') ? s.slice(0, -1) + '0' : s);
		}
		if (this.sandhi === 'auto' || this.sandhi === 'excLast' || this.sandhi === 'inclLast') {
			let index = numberTones.findIndex(s => s.startsWith(Converter.suffixToken));
			if (index === -1) {
				index = numberTones.length;
			}
			if (index !== numberTones.length && numberTones.length > 1) {
				const word = this.toneSandhi(numberTones.slice(0, index), false);
				const number = numberTones.slice(index);
				numberTones = word.concat(number);
			} else {
				numberTones = this.toneSandhi(numberTones, input[1]);
			}
		}
		return numberTones;
	}


	// Helper to convert between transliteration systems
	replacementTool(dictionary, input) {
		const pattern = new RegExp(Object.keys(dictionary).join('|'), 'g');
		return input.replace(pattern, (matched) => dictionary[matched]);
	}


	// Helper to convert word from Tai-lo to number
	markToNumber(input) {
		input = input.replace('--', '-' + Converter.suffixToken);
		const words = input.split('-');
		input = words.filter(w => w.length > 0).map(w => this.getNumberTone(w)).join('-');
		return input.replace(Converter.suffixToken, '--');
	}


	// Helper to convert syllable from Tai-lo diacritic tones to number tones
	getNumberTone(input) {
		const finals = ['p', 't', 'k', 'h'];
		if (/á|é|í|ó|ú|ḿ|ńg|́/.test(input)) input += '2';
		else if (/à|è|ì|ò|ù|m̀|ǹg|̀/.test(input)) input += '3';
		else if (/â|ê|î|ô|û|m̂|n̂g|̂/.test(input)) input += '5';
		else if (/ā|ē|ī|ō|ū|m̄|n̄g|̄/.test(input)) input += '7';
		else if (/̍/.test(input)) input += '8';
		else if (finals.includes(input[input.length - 1])) input += '4';
		else input += '1';
		if (input.startsWith(Converter.suffixToken) && (input[input.length - 2] === 'h' || ['auto', 'excLast', 'inclLast'].includes(this.sandhi) || this.format === 'number')) {
			input = input.slice(0, -1) + '0';
		}
		input = Array.from(input.normalize("NFD")).filter(c => !/[\u0300-\u036f]/.test(c)).join('');
		return input;
	}


	// Helper to break down a word into syllables for conversion
	preprocessWord(word) {
		return word.replace(/--/g, '-' + Converter.suffixToken).split('-');
	}


	// Helper to convert syllable from Tai-lo number tones to diacritic tones
	getMarkTone(input, placement, tones) {
		for (const s of placement) {
			const replaced = s.replace(Converter.tt, '');
			if (input.includes(replaced)) {
				input = input.replace(replaced, s.replace(Converter.tt, tones[parseInt(input[input.length - 1])]));
				break;
			}
		}
		return input.slice(0, -1).normalize("NFC");
	}


	// Helper to apply tone sandhi to a word
	toneSandhi(words, last) {
		let sandhi = { '1': '7', '7': '3', '3': '2', '2': '1', '5': '7', 'p4': 'p8', 't4': 't8', 'k4': 'k8', 'h4': '2', 'p8': 'p4', 't8': 't4', 'k8': 'k4', 'h8': '3' };
		const aSandhi = { '1': '7', '2': '1', '3': '1', '5': '7', 'p4': 'p8', 't4': 't8', 'k4': 'k8', 'h4': '1', 'p8': 'p4', 't8': 't4', 'k8': 'k4', 'h8': '7' };
		if (this.dialect === 'north') {
			sandhi['5'] = '3';
		}
		const indices = last === 'a suff' && words.length > 1
			? [...Array(words.length - 2).keys()]
			: (!last ? [...Array(words.length - 1).keys()]
				: [...Array(words.length).keys()]);
		const sandhiWords = indices.map(i => this.replacementTool(sandhi, words[i]));
		if (last === 'a suff' && words.length > 1) {
			sandhiWords.push(this.replacementTool(aSandhi, words[words.length - 2]));
		}
		if (!last || last === 'a suff') {
			sandhiWords.push(words[words.length - 1]);
		}
		return sandhiWords;
	}


	// Helpre to define which words should be sandhi'd fully
	toneSandhiPosition(input) {
		const sandhiLogic = {
			'excLast': input.map((char, i) => [char, i !== input.length - 1]),
			'inclLast': input.map(char => [char, true]),
		};
		let resultList = input.map((item, i) => {
			if (i < input.length - 1 && Converter.location.includes(input[i + 1])) {
				return [item, false];
			} else if (Converter.location.includes(item) || Converter.noSandhi.includes(item)) {
				return [item, false];
			} else if (item.length > 1 && item.endsWith("仔")) {
				return [item, "a suff"];
			} else {
				let last = i < input.length - 1;
				let result = this.convertNonCjk ? last : last && isCjk(input[i + 1]);
				return [item, result];
			}
		});
		resultList = sandhiLogic[this.sandhi] || resultList;
		for (let i = resultList.length - 2; i >= 0; i--) {
			if ((this.convertNonCjk && resultList[i + 1][0].startsWith('--')) || Converter.suffixes.includes(resultList[i + 1][0])) {
				resultList[i] = [resultList[i][0], false];
			}
		}
		return resultList;
	}


	////// Tai-lo to other transliteration systems converting

	// Helper to convert syllable from Tai-lo to Tai-lo
	// (called only in cases when tone sandhi is applied)
	tailoToTailo(input) {
		const placement = [
			'ia' + Converter.tt + 'u', 'ua' + Converter.tt + 'i', 'ua' + Converter.tt, 'ue' + Converter.tt, 'ui' + Converter.tt, 'a' + Converter.tt + 'i',
			'a' + Converter.tt + 'u', 'o' + Converter.tt + 'o', 'ia' + Converter.tt, 'iu' + Converter.tt, 'io' + Converter.tt, 'o' + Converter.tt + 'o', 'a' + Converter.tt,
			'o' + Converter.tt, 'e' + Converter.tt, 'i' + Converter.tt, 'u' + Converter.tt, 'n' + Converter.tt + 'g', 'm' + Converter.tt
		];
		const tones = ["", "", "́", "̀", "", "̂", "̌", "̄", "̍", "̋"];
		placement.push(...placement.map(s => s.charAt(0).toUpperCase() + s.slice(1)));
		input = this.getNumberTones(input).map(nt => this.getMarkTone(nt, placement, tones)).join('-');
		return input.replace(Converter.suffixToken, '--');
	}


	// Helper to convert syllable from Tai-lo to POJ
	tailoToPoj(input) {
		const placement = [
			'oa' + Converter.tt + 'h', 'oa' + Converter.tt + 'n', 'oa' + Converter.tt + 'ng', 'oa' + Converter.tt + 'ⁿ', 'oa' + Converter.tt + 't',
			'ia' + Converter.tt + 'u', 'oe' + Converter.tt + 'h', 'o' + Converter.tt + 'e', 'oa' + Converter.tt + 'i', 'u' + Converter.tt + 'i', 'o' + Converter.tt + 'a',
			'a' + Converter.tt + 'i', 'a' + Converter.tt + 'u', 'ia' + Converter.tt, 'iu' + Converter.tt, 'io' + Converter.tt, 'a' + Converter.tt,
			'o' + Converter.tt, 'o͘' + Converter.tt, 'e' + Converter.tt, 'i' + Converter.tt, 'u' + Converter.tt, 'n' + Converter.tt + 'g', 'm' + Converter.tt
		];
		const convert = { 'nng': 'nng', 'nnh': 'hⁿ', 'nn': 'ⁿ', 'ts': 'ch', 'ing': 'eng', 'uai': 'oai', 'uan': 'oan', 'ik': 'ek', 'ua': 'oa', 'ue': 'oe', 'oo': 'o͘' };
		const tones = ['', '', '́', '̀', '', '̂', '', '̄', '̍', ''];
		placement.push(...placement.map(s => s.charAt(0).toUpperCase() + s.slice(1)));
		Object.keys(convert).forEach(s => convert[s.charAt(0).toUpperCase() + s.slice(1)] = convert[s].charAt(0).toUpperCase() + convert[s].slice(1));
		input = this.getNumberTones(input).map(nt => {
			const replaced = this.replacementTool(convert, nt);
			return this.getMarkTone(replaced, placement, tones);
		}).join('-');
		return input.replace(new RegExp(Converter.suffixToken.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '--');
	}


	// Helper to convert syllable from Tai-lo to 方音符號 (zhuyin)
	tailoToZhuyin(input) {
		const convert = {
			'p4': 'ㆴ4', 'p8': 'ㆴ8', 'k4': 'ㆶ4', 'k8': 'ㆶ8', 't4': 'ㆵ4', 't8': 'ㆵ8', 'h4': 'ㆷ4', 'h8': 'ㆷ8', 'h0': '0',
			'tshing': 'ㄑㄧㄥ', 'tshinn': 'ㄑㆪ', 'phing': 'ㄆㄧㄥ', 'phinn': 'ㄆㆪ', 'tsing': 'ㄐㄧㄥ', 'tsinn': 'ㄐㆪ',
			'ainn': 'ㆮ', 'aunn': 'ㆯ', 'giok': 'ㆣㄧㄜㆶ', 'ngai': 'ㄫㄞ', 'ngau': 'ㄫㄠ', 'ngoo': 'ㄫㆦ', 'ping': 'ㄅㄧㄥ',
			'pinn': 'ㄅㆪ', 'senn': 'ㄙㆥ', 'sing': 'ㄒㄧㄥ', 'sinn': 'ㄒㆪ', 'tshi': 'ㄑㄧ',
			'ang': 'ㄤ', 'ann': 'ㆩ', 'enn': 'ㆥ', 'ing': 'ㄧㄥ', 'inn': 'ㆪ', 'mai': 'ㄇㄞ', 'mau': 'ㄇㄠ', 'mng': 'ㄇㆭ',
			'moo': 'ㄇㆦ', 'mua': 'ㄇㄨㄚ', 'mue': 'ㄇㄨㆤ', 'mui': 'ㄇㄨㄧ', 'nga': 'ㄫㄚ', 'nge': 'ㄫㆤ', 'ngi': 'ㄫㄧ',
			'ong': 'ㆲ', 'onn': 'ㆧ', 'tsh': 'ㄘ', 'tsi': 'ㄐㄧ', 'unn': 'ㆫ',
			'ai': 'ㄞ', 'am': 'ㆰ', 'an': 'ㄢ', 'au': 'ㄠ', 'ji': 'ㆢㄧ', 'kh': 'ㄎ', 'ma': 'ㄇㄚ', 'me': 'ㄇㆤ', 'mi': 'ㄇㄧ',
			'ng': 'ㆭ', 'ok': 'ㆦㆶ', 'om': 'ㆱ', 'oo': 'ㆦ', 'ph': 'ㄆ', 'si': 'ㄒㄧ', 'th': 'ㄊ', 'ts': 'ㄗ',
			'a': 'ㄚ', 'b': 'ㆠ', 'e': 'ㆤ', 'g': 'ㆣ', 'h': 'ㄏ', 'i': 'ㄧ', 'j': 'ㆡ', 'k': 'ㄍ', 'l': 'ㄌ', 'm': 'ㆬ',
			'n': 'ㄋ', 'o': 'ㄜ', 'p': 'ㄅ', 's': 'ㄙ', 't': 'ㄉ', 'u': 'ㄨ'
		};
		const tones = ['', '', 'ˋ', '˪', '', 'ˊ', '', '˫', '˙'];
		let output = [];
		for (let nt of this.getNumberTones([input[0].toLowerCase(), input[1]])) {
			nt = this.replacementTool(convert, nt).replace(Converter.suffixToken, '');
			if (nt.length > 2 && nt[nt.length - 2] === 'ㄋ') {
				nt = nt.slice(0, -2) + 'ㄣ' + nt[nt.length - 1];
			}
			if (this.format !== 'number') {
				nt = Array.from(nt).map(t => isNaN(parseInt(t)) ? t : tones[parseInt(t)]).join('');
			}
			output.push(nt);
		}
		return output.join('-').replace(Converter.suffixToken, '');
	}


	// Helper to convert syllable from Tai-lo to TLPA
	tailoToTlpa(input) {
		const convert = { 'tsh': 'ch', 'ts': 'c' };
		Object.keys(convert).forEach(s => convert[s.charAt(0).toUpperCase() + s.slice(1)] = convert[s].charAt(0).toUpperCase() + convert[s].slice(1));
		input = this.getNumberTones(input).map(nt => this.replacementTool(convert, nt)).join('-');
		return input.replace(Converter.suffixToken, '');
	}


	// Helper to convert syllable from Tai-lo to Bbanlam pingyim
	tailoToPingyim(input) {
		const placement = [
			'ua' + Converter.tt + 'i', 'ia' + Converter.tt + 'o', 'a' + Converter.tt + 'i', 'a' + Converter.tt + 'o',
			'oo' + Converter.tt, 'ia' + Converter.tt, 'iu' + Converter.tt, 'io' + Converter.tt, 'ua' + Converter.tt, 'ue' + Converter.tt, 'ui' + Converter.tt,
			'a' + Converter.tt, 'o' + Converter.tt, 'e' + Converter.tt, 'i' + Converter.tt, 'u' + Converter.tt, 'n' + Converter.tt + 'g', 'm' + Converter.tt, 'n' + Converter.tt
		];
		const convert = {
			'p4': 'p4', 't4': 't4', 'k4': 'k4', 'h4': 'h4', 'p8': 'p8', 't8': 't8', 'k8': 'k8', 'h8': 'h8',
			'ainn': 'nai', 'iunn': 'niu', 'ann': 'na', 'onn': 'noo', 'enn': 'ne',
			'inn': 'ni', 'unn': 'nu', 'au': 'ao', 'ph': 'p', 'nng': 'lng', 'tsh': 'c',
			'ng': 'ggn', 'ts': 'z', 'th': 't', 'kh': 'k', 'ir': 'i', 'p': 'b', 'b': 'bb',
			't': 'd', 'k': 'g', 'g': 'gg', 'j': 'zz', 'n': 'ln', 'm': 'bbn'
		};
		const tones = ['', '̄', '̌', '̀', '̄', '́', '', '̂', '́', ''];
		placement.push(...placement.map(s => s.charAt(0).toUpperCase() + s.slice(1)));
		Object.keys(convert).forEach(s => convert[s.charAt(0).toUpperCase() + s.slice(1)] = convert[s].charAt(0).toUpperCase() + convert[s].slice(1));
		let output = [];
		for (let nt of this.getNumberTones(input)) {
			let replaced = this.replacementTool(convert, nt);
			const firstChar = replaced[0];
			const secondChar = replaced[1];
			if (firstChar.toLowerCase() === 'i') {
				replaced = (firstChar === 'I' ? 'Y' : 'y') + (['a', 'u', 'o'].includes(secondChar) ? replaced.slice(1) : replaced.toLowerCase());
			}
			if (firstChar.toLowerCase() === 'u') {
				replaced = (firstChar === 'U' ? 'W' : 'w') + (nt.length > 2 && ['a', 'i', 'e', 'o'].includes(secondChar) ? replaced.slice(1) : replaced.toLowerCase());
			}
			if (nt[0].toLowerCase() === 'm') {
				if (nt.length === 2) {
					replaced = nt[0] + nt[nt.length - 1];
				} else if (nt[1] === 'n') {
					replaced = nt[0] + replaced.slice(3);
				}
			}
			const lastThreeChars = nt.slice(-3, -1);
			if (lastThreeChars.toLowerCase() === 'ng') {
				replaced = replaced.slice(0, -4) + lastThreeChars + nt[nt.length - 1];
			}
			if (replaced.slice(-4, -1) === 'bbn') {
				replaced = replaced.replace('bbn', 'm', 1);
			}
			if (replaced.slice(-3, -1) === 'ln') {
				replaced = replaced.slice(0, -3) + 'n' + replaced[replaced.length - 1];
			}
			output.push(this.format !== 'number' ? this.getMarkTone(replaced, placement, tones) : replaced);
		}
		return output.join('-').replace(Converter.suffixToken, '');
	}


	// Helper to convert syllable from Tai-lo to Tong-iong ping-im
	tailoToTi(input) {
		let placement = [
			'ua' + Converter.tt + 'i', 'ia' + Converter.tt + 'o', 'a' + Converter.tt + 'i', 'a' + Converter.tt + 'o',
			'oo' + Converter.tt, 'ia' + Converter.tt, 'iu' + Converter.tt, 'io' + Converter.tt, 'ua' + Converter.tt, 'ue' + Converter.tt, 'ui' + Converter.tt,
			'a' + Converter.tt, 'o' + Converter.tt, 'e' + Converter.tt, 'i' + Converter.tt, 'u' + Converter.tt, 'n' + Converter.tt + 'g', 'm' + Converter.tt
		];
		// plosives don't change, ptkh 4/8 -> ptkh 4/8
		let convert = {
			'p4': 'p4', 't4': 't4', 'k4': 'k4', 'h4': 'h4', 'p8': 'p8', 't8': 't8', 'k8': 'k8', 'h8': 'h8',
			'oo': 'o', 'om': 'om', 'ong': 'ong', 'ir': 'i', 'tsh': 'c',
			'ts': 'z', 'nng': 'nng', 'ng': 'ng', 'g': 'gh', 'kh': 'k', 'k': 'g',
			'ph': 'p', 'p': 'b', 'b': 'bh', 'th': 't', 't': 'd', 'j': 'r'
		};
		const tones = ["̊", "", "̀", "̂", "̄", "̆", "", "̄", "", "́"];
		placement.push(...placement.map(s => s.charAt(0).toUpperCase() + s.slice(1)));
		Object.keys(convert).forEach(s => convert[s.charAt(0).toUpperCase() + s.slice(1)] = convert[s].charAt(0).toUpperCase() + convert[s].slice(1));
		const numberTones = this.getNumberTones(input).map(nt => nt.slice(-2, -1) === 'o' ? nt.slice(0, -2) + 'or' + nt.slice(-1) : nt);
		input = numberTones.map(nt => {
			if (this.format !== 'number') {
				return this.getMarkTone(this.replacementTool(convert, nt), placement, tones);
			} else {
				return this.replacementTool(convert, nt);
			}
		}).join('-');
		return input.replace(Converter.suffixToken, '--');
	}


	// Helper to convert syllable from Tai-lo to International Phonetic Alphabet
	tailoToIpa(input) {
		let convert = {
			'tsing': 'tɕiɪŋ', 'jiang': 'dʑiaŋ', 'tshing': 'tɕʰiɪŋ', 'tsik': 'tɕiɪk', 'tshik': 'tɕʰiɪk',
			'jian': 'dʑiɛn', 'jiat': 'dʑiɛt', 'tshi': 'tɕʰi',
			'iann': 'iã', 'ainn': 'ãi', 'iang': 'iaŋ', 'nng': 'nŋ',
			'mia': 'miã', 'mui': 'muĩ', 'mue': 'muẽ', 'mua': 'muã', 'ma': 'mã', 'me': 'mẽ', 'mi': 'mĩ', 'moo': 'mɔ̃', // m nasalisation
			'nia': 'niã', 'nua': 'nuã', 'na': 'nã', 'ne': 'nẽ', 'ni': 'nĩ', 'noo': 'nɔ̃', // n nasalisation
			'ngia': 'ŋiã', 'ngiu': 'ŋiũ', 'nga': 'ŋã', 'nge': 'ŋẽ', 'ngi': 'ŋĩ', 'ngoo': 'ŋɔ̃', // ng nasalisation
			'ing': 'iɪŋ', 'tsh': 'tsʰ', 'tsi': 'tɕi', 'ian': 'iɛn', 'iat': 'iɛt', 'onn': 'ɔ̃',
			'ong': 'ɔŋ', 'ik': 'iɪk', 'ji': 'dʑi', 'kh': 'kʰ', 'ng': 'ŋ', 'oo': 'ɔ', 'nn': '̃',
			'hm': 'hm̩', 'ph': 'pʰ', 'th': 'tʰ', 'ok': 'ɔk', 'om': 'ɔm', 'j': 'dz', 'o': 'ə'
		};
		if (this.dialect === 'north') {
			convert['o'] = 'o';
		}
		let convert2 = { 'p4': 'p̚4', 'p8': 'p̚8', 'k4': 'k̚4', 'k8': 'k̚8', 't4': 't̚4', 't8': 't̚8', 'h4': 'ʔ4', 'h8': 'ʔ8', 'si': 'ɕi', 'h0': 'ʔ0' };
		let tones = this.dialect !== 'north' ? ['', '⁴⁴', '⁵³', '¹¹', '²¹', '²⁵', '', '²²', '⁵'] : ['', '⁵⁵', '⁵¹', '²¹', '³²', '²⁴', '', '³³', '⁴'];
		Object.keys(convert).forEach(s => convert[s.charAt(0).toUpperCase() + s.slice(1)] = convert[s].charAt(0).toUpperCase() + convert[s].slice(1));
		Object.keys(convert2).forEach(s => convert2[s.charAt(0).toUpperCase() + s.slice(1)] = convert2[s].charAt(0).toUpperCase() + convert2[s].slice(1));
		let output = [];
		for (let numberTone of this.getNumberTones(input)) {
			numberTone = this.replacementTool(convert, numberTone).replace(Converter.suffixToken, '');
			if (numberTone.includes('ŋ')) {
				const indexOfNasal = numberTone.indexOf('ŋ');
				const precedingChars = numberTone.slice(0, indexOfNasal).toLowerCase().split('');
				const noVowelsBeforeNasal = precedingChars.every(char => !'aeioɔu'.includes(char));
				if ((numberTone.length > 2 && noVowelsBeforeNasal && indexOfNasal !== 0) || numberTone.length === 2) {
					numberTone = numberTone.replace('ŋ', 'ŋ̍');
				}
			}
			if (numberTone.length === 2 && numberTone[0] === 'm') {
				numberTone = 'm̩' + numberTone.slice(-1);
			}
			numberTone = this.replacementTool(convert2, numberTone);
			if (this.format !== 'number') {
				numberTone = numberTone.split('').map(char => char.match(/\d/) ? tones[parseInt(char)] : char).join('');
			}
			output.push(numberTone.normalize('NFC'));
		}
		return output.join('-').replace(Converter.suffixToken, '');
	}


	////// Converted output formatting

	// Helper to convert Chinese punctuation to Latin punctuation with appropriate spacing
	formatPunctuationWestern(input) {
		const punctuationMapping = {
			'。': '.', '．': ' ', '，': ',', '、': ',', '！': '!', '？': '?', '；': ';', '：': ':',
			'）': ')', '］': ']', '】': ']', '（': '(', '［': '[', '【': '['
		};
		const leftSpace = { '.': '.', ',': ',', '!': '!', '?': '?', ';': ';', ':': ':', ')': ')', ']': ']', '」': '"', '”': '"', '--': '--' };
		const rightSpace = { '(': '(', '[': '[', '「': '"', '“': '"' };
		for (const [punctCh, punctLat] of Object.entries(punctuationMapping)) {
			input = input.replace(new RegExp(punctCh, 'g'), punctLat);
		}
		for (const [left, space] of Object.entries(leftSpace)) {
			const escapedLeft = left.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			input = input.replace(new RegExp(' ' + escapedLeft, 'g'), space).replace(new RegExp(escapedLeft, 'g'), space);
		}
		for (const [right, space] of Object.entries(rightSpace)) {
			const escapedRight = right.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			input = input.replace(new RegExp(escapedRight + ' ', 'g'), space).replace(new RegExp(escapedRight, 'g'), space);
		}
		return input;
	}


	// Helper to restore original CJK punctuation with appropriate spacing
	formatPunctuationCJK(input) {
		const leftSpace = ['。', '．', '，', '、', '！', '？', '；', '：', '）', '］', '】', '」', '”', '--'];
		const rightSpace = ['（', '［', '【', '「', '“'];
		leftSpace.forEach(punct => {
			input = input.replace(new RegExp(' ' + punct + ' ', 'g'), punct).replace(new RegExp(' ' + punct, 'g'), punct);
		});
		rightSpace.forEach(punct => {
			input = input.replace(new RegExp(' ' + punct + ' ', 'g'), punct).replace(new RegExp(punct + ' ', 'g'), punct);
		});
		return input;
	}


	// Helper to capitalise text in according to punctuation
	formatText(input) {
		const puncFilter = /([.!?]\s*)/g;
		let splitWithPunc = input.split(puncFilter);
		splitWithPunc = splitWithPunc.map(i => i.length > 1 ? i[0].toUpperCase() + i.slice(1) : i);
		return splitWithPunc.join("");
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
		tokenised = indices.slice(0, -1).map((_, i) => {
			const start = indices.slice(0, i + 1).reduce((a, b) => a + b, 0);
			const end = start + indices[i + 1];
			return input.substring(start, end);
		});
		tokenised = tokenised.flatMap(word => {
			const splitByPunctuation = word.split(punctuations);
			const splitBySpaces = splitByPunctuation.flatMap(subword => subword.split(" "));
			return splitBySpaces.flatMap(word => {
				if (!word) return [];
				const endsWithSpecialChar = (word.endsWith('的') || word.endsWith('矣')) && word.length > 1;
				return endsWithSpecialChar ? [word.slice(0, -1), word.slice(-1)] : [word];
			});
		});
		return tokenised;
	}
}

module.exports = {
	Converter,
	Tokeniser,
	isCjk,
	toTraditional,
	toSimplified
};