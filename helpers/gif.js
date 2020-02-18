const gifFrames = require("gif-frames");

const convertGifToFrames = buffer =>
  gifFrames({ url: buffer, frames: "all", outputType: "png" }).then(frameData =>
    frameData.map(frame => frame.getImage())
  );

module.exports = { convertGifToFrames };
