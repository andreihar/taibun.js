function checker(array, generalConverter, northConverter) {
	array.forEach(word => {
		const [hanji, ...translParts] = word.split(',');
		const transl = translParts.join(',').split('/');
		expect(generalConverter.get(hanji.trim())).toBe(transl[0].trim());
		if (transl.length > 1) {
			expect(northConverter.get(hanji.trim())).toBe(transl[1].trim());
		}
	});
}

module.exports = checker;