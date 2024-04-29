const { Converter, isCjk, toTraditional, toSimplified } = require('taibun');

test('convert simplified', () => {
	let c = new Converter();
	expect(c.get('我爱学语言')).toBe('Guá ài o̍h gí-giân');
});

test('to traditional', () => {
	expect(toTraditional('汉字是台湾用来写几若种现代佮古代语文个书写文字系统')).toBe('漢字是台灣用來寫幾若種現代佮古代語文个書寫文字系統');
});

test('to simplified', () => {
	expect(toSimplified('漢字是臺灣用來寫幾若種現代佮古代語文个書寫文字系統')).toBe('汉字是台湾用来写几若种现代佮古代语文个书写文字系统');
});

test('is cjk', () => {
	expect(isCjk('漢')).toBe(true);
	expect(isCjk('a')).toBe(false);
	expect(isCjk('。')).toBe(false);
	expect(isCjk('𠢕')).toBe(true);
	expect(isCjk('福建')).toBe(true);
	expect(isCjk('𥴊仔賴')).toBe(true);
	expect(isCjk('福建a')).toBe(false);
});