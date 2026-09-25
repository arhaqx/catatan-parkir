const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const sharp = require('sharp');
const {
  calculateDHash,
  hammingDistance
} = require('../utils/photoVerification');

describe('Photo Verification & Perceptual Hash Utility', () => {
  describe('hammingDistance', () => {
    test('mengembalikan 0 untuk dua hash identik', () => {
      const hash = '1010101010101010101010101010101010101010101010101010101010101010';
      assert.equal(hammingDistance(hash, hash), 0);
    });

    test('menghitung perbedaan bit dengan benar', () => {
      const hashA = '11110000';
      const hashB = '11100001'; // 2 perbedaan (indeks 3 dan 7)
      assert.equal(hammingDistance(hashA, hashB), 2);
    });

    test('mengembalikan 64 jika panjang string tidak sama atau tidak valid', () => {
      assert.equal(hammingDistance('1010', '101010'), 64);
      assert.equal(hammingDistance(null, '101010'), 64);
      assert.equal(hammingDistance('101010', undefined), 64);
    });
  });

  describe('calculateDHash', () => {
    test('mengembalikan null jika input bukan Buffer yang valid', async () => {
      assert.equal(await calculateDHash(null), null);
      assert.equal(await calculateDHash('not-a-buffer'), null);
      assert.equal(await calculateDHash(Buffer.from('corrupted-data')), null);
    });

    test('menghasilkan hash 64-karakter biner dari gambar valid', async () => {
      // Buat gambar buatan sederhana 20x20 pixel menggunakan Sharp
      const buffer = await sharp({
        create: {
          width: 20,
          height: 20,
          channels: 3,
          background: { r: 50, g: 150, b: 250 }
        }
      }).png().toBuffer();

      const hash = await calculateDHash(buffer);
      assert.ok(hash);
      assert.equal(typeof hash, 'string');
      assert.equal(hash.length, 64);
      assert.match(hash, /^[01]{64}$/);
    });
  });
});
