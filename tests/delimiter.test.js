const { Converter } = require('taibun');
const checker = require('./utils');

const hanjiData = ["標價", "按呢", "介紹人", "祝你今仔日真好的日子", "咱的食飯"];

describe('default', () => {
	const testData = [
		[["phiau-kè", "án-ne/án-ni", "kài-siāu-jîn/kài-siāu-lîn", "tsiok lí kin-á-ji̍t tsin-hó--ê ji̍t-tsí/tsiok lí kin-á-li̍t tsin-hó--ê li̍t-tsí", "lán--ê tsia̍h-pn̄g"], "Tailo"],
		[["phiau-kè", "án-ne/án-ni", "kài-siāu-jîn/kài-siāu-lîn", "chiok lí kin-á-ji̍t chin-hó--ê ji̍t-chí/chiok lí kin-á-li̍t chin-hó--ê li̍t-chí", "lán--ê chia̍h-pn̄g"], "POJ"],
		[["ㄆㄧㄠ ㄍㆤ˪", "ㄢˋ ㄋㆤ/ㄢˋ ㄋㄧ", "ㄍㄞ˪ ㄒㄧㄠ˫ ㆢㄧㄣˊ/ㄍㄞ˪ ㄒㄧㄠ˫ ㄌㄧㄣˊ", "ㄐㄧㆦㆶ ㄌㄧˋ ㄍㄧㄣ ㄚˋ ㆢㄧㆵ˙ ㄐㄧㄣ ㄏㄜˋ ㆤˊ ㆢㄧㆵ˙ ㄐㄧˋ/ㄐㄧㆦㆶ ㄌㄧˋ ㄍㄧㄣ ㄚˋ ㄌㄧㆵ˙ ㄐㄧㄣ ㄏㄜˋ ㆤˊ ㄌㄧㆵ˙ ㄐㄧˋ", "ㄌㄢˋ ㆤˊ ㄐㄧㄚㆷ˙ ㄅㆭ˫"], "Zhuyin"],
		[["phiau1 ke3", "an2 ne1/an2 ni1", "kai3 siau7 jin5/kai3 siau7 lin5", "ciok4 li2 kin1 a2 jit8 cin1 ho2 e5 jit8 ci2/ciok4 li2 kin1 a2 lit8 cin1 ho2 e5 lit8 ci2", "lan2 e5 ciah8 png7"], "TLPA"],
		[["piāogè", "ǎnlnē/ǎnlnī", "gàisiâozzín/gàisiâolín", "ziōk lǐ gīnǎzzít zīnhǒ é zzítzǐ/ziōk lǐ gīnǎlít zīnhǒ é lítzǐ", "lǎn é ziáhbn̂g"], "Pingyim"],
		[["piāu-gê", "an-ne/an-ni", "gài-siâu-rĭn/gài-siâu-lĭn", "ziok li gīn-a-rīt zīn-hòr--e̊ rīt-zì/ziok li gīn-a-līt zīn-hòr--e̊ līt-zì", "làn--e̊ ziâ-bn̄g"], "Tongiong"],
		[["pʰiau⁴⁴ ke¹¹/pʰiau⁵⁵ ke²¹", "an⁵³ nẽ⁴⁴/an⁵¹ nĩ⁵⁵", "kai¹¹ ɕiau²² dʑin²⁵/kai²¹ ɕiau³³ lin²⁴", "tɕiɔk̚²¹ li⁵³ kin⁴⁴ a⁵³ dʑit̚⁵ tɕin⁴⁴ hə⁵³ e²⁵ dʑit̚⁵ tɕi⁵³/tɕiɔk̚³² li⁵¹ kin⁵⁵ a⁵¹ lit̚⁴ tɕin⁵⁵ ho⁵¹ e²⁴ lit̚⁴ tɕi⁵¹", "lan⁵³ e²⁵ tɕiaʔ⁵ pŋ̍²²/lan⁵¹ e²⁴ tɕiaʔ⁴ pŋ̍³³"], "IPA"]
	];
	testData.forEach(([transl, system]) => {
		const data = hanjiData.map((h, i) => `${h},${transl[i]}`);
		test(`testing: ${system}`, () => {
			checker(data, new Converter({ system, punctuation: 'none' }), new Converter({ system, dialect: "north", punctuation: 'none' }));
		});
	});
});

