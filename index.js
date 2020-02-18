"user strict";

const Koa = require("koa");
const Router = require("@koa/router");
const debug = require("debug")("app");

const { parseMultiPart } = require("./helpers/multipart");
const { convertGifToFrames } = require("./helpers/gif");
const { convertFramesToPDF } = require("./helpers/pdf");

const app = new Koa();
const router = new Router();

const fromStreamToBuffer = stream =>
  new Promise((resolve, reject) => {
    const bufs = [];
    stream.on("data", d => {
      bufs.push(d);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(bufs));
    });
    stream.on("error", err => reject(err));
  });

router.post("/upload", async (ctx, next) => {
  const { file } = await parseMultiPart(ctx.req);
  const imgBuffer = await fromStreamToBuffer(file);
  const streams = await convertGifToFrames(imgBuffer);
  const buffs = await Promise.all(streams.map(fromStreamToBuffer));
  const pdf = await fromStreamToBuffer(convertFramesToPDF(buffs));
  ctx.body = pdf;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);

app.on("error", err => {
  debug(`server error ${err}`);
});
