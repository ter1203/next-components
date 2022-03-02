import fsPromise from 'fs/promises';
import fs from 'fs';
import axios from 'axios';
import unzipper, { File, CentralDirectory } from 'unzipper';
import path from 'path';
const scaler = require('scale-that-svg');
const { parseSync } = require('xml-reader');
const Svg  = require('oslllo-svg-fixer/src/svg');

type IconBuffer = {
  name: string;
  content: string;
}

// Download the icons from github
/**
 * @param url Github url of the icons
 * @param regex RegExp for picking icon files only
 * @returns Unzipped icon files
 * @description Download the icon repo from github and extract icons
 */
export async function downloadIcons(url: string, regex: RegExp): Promise<File[]> {
  process.stdout.write('Downloading repo in zip ... ');
  const { data } = await axios.get(url, { responseType: 'arraybuffer' });
  console.log('done');

  process.stdout.write('Unzipping files ... ');
  const unzipped: CentralDirectory = await unzipper.Open.buffer(Buffer.from(data));
  const files = unzipped.files;
  console.log('done');

  const icons: File[] = []
  for (const file of files) {
    if (regex.test(file.path)) {
      icons.push(file);
    }
  }

  return icons;
}

/**
 * 
 * @param icons Icon files
 * @param size Desired viewbox of svg icon
 * @param prefix Naming prefix of svg icon
 * @returns IconBuffer array containing icons name and content
 * @description Resize the viewbox to the desired size
 */
export async function scaleIcons(icons: File[], size: number, prefix: string): Promise<IconBuffer[]> {
  process.stdout.write('Scaling icons ... ');
  const result = await Promise.all(icons.map(icon => scaleIcon(icon, size, prefix)));
  console.log('done');

  return result;
}

// Resize the viewbox of the svg icon
async function scaleIcon(icon: File, size: number, prefix: string): Promise<IconBuffer> {
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

  const name = getIconVariableNameFromPath(prefix, filepath);

  return { name, content: scaled };
}

/**
 * 
 * @param icons Icons buffer(name and content)
 * @param tempFolder Temporary folder to be used for temp storage
 * @returns Fixed icons buffer
 * @description If icons are using stroke, convert them to use fill
 */
export async function fixIcons(icons: IconBuffer[], tempFolder: string): Promise<IconBuffer[]> {
  process.stdout.write('Converting stroke to fill ... ')
  const result = await Promise.all(icons.map(icon => fixIcon(icon.name, icon.content, tempFolder)));
  console.log('done');

  return result;
}

// Convert paths of svg icon from stroke into fill
async function fixIcon(name: string, content: string, tempFolder: string): Promise<IconBuffer> {
  const filepath = `${tempFolder}/${name}.svg`
  await fsPromise.writeFile(filepath, content);
  const fixed = await new Svg(filepath).process();
  return {
    name, content: mergePath(fixed)
  }
}

/**
 * @param prefix
 * @param filepath
 * @returns New icon name to be exported.
 * @description If prefix is feather and filepath is video-off.svg, icon name would be featherVideoOff.
 */
function getIconVariableNameFromPath(prefix: string, filepath: string) {
  const basename = path.basename(filepath);
  const extPos = basename.lastIndexOf('.');
  let filename = basename;
  if (extPos > 0) {
    filename = basename.slice(0, extPos);
  }

  return `${prefix}${filename.split('-').map(
    (part: string) => part.replace(/^\w/, (c) => c.toUpperCase())
  ).join('')}`;
}

/**
 * @param content Svg content
 * @returns Merged path
 * @description If there are several paths in a svg, all paths are merged and returned
 */
function mergePath(content: any) {
  const xmlContent = parseSync(content);
  const mergedPath = xmlContent.children.filter(
    (child: any) => child.name === 'path' && child.attributes.d
  ).map((child: any) => child.attributes.d).join('');

  return mergedPath;
}

/**
 * @param icons Icons to output
 * @param outPath Output path
 * @description Write icon paths to the output path.
 */
export async function writeIcons(icons: any, outPath: string, comment = ''): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const writer = fs.createWriteStream(outPath, { flags: 'w+' });
    writer.on('finish', () => {
      resolve();
    });
  
    writer.on('error', (error: any) => {
      reject(`An error occured while writing to the file. Error: ${error.message}`);
    });

    writer.write(`${comment}\n`);
    for (const { name, content } of icons) {
      writer.write(`export const ${name} =\n  '${content}';\n\n`);
    }
  
    writer.end();
  })
}

/**
 * @param path File or folder path
 * @returns Whether the given path exists on the fs
 */
export async function exists(path: string): Promise<boolean> {
  try {
    await fsPromise.stat(path);
    return true;
  } catch (e) {
    return false;
  }
}
