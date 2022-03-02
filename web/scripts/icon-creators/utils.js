const fs = require('fs');
const axios = require('axios')
const unzipper = require('unzipper');
const scaler = require('scale-that-svg');
const path = require('path');
const { parseSync } = require('xml-reader');
const Svg = require('oslllo-svg-fixer/src/svg');


// Download the icons from github
async function downloadIcons(url, regex) {
  // const regex = /heroicons-master\/src\/outline\/[0-9a-zA-Z-_]*.svg$/;

  process.stdout.write('Downloading repo in zip ... ');
  const { data } = await axios.get(url, { responseType: 'arraybuffer' });
  console.log('done');

  process.stdout.write('Unzipping files ... ');
  const unzipped = await unzipper.Open.buffer(Buffer.from(data));
  const files = unzipped.files;
  console.log('done');

  const icons = []
  for (const file of files) {
    if (regex.test(file.path)) {
      icons.push(file);
    }
  }

  return icons;
}

// Convert stroke to fill of svg icons
async function fixIcons(icons, tempFolder) {
  process.stdout.write('Converting stroke to fill ... ')
  const result = await Promise.all(icons.map(icon => fixIcon(icon.name, icon.content, tempFolder)));
  console.log('done');

  return result;
}

async function fixIcon(name, content, tempFolder) {
  const filepath = `${tempFolder}/${name}.svg`
  return new Promise((resolve, reject) => fs.writeFile(filepath, content, err => {
    if (err) {
      reject(`Write ${name} to temp file failed`);
    } else {
      resolve(new Svg(filepath).process());
    }
  })).then(fixed => ({
    name, content: mergePath(fixed)
  }));
}

// Resize the viewbox of the svg icons
async function scaleIcons(icons, size, prefix) {
  process.stdout.write('Scaling icons ... ');
  const result = await Promise.all(icons.map(icon => scaleIcon(icon, size, prefix)));
  console.log('done');

  return result;
}

async function scaleIcon(icon, size, prefix) {
  const iconContent = await icon.buffer();
  const filepath = icon.path
  const xmlContent = parseSync(iconContent.toString());
  const viewBox = xmlContent.attributes?.viewBox?.split(' ');
  if (viewBox.length !== 4) {
    throw Error(`Invalid viewbox in file ${filepath}`)
  }

  const width = viewBox[2] - viewBox[0];
  const height = viewBox[3] - viewBox[1];
  if (width !== height) {
    throw Error(`Not a square svg: ${filepath}`)
  }

  const scaled = await scaler.scale(
    iconContent,
    { scale: size / width, round: 3 }
  );

  const name = createName(prefix, filepath);

  return { name, content: scaled };
}

// Create a name from its path according to our rule
function createName(prefix, filepath) {
  const basename = path.basename(filepath);
  const extPos = basename.lastIndexOf('.');
  let filename = basename;
  if (extPos > 0) {
    filename = basename.slice(0, extPos);
  }

  return `${prefix}${filename.split('-').map(
    part => part.replace(/^\w/, (c) => c.toUpperCase())
  ).join('')}`;
}

// Merge multiple paths in a svg into one path
function mergePath(content) {
  const xmlContent = parseSync(content);
  const mergedPath = xmlContent.children.filter(
    child => child.name === 'path' && child.attributes.d
  ).map(child => child.attributes.d).join('');

  return mergedPath;
}

module.exports = {
  downloadIcons, scaleIcons, fixIcons
}
