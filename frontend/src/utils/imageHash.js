/**
 * Komputasi dHash (Difference Hash) 64-bit di sisi Client / Browser
 * Menggunakan HTML5 Canvas untuk memproses sidik jari visual gambar secara instan (<20ms).
 */

export async function computeClientImageDHash(imageUrl) {
  if (!imageUrl || typeof window === 'undefined') return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    // Optimasi Cloudinary: Gunakan thumbnail kecil agar download instan
    let src = imageUrl;
    if (src.includes('res.cloudinary.com') && !src.includes('w_64')) {
      src = src.replace('/image/upload/', '/image/upload/w_64,h_64,c_fill/');
    }

    // Timeout safety 5 detik agar tidak menggantung jika gambar bermasalah
    const timer = setTimeout(() => resolve(null), 5000);

    img.onload = () => {
      clearTimeout(timer);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 9;
        canvas.height = 8;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 9, 8);
        const imgData = ctx.getImageData(0, 0, 9, 8).data;

        // Grayscale conversion (Luminance formula: 0.299 R + 0.587 G + 0.114 B)
        const gray = [];
        for (let i = 0; i < imgData.length; i += 4) {
          gray.push(0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2]);
        }

        // Hitung 64 bit dHash dengan membandingkan pasangan pixel horizontal
        let hash = '';
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const left = gray[row * 9 + col];
            const right = gray[row * 9 + col + 1];
            hash += left > right ? '1' : '0';
          }
        }
        resolve(hash);
      } catch {
        resolve(null);
      }
    };

    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };

    img.src = src;
  });
}

/**
 * Menghitung Hamming Distance antara 2 hash 64-bit di browser
 */
export function computeHammingDistance(hashA, hashB) {
  if (!hashA || !hashB || hashA.length !== hashB.length) return 64;
  let dist = 0;
  for (let i = 0; i < hashA.length; i++) {
    if (hashA[i] !== hashB[i]) dist++;
  }
  return dist;
}
