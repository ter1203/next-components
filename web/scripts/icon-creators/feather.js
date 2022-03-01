const fs = require('fs');
const axios = require('axios')
const unzipper = require('unzipper');
const scaler = require('scale-that-svg');
const path = require('path');
const { parseSync } = require('xml-reader');
const Svg = require('oslllo-svg-fixer/src/svg');

const FEATHER_ICON_REPO = 'https://github.com/feathericons/feather/archive/refs/heads/master.zip';
const ICON_VIEWBOX_SIZE = 20;
const TEMP_FOLDER = './temp';

// Download the feather icons from github
async function downloadIcons() {
  const regex = /feather-master\/icons\/[0-9a-zA-Z-_]*.svg$/;

  process.stdout.write('Downloading repo in zip ... ');
  const { data } = await axios.get(
    FEATHER_ICON_REPO,
    { responseType: 'arraybuffer' }
  );
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

// Resize the viewbox of the svg icons
async function scaleIcons(icons) {
  process.stdout.write('Scaling icons ... ');
  const result = await Promise.all(icons.map(icon => scaleIcon(icon)));
  console.log('done');

  return result;
}

async function scaleIcon(icon) {
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
    { scale: ICON_VIEWBOX_SIZE / width, round: 3 }
  );

  const name = createName(filepath);

  return { name, content: scaled };
}

// Convert stroke to fill of svg icons
async function fixIcons(icons) {
  process.stdout.write('Converting stroke to fill ... ')
  const result = await Promise.all(icons.map(icon => fixIcon(icon.name, icon.content)));
  console.log('done');

  return result;
}

async function fixIcon(name, content) {
  const filepath = `${TEMP_FOLDER}/${name}.svg`
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


// Merge multiple paths in a svg into one path
function mergePath(content) {
  const xmlContent = parseSync(content);
  const mergedPath = xmlContent.children.filter(
    child => child.name === 'path' && child.attributes.d
  ).map(child => child.attributes.d).join('');

  return mergedPath;
}

// Create a name from its path according to our rule
function createName(filepath) {
  const basename = path.basename(filepath);
  const extPos = basename.lastIndexOf('.');
  let filename = basename;
  if (extPos > 0) {
    filename = basename.slice(0, extPos);
  }

  return `feather${filename.split('-').map(
    part => part.replace(/^\w/, (c) => c.toUpperCase())
  ).join('')}`;
}


// main script

const outputPath = process.argv.slice(2)[0]
if (!fs.existsSync(TEMP_FOLDER)) {
  fs.mkdirSync(TEMP_FOLDER)
}

downloadIcons()
  .then(icons => scaleIcons(icons))
  .then(icons => fixIcons(icons))
  .then(icons => {
    const writer = fs.createWriteStream(outputPath, { flag: 'w+' })
    writer.on('error', (error) => {
      console.log(`An error occured while writing to the file. Error: ${error.message}`);
    });
    writer.on('finish', () => {
      console.log(`All paths have been written to ${outputPath}`);
      fs.rmdirSync(TEMP_FOLDER, { recursive: true });
    });

    for (const { name, content } of icons) {
      writer.write(`export const ${name} =\n\t'${content}';\n\n`);
    }

    writer.end();
  });
