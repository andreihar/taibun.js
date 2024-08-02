const { Converter } = require('taibun');

test('tones', () => {
	const c = new Converter({ system: 'IPA', dialect: "Singapore", punctuation: 'none' });
	const tones = { '衫': 'sã⁴⁴', '短': 'te⁴²', '褲': 'kʰɔ²¹', '闊': 'kʰuaʔ³²', '人': 'laŋ²⁴', '鼻': 'pʰĩ²²', '直': 'tit̚⁴' };
	for (let [tone, expected] of Object.entries(tones)) {
		expect(c.get(tone)).toBe(expected);
	}
});

test('o conversion', () => {
	const c = new Converter({ system: 'IPA', dialect: "Singapore", punctuation: 'none' });
	const oWords = { '高': 'ko⁴⁴', '唔': 'ɔ̃⁴⁴', '烏': 'ɔ⁴⁴', '王': 'ɔŋ²⁴' };
	for (let [word, expected] of Object.entries(oWords)) {
		expect(c.get(word)).toBe(expected);
	}
});

describe('eng conversion', () => {
	const hanjiData = ['用', '冰', '兵', '幸啊', '無閒', '無政府'];
	const testData = [
		[['ēng', 'peng', 'peng', 'hēng--ah', 'bô-êng', 'bô tsèng-hú'], "Tailo"],
		[['ēng', 'peng', 'peng', 'hēng--ah', 'bô-êng', 'bô chèng-hú'], "POJ"],
		[['ㆤㄥ˫', 'ㄅㆤㄥ', 'ㄅㆤㄥ', 'ㄏㆤㄥ˫ ㄚ', 'ㆠㄜˊ ㆤㄥˊ', 'ㆠㄜˊ ㄗㆤㄥ˪ ㄏㄨˋ'], "Zhuyin"],
		[['eng7', 'peng1', 'peng1', 'heng7 ah0', 'bo5 eng5', 'bo5 ceng3 hu2'], "TLPA"],
		[['êng', 'bēng', 'bēng', 'hêng ah', 'bbóéng', 'bbó zènghǔ'], "Pingyim"],
		[['ēng', 'beng', 'beng', 'hēng--åh', 'bhôr-ĕng', 'bhôr zèng-hù'], "Tongiong"],
		[['eŋ²²', 'peŋ⁴⁴', 'peŋ⁴⁴', 'heŋ²² a', 'bo²⁴ eŋ²⁴', 'bo²⁴ tseŋ²¹ hu⁴²'], "IPA"]
	];
	testData.forEach(([transl, system]) => {
		const data = hanjiData.map((h, i) => [h, transl[i]]);
		test(`testing: ${system}`, () => {
			const c = new Converter({ system, dialect: "Singapore", punctuation: 'none' });
			data.forEach(([hanji, expected]) => { expect(c.get(hanji)).toBe(expected); });
		});
	});
});

test('sandhi', () => {
	const sandhis = ['auto', 'none', 'excLast', 'inclLast'];
	const expectedResults = ['Tài-uân', 'Tâi-uân', 'Tài-uân', 'Tài-uàn'];

	sandhis.forEach((sandhi, index) => {
		const c = new Converter({ dialect: "Singapore", punctuation: "none", sandhi });
		expect(c.get('台灣')).toBe(expectedResults[index]);
	});
});

test('kopi', () => {
	const c = new Converter({ dialect: "Singapore", punctuation: 'none' });
	const kos = ['咖啡', '烏咖啡', '咖啡杯', '咖哩', '咖咖仔'];
	const expectedResults = ['ko-pi', 'oo-ko-pi', 'ko-pi-pue', 'ka-lí', 'ka-ka-á'];

	kos.forEach((ko, index) => {
		expect(c.get(ko)).toBe(expectedResults[index]);
	});
});