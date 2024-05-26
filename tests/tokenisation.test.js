const { Tokeniser } = require('taibun');
const t = new Tokeniser();

test('general tokenisation', () => {
	expect(t.tokenise("太空朋友，恁好！恁食飽未？")).toEqual(['太空', '朋友', '，', '恁好', '！', '恁', '食飽', '未', '？']);
	expect(t.tokenise('漢字（閩南語注音: ㄏㄢˋ ㆡㄧˉ；白話字: Hàn-jī；')).toEqual(['漢字', '（', '閩南語', '注音', ':', 'ㄏㄢˋ', 'ㆡㄧˉ', '；', '白話字', ':', 'Hàn-jī', '；']);
});

test('best solution tokenisation', () => {
	expect(t.tokenise("中國人民共和國")).toEqual(['中國', '人民', '共和國']);
	expect(t.tokenise('中國人民雄協會')).toEqual(['中國人', '民雄', '協會']);
	expect(t.tokenise('花蓮市議員')).toEqual(['花蓮', '市議員']);
});

test('suffix tokenisation', () => {
	expect(t.tokenise("咱的食飯是誠好食")).toEqual(['咱', '的', '食飯', '是', '誠', '好食']);
	expect(t.tokenise("卯死矣")).toEqual(['卯死', '矣']);
});

test('simplified tokenisation', () => {
	expect(t.tokenise('汉字是用来写几若种现代佮古代语文个书写文字系统。')).toEqual(['汉字', '是', '用来', '写', '几若', '种', '现代', '佮', '古代', '语文', '个', '书写', '文字', '系统', '。']);
	expect(t.tokenise('现代个中国、日本、韩国、台湾拢有使用汉字')).toEqual(['现代', '个', '中国', '、', '日本', '、', '韩国', '、', '台湾', '拢', '有', '使用', '汉字']);
});

test('false', () => {
	const t = new Tokeniser(false);
	expect(t.tokenise('汉字是用来写几若种现代佮古代语文个书写文字系统。')).toEqual(['漢字', '是', '用來', '寫', '幾若', '種', '現代', '佮', '古代', '語文', '个', '書寫', '文字', '系統', '。']);
	expect(t.tokenise('现代个中国、日本、韩国、台湾拢有使用汉字')).toEqual(['現代', '个', '中國', '、', '日本', '、', '韓國', '、', '台灣', '攏', '有', '使用', '漢字']);
});