const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, 'public', 'sklogo.jpeg');
const output192 = path.join(__dirname, 'public', 'icon-192x192.png');
const output512 = path.join(__dirname, 'public', 'icon-512x512.png');

async function createIcons() {
  try {
    await sharp(inputPath)
      .resize(192, 192, { fit: 'cover' })
      .toFile(output192);
      
    await sharp(inputPath)
      .resize(512, 512, { fit: 'cover' })
      .toFile(output512);
      
    console.log("Successfully created icon-192x192.png and icon-512x512.png");
  } catch (error) {
    console.error("Error creating icons:", error);
  }
}

createIcons();
