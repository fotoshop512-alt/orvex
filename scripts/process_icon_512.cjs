const sharp = require('sharp');
const path = require('path');

async function processIcon() {
    const inputPath = path.join(__dirname, '..', 'public', 'icon.png');
    const outputPath = path.join(__dirname, '..', 'public', 'icon_512_premium.png');
    const size = 512;
    const radius = Math.floor(size * 0.22); // 22% rounding

    try {
        // Create a rounded corner mask
        const mask = Buffer.from(
            `<svg><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" /></svg>`
        );

        await sharp(inputPath)
            .resize(size, size)
            .composite([{
                input: mask,
                blend: 'dest-in'
            }])
            .png()
            .toFile(outputPath);

        console.log(`Success! Premium rounded icon created at: ${outputPath}`);
    } catch (err) {
        console.error('Error processing icon:', err);
    }
}

processIcon();