describe('hyphen', () => {
	const testData = [
		[["phiau-kè", "án-ne/án-ni", "kài-siāu-jîn/kài-siāu-lîn", "tsiok lí kin-á-ji̍t tsin-hó--ê ji̍t-tsí/tsiok lí kin-á-li̍t tsin-hó--ê li̍t-tsí", "lán--ê tsia̍h-pn̄g"], "Tailo"],
		[["phiau-kè", "án-ne/án-ni", "kài-siāu-jîn/kài-siāu-lîn", "chiok lí kin-á-ji̍t chin-hó--ê ji̍t-chí/chiok lí kin-á-li̍t chin-hó--ê li̍t-chí", "lán--ê chia̍h-pn̄g"], "POJ"],
		[["ㄆㄧㄠ-ㄍㆤ˪", "ㄢˋ-ㄋㆤ/ㄢˋ-ㄋㄧ", "ㄍㄞ˪-ㄒㄧㄠ˫-ㆢㄧㄣˊ/ㄍㄞ˪-ㄒㄧㄠ˫-ㄌㄧㄣˊ", "ㄐㄧㆦㆶ ㄌㄧˋ ㄍㄧㄣ-ㄚˋ-ㆢㄧㆵ˙ ㄐㄧㄣ-ㄏㄜˋ ㆤˊ ㆢㄧㆵ˙-ㄐㄧˋ/ㄐㄧㆦㆶ ㄌㄧˋ ㄍㄧㄣ-ㄚˋ-ㄌㄧㆵ˙ ㄐㄧㄣ-ㄏㄜˋ ㆤˊ ㄌㄧㆵ˙-ㄐㄧˋ", "ㄌㄢˋ ㆤˊ ㄐㄧㄚㆷ˙-ㄅㆭ˫"], "Zhuyin"],
		[["phiau1-ke3", "an2-ne1/an2-ni1", "kai3-siau7-jin5/kai3-siau7-lin5", "ciok4 li2 kin1-a2-jit8 cin1-ho2 e5 jit8-ci2/ciok4 li2 kin1-a2-lit8 cin1-ho2 e5 lit8-ci2", "lan2 e5 ciah8-png7"], "TLPA"],
		[["piāo-gè", "ǎn-lnē/ǎn-lnī", "gài-siâo-zzín/gài-siâo-lín", "ziōk lǐ gīn-ǎ-zzít zīn-hǒ é zzít-zǐ/ziōk lǐ gīn-ǎ-lít zīn-hǒ é lít-zǐ", "lǎn é ziáh-bn̂g"], "Pingyim"],
		[["pʰiau⁴⁴-ke¹¹/pʰiau⁵⁵-ke²¹", "an⁵³-nẽ⁴⁴/an⁵¹-nĩ⁵⁵", "kai¹¹-ɕiau²²-dʑin²⁵/kai²¹-ɕiau³³-lin²⁴", "tɕiɔk̚²¹ li⁵³ kin⁴⁴-a⁵³-dʑit̚⁵ tɕin⁴⁴-hə⁵³ e²⁵ dʑit̚⁵-tɕi⁵³/tɕiɔk̚³² li⁵¹ kin⁵⁵-a⁵¹-lit̚⁴ tɕin⁵⁵-ho⁵¹ e²⁴ lit̚⁴-tɕi⁵¹", "lan⁵³ e²⁵ tɕiaʔ⁵-pŋ̍²²/lan⁵¹ e²⁴ tɕiaʔ⁴-pŋ̍³³"], "IPA"]
	];
	testData.forEach(([transl, system]) => {
		const data = hanjiData.map((h, i) => `${h},${transl[i]}`);
		test(`testing: ${system}`, () => {
			checker(data, new Converter({ system, punctuation: 'none', delimiter: '-' }), new Converter({ system, dialect: "north", punctuation: 'none', delimiter: '-' }));
		});
	});
});

