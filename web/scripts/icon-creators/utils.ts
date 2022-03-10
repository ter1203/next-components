import fsPromise from 'fs/promises';
import axios from 'axios';
import unzipper, { File, CentralDirectory } from 'unzipper';
import path from 'path';
const scaler = require('scale-that-svg');
const { parseSync } = require('xml-reader');
const Svg = require('oslllo-svg-fixer/src/svg');

const ICON_VIEWBOX_SIZE = 20;
const TEMP_FOLDER_FOR_SVG_CONVERT = './svg-temp';

type IconBuffer = {
  name: string;
  content: string;
}

export async function prepare() {
  if (!await exists(TEMP_FOLDER_FOR_SVG_CONVERT)) {
    await fsPromise.mkdir(TEMP_FOLDER_FOR_SVG_CONVERT);
  }
}

export async function finalize() {
  await fsPromise.rmdir(TEMP_FOLDER_FOR_SVG_CONVERT, { recursive: true });
}

/**
 * Download the icon repo from github and extract icons
 * @param url Github url of the icons
 * @param regex RegExp for picking icon files only
 * @returns Unzipped icon files
 */
export async function downloadIcons(url: string, regex: RegExp): Promise<File[]> {
  process.stdout.write('Downloading repo in zip ... ');
  const { data } = await axios.get(url, { responseType: 'arraybuffer' });
  process.stdout.write('done\n');

  process.stdout.write('Unzipping files ... ');
  const unzipped: CentralDirectory = await unzipper.Open.buffer(Buffer.from(data));
  const files = unzipped.files;
  process.stdout.write('done\n');

  const icons: File[] = []
  for (const file of files) {
    if (regex.test(file.path)) {
      icons.push(file);
    }
  }

  return icons;
}

/**
 * Resize the viewbox to the desired size
 * @param icons Icon files
 * @param size Desired viewbox of svg icons
 * @param prefix Prefix to name svg icons
 * @returns IconBuffer array containing icons name and content
 */
export async function scaleIcons(icons: File[], prefix: string): Promise<IconBuffer[]> {
  process.stdout.write('Scaling icons ... ');
  const result = await Promise.all(icons.map(icon => scaleIcon(icon, prefix)));
  process.stdout.write('done\n');

  return result;
}

// Resize the viewbox of the svg icon
async function scaleIcon(icon: File, prefix: string): Promise<IconBuffer> {
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

  const name = getIconVariableNameFromPath(prefix, filepath);

  return { name, content: scaled };
}

/**
 * Fix icons. If icons are using stroke, convert them to use fill
 * @param icons Icons buffer(name and content)
 * @param tempFolder Temporary folder to be used for temp storage
 * @returns Fixed icons buffer
 */
export async function convertStrokeIconsToFill(icons: IconBuffer[]): Promise<IconBuffer[]> {
  process.stdout.write('Converting stroke to fill ... ')
  const result = await Promise.all(icons.map(icon => convertStrokeIconToFill(icon.name, icon.content)));
  process.stdout.write('done\n');

  return result;
}

// Convert paths of svg icon from stroke into fill
async function convertStrokeIconToFill(name: string, content: string): Promise<IconBuffer> {
  const filepath = `${TEMP_FOLDER_FOR_SVG_CONVERT}/${name}.svg`
  await fsPromise.writeFile(filepath, content);
  const fixed = await new Svg(filepath).process();
  return {
    name, content: mergePath(fixed)
  }
}

/**
 * Get icon name from its path. If prefix is feather and filepath is video-off.svg,
 * icon name would be featherVideoOff.
 * @param prefix
 * @param filepath
 * @returns New icon name to be exported.
 */
function getIconVariableNameFromPath(prefix: string, filepath: string) {
  const basename = path.basename(filepath);
  const extentionPosition = basename.lastIndexOf('.');
  let filename = basename;
  if (extentionPosition > 0) {
    filename = basename.slice(0, extentionPosition);
  }

  return `${prefix}${filename.split('-').map(
    (part: string) => part.replace(/^\w/, (c) => c.toUpperCase())
  ).join('')}`;
}

/**
 * Merge all paths in a svg into one path
 * @param content Svg content
 * @returns Merged path
 */
function mergePath(content: any) {
  const xmlContent = parseSync(content);
  const mergedPath = xmlContent.children.filter(
    (child: any) => child.name === 'path' && child.attributes.d
  ).map((child: any) => child.attributes.d).join('');

  return mergedPath;
}

/**
 * Write icon paths to the output path.
 * @param icons Icons to output
 * @param outPath Output path
 */
export async function writeIcons(icons: any, outPath: string, comment = ''): Promise<void> {
  const writer = await fsPromise.open(outPath, 'w+');
  await writer.write(`${comment}\n\n`);

  for (const { name, content } of icons) {
    await writer.write(`export const ${name} =\n  '${content}';\n\n`);
  }

  await writer.close();
}

/**
 * @param path File or folder path
 * @returns Whether the given path exists on the file system
 */
async function exists(path: string): Promise<boolean> {
  try {
    await fsPromise.stat(path);
    return true;
  } catch (e) {
    return false;
  }
}
