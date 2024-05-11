function checker(array, generalConverter, northConverter) {
	array.forEach(word => {
		const [hanji, translParts] = word;
		const transl = translParts.split('/');
		console.log(hanji, transl);
		expect(generalConverter.get(hanji.trim())).toBe(transl[0].trim());
		if (transl.length > 1) {
			expect(northConverter.get(hanji.trim())).toBe(transl[1].trim());
		}
	});
}

module.exports = checker;