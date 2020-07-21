const util = require("util");
const fs = require("fs");
const streamPipeline = util.promisify(require("stream").pipeline);

const CBL = require("./lib/cbl-js.js");
const { getSurvey, getCaptcha, submitSurvey } = require("./requests.js");

let cookie = "";

getSurvey()
  .then((res) => res.headers.raw()["set-cookie"])
  .then((cookies) => (cookie = cookies.join(";")))
  .then(() => getCaptcha(cookie))
  .then((res) => streamPipeline(res.body, fs.createWriteStream("captcha.jpeg")))
  .then(
    () =>
      new Promise((resolve) => {
        const cbl = new CBL({
          preprocess: function (img) {
            img.binarize(60);
            img.convolute(
              [
                [0, 1, 0],
                [1, 2, 1],
                [0, 1, 0],
              ],
              1 / 6
            );
            img.colorRegions(50);
          },
          model_file: `file:///${__dirname}/captcha-solver/cbl-model.dat`,
          character_set: "0123456789",
          blob_min_pixels: 40,
          exact_characters: 4,
          blob_max_pixels: 400,
          pattern_width: 25,
          pattern_height: 25,
          perceptive_colorspace: true,
          model_loaded: () => cbl.solve("./captcha.jpeg").done(resolve),
        });
      })
  )
  .then((solution) => submitSurvey(cookie, solution, process.env.TZ))
  .then((res) => res.text())
  .then(console.log)
  .catch(console.error);
