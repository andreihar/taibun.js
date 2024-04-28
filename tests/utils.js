function checker(array, generalConverter, northConverter) {
	array.forEach(word => {
		const [hanji, transl] = word.split(',').map(str => str.trim());
		const translArray = transl.split('/');
		expect(translArray[0]).toBe(generalConverter.get(hanji));
		if (translArray.length > 1) {
			expect(translArray[1]).toBe(northConverter.get(hanji));
		}
	});
}

module.exports = checker;