const sharp = require('sharp');

async function removeBackground() {
    const inputPath = process.argv[2];
    const outputPath = process.argv[3];

    try {
        await sharp(inputPath)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true })
            .then(({ data, info }) => {
                const { width, height, channels } = info;
                // Create a new buffer for the output
                const outData = Buffer.alloc(width * height * 4);

                for (let i = 0; i < data.length; i += channels) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    // Improved threshold for "white-ish" background
                    // Check if it's very bright (close to white)
                    if (r > 240 && g > 240 && b > 240) {
                        outData[i] = r;
                        outData[i + 1] = g;
                        outData[i + 2] = b;
                        outData[i + 3] = 0; // Transparent
                    } else {
                        outData[i] = r;
                        outData[i + 1] = g;
                        outData[i + 2] = b;
                        outData[i + 3] = 255; // Opaque
                    }
                }

                return sharp(outData, { raw: { width, height, channels: 4 } })
                    .png()
                    .toFile(outputPath);
            });
        console.log('Background removed successfully');
    } catch (err) {
        console.error('Error processing image:', err);
    }
}

removeBackground();