describe('space', () => {
	const testData = [
		[["phiau kè", "án ne/án ni", "kài siāu jîn/kài siāu lîn", "tsiok lí kin á ji̍t tsin hó--ê ji̍t tsí/tsiok lí kin á li̍t tsin hó--ê li̍t tsí", "lán--ê tsia̍h pn̄g"], "Tailo"],
		[["phiau kè", "án ne/án ni", "kài siāu jîn/kài siāu lîn", "chiok lí kin á ji̍t chin hó--ê ji̍t chí/chiok lí kin á li̍t chin hó--ê li̍t chí", "lán--ê chia̍h pn̄g"], "POJ"],
		[["ㄆㄧㄠ ㄍㆤ˪", "ㄢˋ ㄋㆤ/ㄢˋ ㄋㄧ", "ㄍㄞ˪ ㄒㄧㄠ˫ ㆢㄧㄣˊ/ㄍㄞ˪ ㄒㄧㄠ˫ ㄌㄧㄣˊ", "ㄐㄧㆦㆶ ㄌㄧˋ ㄍㄧㄣ ㄚˋ ㆢㄧㆵ˙ ㄐㄧㄣ ㄏㄜˋ ㆤˊ ㆢㄧㆵ˙ ㄐㄧˋ/ㄐㄧㆦㆶ ㄌㄧˋ ㄍㄧㄣ ㄚˋ ㄌㄧㆵ˙ ㄐㄧㄣ ㄏㄜˋ ㆤˊ ㄌㄧㆵ˙ ㄐㄧˋ", "ㄌㄢˋ ㆤˊ ㄐㄧㄚㆷ˙ ㄅㆭ˫"], "Zhuyin"],
		[["phiau1 ke3", "an2 ne1/an2 ni1", "kai3 siau7 jin5/kai3 siau7 lin5", "ciok4 li2 kin1 a2 jit8 cin1 ho2 e5 jit8 ci2/ciok4 li2 kin1 a2 lit8 cin1 ho2 e5 lit8 ci2", "lan2 e5 ciah8 png7"], "TLPA"],
		[["piāo gè", "ǎn lnē/ǎn lnī", "gài siâo zzín/gài siâo lín", "ziōk lǐ gīn ǎ zzít zīn hǒ é zzít zǐ/ziōk lǐ gīn ǎ lít zīn hǒ é lít zǐ", "lǎn é ziáh bn̂g"], "Pingyim"],
		[["piāu gê", "an ne/an ni", "gài siâu rĭn/gài siâu lĭn", "ziok li gīn a rīt zīn hòr--e̊ rīt zì/ziok li gīn a līt zīn hòr--e̊ līt zì", "làn--e̊ ziâ bn̄g"], "Tongiong"],
		[["pʰiau⁴⁴ ke¹¹/pʰiau⁵⁵ ke²¹", "an⁵³ nẽ⁴⁴/an⁵¹ nĩ⁵⁵", "kai¹¹ ɕiau²² dʑin²⁵/kai²¹ ɕiau³³ lin²⁴", "tɕiɔk̚²¹ li⁵³ kin⁴⁴ a⁵³ dʑit̚⁵ tɕin⁴⁴ hə⁵³ e²⁵ dʑit̚⁵ tɕi⁵³/tɕiɔk̚³² li⁵¹ kin⁵⁵ a⁵¹ lit̚⁴ tɕin⁵⁵ ho⁵¹ e²⁴ lit̚⁴ tɕi⁵¹", "lan⁵³ e²⁵ tɕiaʔ⁵ pŋ̍²²/lan⁵¹ e²⁴ tɕiaʔ⁴ pŋ̍³³"], "IPA"]
	];
	testData.forEach(([transl, system]) => {
		const data = hanjiData.map((h, i) => `${h},${transl[i]}`);
		test(`testing: ${system}`, () => {
			checker(data, new Converter({ system, punctuation: 'none', delimiter: ' ' }), new Converter({ system, dialect: "north", punctuation: 'none', delimiter: ' ' }));
		});
	});
});

