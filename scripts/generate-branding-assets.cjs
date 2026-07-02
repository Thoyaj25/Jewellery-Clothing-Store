#!/usr/bin/env node

/**
 * Branding Assets Generator
 * 
 * This script converts SVG branding files to PNG format.
 * 
 * Usage:
 *   node scripts/generate-branding-assets.cjs
 * 
 * Requirements:
 *   npm install sharp
 * 
 * Or use online tools:
 *   https://cloudconvert.com/svg-to-png
 */

const fs = require("fs");
const path = require("path");

console.log("🎨 Ultimate Collections - Branding Assets Generator\\n");

// Check if sharp is installed
try {
  const sharp = require("sharp");
  console.log("✅ Sharp found! Starting conversion...\\n");
  generatePNGs(sharp);
} catch (err) {
  console.log("⚠️  Sharp not found. Install it to auto-generate PNGs:\\n");
  console.log("   npm install --save-dev sharp\\n");
  console.log("📋 Manual Conversion Instructions:\\n");
  console.log("1. Open: https://cloudconvert.com/svg-to-png");
  console.log("2. Upload these files:");
  console.log("   - app/opengraph-image.svg → output: opengraph-image.png");
  console.log("   - app/twitter-image.svg → output: twitter-image.png");
  console.log("3. Place PNG files in app/ folder\\n");
  
  console.log("🔧 Alternative - Using ImageMagick (if installed):\\n");
  console.log("   convert app/opengraph-image.svg -resize 1200x630 app/opengraph-image.png");
  console.log("   convert app/twitter-image.svg -resize 1200x630 app/twitter-image.png\\n");
  
  process.exit(1);
}

async function generatePNGs(sharp) {
  const basePath = path.join(__dirname, "..", "app");
  
  const conversions = [
    {
      input: "opengraph-image.svg",
      output: "opengraph-image.png",
      width: 1200,
      height: 630,
      description: "Open Graph Image (1200×630)",
    },
    {
      input: "twitter-image.svg",
      output: "twitter-image.png",
      width: 1200,
      height: 630,
      description: "Twitter Card Image (1200×630)",
    },
    {
      input: "icon.svg",
      output: "icon.png",
      width: 512,
      height: 512,
      description: "Icon (512×512)",
    },
    {
      input: "icon.svg",
      output: "apple-icon.png",
      width: 180,
      height: 180,
      description: "Apple Icon (180×180)",
    },
  ];

  for (const conversion of conversions) {
    const inputPath = path.join(basePath, conversion.input);
    const outputPath = path.join(basePath, conversion.output);

    if (!fs.existsSync(inputPath)) {
      console.log(`❌ ${conversion.input} not found`);
      continue;
    }

    try {
      await sharp(inputPath)
        .resize(conversion.width, conversion.height, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 1 },
        })
        .png({ quality: 90 })
        .toFile(outputPath);

      const fileSize = (fs.statSync(outputPath).size / 1024).toFixed(2);
      console.log(`✅ ${conversion.description}`);
      console.log(`   Output: ${conversion.output} (${fileSize} KB)\\n`);
    } catch (error) {
      console.error(`❌ Failed to convert ${conversion.input}:`, error.message);
    }
  }

  console.log("\\n🎉 Branding assets generated successfully!");
  console.log("\\n📋 Next steps:");
  console.log("1. Run: npm run build");
  console.log("2. Test: npm run dev");
  console.log("3. Verify favicon appears in browser tab");
  console.log("4. Test social preview: https://developers.facebook.com/tools/debug/");
}
