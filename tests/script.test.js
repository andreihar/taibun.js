const isTaibun = require('taibun');

test('isTaibun function returns true for "taibun"', () => {
	expect(isTaibun('taibun')).toBe(true);
});