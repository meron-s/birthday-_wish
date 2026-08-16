import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const photosDir = path.join(process.cwd(), "public", "photos");

const files = (await readdir(photosDir)).filter((f) =>
  /\.(png|jpe?g)$/i.test(f),
);

for (const file of files) {
  const input = path.join(photosDir, file);
  const base = file.replace(/\.(png|jpe?g)$/i, "");
  const output = path.join(photosDir, `${base}.webp`);

  await sharp(input)
    .rotate()
    .resize(900, 1200, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(output);

  const inSize = (await stat(input)).size;
  const outSize = (await stat(output)).size;
  console.log(
    `${file} → ${base}.webp (${Math.round(inSize / 1024)}KB → ${Math.round(outSize / 1024)}KB)`,
  );
}

console.log("Done.");
