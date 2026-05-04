import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconPath = path.join(__dirname, '..', 'icon.jpg');
const androidResPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

// Icon sizes for different densities
const iconSizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
};

async function generateIcons() {
    console.log('Generating Android app icons...');

    if (!fs.existsSync(iconPath)) {
        console.error('icon.jpg not found in project root!');
        process.exit(1);
    }

    for (const [folder, size] of Object.entries(iconSizes)) {
        const outputDir = path.join(androidResPath, folder);

        // Create directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, 'ic_launcher.png');
        const outputPathRound = path.join(outputDir, 'ic_launcher_round.png');

        try {
            // Generate square icon
            await sharp(iconPath)
                .resize(size, size, {
                    fit: 'cover',
                    position: 'center'
                })
                .png()
                .toFile(outputPath);

            // Generate round icon with circle mask
            const circleMask = Buffer.from(
                `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" /></svg>`
            );

            await sharp(iconPath)
                .resize(size, size, {
                    fit: 'cover',
                    position: 'center'
                })
                .composite([{
                    input: circleMask,
                    blend: 'dest-in'
                }])
                .png()
                .toFile(outputPathRound);

            console.log(`✓ Generated ${folder}/ic_launcher.png (${size}x${size})`);
            console.log(`✓ Generated ${folder}/ic_launcher_round.png (${size}x${size})`);
        } catch (error) {
            console.error(`Error generating ${folder} icons:`, error.message);
        }
    }

    console.log('\n✅ All Android icons generated successfully!');
    console.log('You can now build your Android app with the new icon.');
}

generateIcons().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
