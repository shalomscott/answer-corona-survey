const fs = require("fs");
const streamPipeline = require("util").promisify(require("stream").pipeline);

module.exports = (filepath) => (res) =>
  streamPipeline(res.body, fs.createWriteStream(filepath));
