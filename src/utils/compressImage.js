/**
 * compressImage - Compresses an image file using Canvas API
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File|string>} - Compressed file or base64
 */
const compressImage = (file, { maxWidth = 1200, maxHeight = 1200, quality = 0.7, outputType = "file" } = {}) => {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith("image/")) {
            return resolve(file);
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                // Calculate aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                if (outputType === "base64") {
                    resolve(canvas.toDataURL(file.type, quality));
                } else {
                    canvas.toBlob(
                        (blob) => {
                            const compressedFile = new File([blob], file.name, {
                                type: file.type,
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        },
                        file.type,
                        quality
                    );
                }
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

export default compressImage;
