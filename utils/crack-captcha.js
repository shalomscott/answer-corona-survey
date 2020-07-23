const CBL = require('../lib/cbl-js.js');

module.exports = () =>
	new Promise((resolve) => {
		const cbl = new CBL({
			preprocess: function (img) {
				img.binarize(60);
				img.convolute(
					[
						[0, 1, 0],
						[1, 2, 1],
						[0, 1, 0]
					],
					1 / 6
				);
				img.colorRegions(50);
			},
			model_file: `file:///${__dirname}/cbl-model.dat`,
			character_set: '0123456789',
			blob_min_pixels: 40,
			exact_characters: 4,
			blob_max_pixels: 400,
			pattern_width: 25,
			pattern_height: 25,
			perceptive_colorspace: true,
			model_loaded: () => cbl.solve('./captcha.jpeg').done(resolve)
		});
	});
