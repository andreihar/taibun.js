const { Converter, isCjk, toTraditional, toSimplified } = require('taibun');

test('convert simplified', () => {
	let c = new Converter();
	expect(c.get('我爱学语言')).toBe('Guá ài o̍h gí-giân');
});

test('to traditional', () => {
	expect(toTraditional('干休')).toBe('干休');
	expect(toTraditional('干杯')).toBe('乾杯');
	expect(toTraditional('干部')).toBe('幹部');
	expect(toTraditional('周密')).toBe('周密');
	expect(toTraditional('周期')).toBe('週期');
	expect(toTraditional('天后')).toBe('天后');
	expect(toTraditional('大后日')).toBe('大後日');
	expect(toTraditional('不只')).toBe('不只');
	expect(toTraditional('船只')).toBe('船隻');
	expect(toTraditional('台语')).toBe('台語');
	expect(toTraditional('寝台车')).toBe('寢臺車');
	expect(toTraditional('台面')).toBe('檯面');
	expect(toTraditional('风台')).toBe('風颱');
	expect(toTraditional('两个')).toBe('兩个');
	expect(toTraditional('个人')).toBe('個人');
});

test('traditional vars', () => {
	const c = new Converter({ punctuation: 'none' });
	expect(c.get('木蝨')).toBe('ba̍k-sat');
	expect(c.get('爲啥物')).toBe('uī-siánn-mi̍h');
	expect(c.get('白癡')).toBe('pe̍h-tshi');
	expect(c.get('牛肉麪')).toBe('gû-bah-mī');
	expect(c.get('臺北人')).toBe('Tâi-pak-lâng');
	expect(c.get('聲説')).toBe('siann-sueh');
	expect(c.get('研鉢')).toBe('gíng-puah');
	expect(c.get('踊躍')).toBe('ióng-io̍k');
});

test('to simplified', () => {
	expect(toSimplified('干休')).toBe('干休');
	expect(toSimplified('乾杯')).toBe('干杯');
	expect(toSimplified('幹部')).toBe('干部');
	expect(toSimplified('周密')).toBe('周密');
	expect(toSimplified('週期')).toBe('周期');
	expect(toSimplified('天后')).toBe('天后');
	expect(toSimplified('大後日')).toBe('大后日');
	expect(toSimplified('不只')).toBe('不只');
	expect(toSimplified('船隻')).toBe('船只');
	expect(toSimplified('台語')).toBe('台语');
	expect(toSimplified('寢臺車')).toBe('寝台车');
	expect(toSimplified('檯面')).toBe('台面');
	expect(toSimplified('風颱')).toBe('风台');
	expect(toSimplified('兩个')).toBe('两个');
	expect(toSimplified('個人')).toBe('个人');
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