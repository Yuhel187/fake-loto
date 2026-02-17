export async function extractDominantColor(imageSrc: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageSrc;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                resolve("#D32F2F"); // Default fallback
                return;
            }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Sample center 50% of image to avoid borders/backgrounds
            const startX = Math.floor(img.width * 0.25);
            const startY = Math.floor(img.height * 0.25);
            const sampleWidth = Math.floor(img.width * 0.5);
            const sampleHeight = Math.floor(img.height * 0.5);

            const imageData = ctx.getImageData(startX, startY, sampleWidth, sampleHeight);
            const data = imageData.data;

            let r = 0, g = 0, b = 0;
            const count = data.length / 4;

            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
            }

            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);

            // Convert to Hex
            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
            resolve(hex);
        };

        img.onerror = () => {
            console.error("Could not load image for color extraction");
            resolve("#D32F2F");
        };
    });
}
