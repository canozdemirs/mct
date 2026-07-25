#!/usr/bin/env node
/**
 * scrape-medipol-media.mjs
 *
 * Medipol'ün 11 hastane sayfasından:
 *   - galeri görsellerinin tam URL'lerini (UUID + VersionId dahil)
 *   - hero görselini
 *   - adres / telefon / faks
 * çeker, görselleri indirir ve hospitals.ts'e yapıştırılabilir JSON üretir.
 *
 * KULLANIM (proje kökünde):
 *   node scripts/scrape-medipol-media.mjs
 *
 * ÇIKTI:
 *   public/hospitals/medipol/<slug>/01.jpg ...
 *   medipol-media.json
 *
 * Node 18+ gerekiyor (yerleşik fetch). Harici bağımlılık yok.
 *
 * NOT: Görsellerin telifi Medipol'e ait. Bu script indirme işini
 * otomatikleştirir, kullanım iznini vermez — partner anlaşmanda
 * görsel kullanım maddesi olduğundan emin ol.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const BASE = "https://medipol.com.tr/hastanelerimiz";
const OUT_DIR = "public/images/hospitals";

// hospitals.ts slug -> klasör adı (public/images/hospitals/ altında)
const SLUG_TO_FOLDER = {
  "medipol-mega-university-hospital": "medipol-mega",
  "medipol-istanbul-hospital": "medipol-istanbul",
  "medipol-bahcelievler-hospital": "medipol-bahcelievler",
  "medipol-acibadem-regional-hospital": "medipol-acibadem",
  "medipol-esenler-university-hospital": "medipol-esenler",
  "medipol-camlica-university-hospital": "medipol-camlica",
  "medipol-pendik-university-hospital": "medipol-pendik",
  "medipol-vatan-university-hospital": "medipol-vatan",
  "medipol-sefakoy-university-hospital": "medipol-sefakoy",
  "medipol-unkapani-university-hospital": "medipol-unkapani",
  "medipol-ankara-university-hospital": "medipol-ankara",
};

// hospitals.ts slug -> Medipol sayfa yolu
const HOSPITALS = {
  "medipol-mega-university-hospital": "medipol-mega",
  "medipol-istanbul-hospital": "medipol-kosuyolu",
  "medipol-bahcelievler-hospital": "bahcelievler-medipol-hastanesi",
  "medipol-acibadem-regional-hospital": "medipol-acibadem-bolge-hastanesi",
  "medipol-esenler-university-hospital": "medipol-esenler",
  "medipol-camlica-university-hospital": "medipol-camlica",
  "medipol-pendik-university-hospital": "medipol-pendik",
  "medipol-vatan-university-hospital": "medipol-vatan",
  "medipol-sefakoy-university-hospital": "medipol-sefakoy",
  "medipol-unkapani-university-hospital": "medipol-unkapani",
  "medipol-ankara-university-hospital":
    "medipol-universitesi-ankara-dis-hastanesi",
};

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Galeri görselleri: media.medipol.com.tr'de /assets/s3fs-public/ altında,
 *  /styles/ İÇERMEYEN (yani orijinal, yeniden boyutlandırılmamış) dosyalar. */
function extractGallery(html) {
  const re =
    /https:\/\/media\.medipol\.com\.tr\/assets\/s3fs-public\/(?!styles\/)[^\s"'<>\\)]+\.(?:jpg|jpeg|png|webp)(?:\?[^\s"'<>\\)]*)?/gi;
  const seen = new Set();
  for (const m of html.matchAll(re)) {
    seen.add(m[0].replaceAll("&amp;", "&"));
  }
  return [...seen];
}

/** Hero: og:image meta etiketi. */
function extractHero(html) {
  const m = html.match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
  );
  return m ? m[1].replaceAll("&amp;", "&") : null;
}

/** "Neredeyiz?" bloğundaki adres / telefon / faks. */
function extractContact(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");

  const grab = (label, stop) => {
    const re = new RegExp(`${label}\\s+(.+?)\\s+(?=${stop})`, "i");
    const m = text.match(re);
    return m ? m[1].trim() : null;
  };

  return {
    address: grab("Adres", "Telefon|Faks|E-Posta|Kroki"),
    phone: grab("Telefon", "Faks|E-Posta|Kroki|Adres"),
    fax: grab("Faks", "E-Posta|Kroki|Adres|Telefon"),
  };
}

async function getHtml(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.text();
}

async function download(url, destPath) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buf);
  return buf.length;
}

async function main() {
  const result = {};

  for (const [slug, path] of Object.entries(HOSPITALS)) {
    const url = `${BASE}/${path}`;
    process.stdout.write(`\n→ ${slug}\n  ${url}\n`);

    let html;
    try {
      html = await getHtml(url);
    } catch (err) {
      console.error(`  ✗ sayfa alınamadı: ${err.message}`);
      result[slug] = { error: String(err.message) };
      continue;
    }

    const gallery = extractGallery(html);
    const hero = extractHero(html);
    const contact = extractContact(html);

    console.log(`  ${gallery.length} galeri görseli bulundu`);
    if (contact.address) console.log(`  adres: ${contact.address}`);

    const folder = SLUG_TO_FOLDER[slug] ?? slug;
    const dir = join(OUT_DIR, folder);
    await mkdir(dir, { recursive: true });

    const localPaths = [];
    for (const [i, imgUrl] of gallery.entries()) {
      const ext = (imgUrl.split("?")[0].match(/\.(\w+)$/)?.[1] || "jpg").toLowerCase();
      const name = `${i + 1}.${ext}`;
      const dest = join(dir, name);
      try {
        const bytes = await download(imgUrl, dest);
        localPaths.push(`/images/hospitals/${folder}/${name}`);
        console.log(`    ✓ ${name} (${Math.round(bytes / 1024)} KB)`);
      } catch (err) {
        console.error(`    ✗ ${name}: ${err.message}`);
      }
      await sleep(300); // nazik ol
    }

    result[slug] = {
      sourceUrl: url,
      hero,
      ...contact,
      remoteGallery: gallery,
      images: localPaths, // hospitals.ts'teki `images` alanına bu gider
    };

    await sleep(1000);
  }

  await writeFile("medipol-media.json", JSON.stringify(result, null, 2));
  console.log(`\n✓ medipol-media.json yazıldı`);
  console.log(`✓ görseller ${OUT_DIR}/ altında`);
  console.log(
    `\nSonraki adım: görselleri WebP'ye çevir (sharp veya squoosh),` +
      ` sonra JSON'daki images/address alanlarını hospitals.ts'e aktar.`
  );
}

main().catch((err) => {
  console.error("\nHATA:", err);
  process.exit(1);
});