describe('nospace', () => {
	const testData = [
		[["phiaukè", "ánne/ánni", "kàisiāujîn/kàisiāulîn", "tsiok lí kináji̍t tsinhó--ê ji̍ttsí/tsiok lí kináli̍t tsinhó--ê li̍ttsí", "lán--ê tsia̍hpn̄g"], "Tailo"],
		[["phiaukè", "ánne/ánni", "kàisiāujîn/kàisiāulîn", "chiok lí kináji̍t chinhó--ê ji̍tchí/chiok lí kináli̍t chinhó--ê li̍tchí", "lán--ê chia̍hpn̄g"], "POJ"],
		[["ㄆㄧㄠㄍㆤ˪", "ㄢˋㄋㆤ/ㄢˋㄋㄧ", "ㄍㄞ˪ㄒㄧㄠ˫ㆢㄧㄣˊ/ㄍㄞ˪ㄒㄧㄠ˫ㄌㄧㄣˊ", "ㄐㄧㆦㆶ ㄌㄧˋ ㄍㄧㄣㄚˋㆢㄧㆵ˙ ㄐㄧㄣㄏㄜˋ ㆤˊ ㆢㄧㆵ˙ㄐㄧˋ/ㄐㄧㆦㆶ ㄌㄧˋ ㄍㄧㄣㄚˋㄌㄧㆵ˙ ㄐㄧㄣㄏㄜˋ ㆤˊ ㄌㄧㆵ˙ㄐㄧˋ", "ㄌㄢˋ ㆤˊ ㄐㄧㄚㆷ˙ㄅㆭ˫"], "Zhuyin"],
		[["phiau1ke3", "an2ne1/an2ni1", "kai3siau7jin5/kai3siau7lin5", "ciok4 li2 kin1a2jit8 cin1ho2 e5 jit8ci2/ciok4 li2 kin1a2lit8 cin1ho2 e5 lit8ci2", "lan2 e5 ciah8png7"], "TLPA"],
		[["piāogè", "ǎnlnē/ǎnlnī", "gàisiâozzín/gàisiâolín", "ziōk lǐ gīnǎzzít zīnhǒ é zzítzǐ/ziōk lǐ gīnǎlít zīnhǒ é lítzǐ", "lǎn é ziáhbn̂g"], "Pingyim"],
		[["piāugê", "anne/anni", "gàisiâurĭn/gàisiâulĭn", "ziok li gīnarīt zīnhòr--e̊ rītzì/ziok li gīnalīt zīnhòr--e̊ lītzì", "làn--e̊ ziâbn̄g"], "Tongiong"],
		[["pʰiau⁴⁴ke¹¹/pʰiau⁵⁵ke²¹", "an⁵³nẽ⁴⁴/an⁵¹nĩ⁵⁵", "kai¹¹ɕiau²²dʑin²⁵/kai²¹ɕiau³³lin²⁴", "tɕiɔk̚²¹ li⁵³ kin⁴⁴a⁵³dʑit̚⁵ tɕin⁴⁴hə⁵³ e²⁵ dʑit̚⁵tɕi⁵³/tɕiɔk̚³² li⁵¹ kin⁵⁵a⁵¹lit̚⁴ tɕin⁵⁵ho⁵¹ e²⁴ lit̚⁴tɕi⁵¹", "lan⁵³ e²⁵ tɕiaʔ⁵pŋ̍²²/lan⁵¹ e²⁴ tɕiaʔ⁴pŋ̍³³"], "IPA"]
	];
	testData.forEach(([transl, system]) => {
		const data = hanjiData.map((h, i) => `${h},${transl[i]}`);
		test(`testing: ${system}`, () => {
			checker(data, new Converter({ system, punctuation: 'none', delimiter: '' }), new Converter({ system, dialect: "north", punctuation: 'none', delimiter: '' }));
		});
	});
});

describe('default', () => {
	const testData = [

	];
	testData.forEach(([transl, system]) => {
		const data = hanjiData.map((h, i) => `${h},${transl[i]}`);
		test(`testing: ${system}`, () => {
			checker(data, new Converter({ system, punctuation: 'none' }), new Converter({ system, dialect: "north", punctuation: 'none' }));
		});
	});
});