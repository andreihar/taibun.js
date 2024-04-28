function checker(array, generalConverter, northConverter) {
	array.forEach(word => {
		const [hanji, transl] = word.split(',').map(str => str.trim());
		const translArray = transl.split('/');
		expect(generalConverter.get(hanji)).toBe(translArray[0]);
		if (translArray.length > 1) {
			expect(northConverter.get(hanji)).toBe(translArray[1]);
		}
	});
}

module.exports = checker;