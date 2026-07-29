/**
 * remaining-addresses.ts
 *
 * lib/hospitals.ts'te address alanı eksik kalan kayıtlar için adresler.
 * Kaynak: Google Places (Temmuz 2026) + Memorial kurumsal sitesi.
 *
 * ⚠️ ÜÇ VERİ UYUŞMAZLIĞI TESPİT EDİLDİ — aşağıdaki DISTRICT_FIXES bölümüne bak.
 * Bunlar sadece adres eksikliği değil, mevcut kayıtlarda YANLIŞ ilçe bilgisi.
 */

export const REMAINING_ADDRESSES: Record<string, string> = {
  // ── MEMORIAL ────────────────────────────────────────────
  "memorial-sisli-hospital":
    "Kaptan Paşa Mah., Piyale Paşa Bulvarı, Okmeydanı Cd. No:4, 34384 Şişli, Istanbul",

  "memorial-atasehir-hospital":
    "Küçükbakkalköy Mah., Vedat Günyol Cd. No:28-30, 34750 Ataşehir, Istanbul",

  "memorial-bahcelievler-hospital":
    "Bahçelievler Mah., Adnan Kahveci Blv. No:227, 34180 Bahçelievler, Istanbul",

  "memorial-goztepe-hospital":
    "Yeni Sahra Mah., Karaman Cd. No:1, 34634 Ataşehir, Istanbul",

  "memorial-ankara-hospital":
    "Balgat Mah., Mevlana Bulvarı, 1422. Sk. No:4, 06520 Çankaya, Ankara",

  "memorial-antalya-hospital":
    "Zafer Mah., Yıldırım Beyazıt Cd. No:91, 07025 Kepez, Antalya",

  "memorial-kayseri-hospital":
    "Örnekevler Mah., Salih Avgun Paşa Cd., Temizel Sk. No:13, 38010 Kocasinan, Kayseri",

  "memorial-diyarbakir-hospital":
    "Peyas Mah., Fırat Blv. No:12, 21070 Kayapınar, Diyarbakır",

  "memorial-dicle-hospital":
    "Fırat Mah., Urfa Yolu 3. Km, 507. Sk. No:150, 21220 Kayapınar, Diyarbakır",

  // ── ACIBADEM ────────────────────────────────────────────
  "acibadem-international-hospital":
    "Yeşilköy Mah., Yeşilköy İstanbul Cd. No:82, 34149 Bakırköy, Istanbul",

  "acibadem-bursa-hospital":
    "Barış Mah., Sümer Sk. No:1-7, 16210 Nilüfer, Bursa",

  "acibadem-taksim-hospital":
    "İnönü Mah., Nizamiye Cd. No:1-9, 34373 Şişli, Istanbul",

  // ── KOÇ ─────────────────────────────────────────────────
  "koc-university-hospital":
    "Topkapı, Davutpaşa Cd. No:4, 34010 Zeytinburnu, Istanbul",
};

/**
 * ⚠️ DISTRICT DÜZELTMELERİ
 *
 * Adres araması sırasında mevcut kayıtlarda YANLIŞ ilçe bilgisi bulundu.
 * Bunlar kart ve detay sayfalarında görünüyor — düzeltilmeli.
 */
export const DISTRICT_FIXES: Record<string, { from: string; to: string; note: string }> = {
  "memorial-goztepe-hospital": {
    from: "Göztepe / Kadıköy (muhtemel mevcut değer)",
    to: "Ataşehir",
    note:
      "Hastane adı 'Göztepe' ama fiziksel adresi Yeni Sahra, ATAŞEHİR. " +
      "Kadıköy/Göztepe değil. İsim tarihsel, konum farklı.",
  },
  "acibadem-taksim-hospital": {
    from: "Beyoğlu (muhtemel mevcut değer)",
    to: "Şişli",
    note:
      "Hastane adı 'Taksim' ama adresi İnönü Mah., Nizamiye Cd., ŞİŞLİ. " +
      "Beyoğlu değil. Taksim'e yakın ama idari olarak Şişli.",
  },
  "acibadem-international-hospital": {
    from: "Yeşilköy (kontrol et)",
    to: "Bakırköy",
    note:
      "Yeşilköy mahallesi BAKIRKÖY ilçesine bağlı. district alanı " +
      "'Yeşilköy, Bakırköy' olmalı — sadece 'Yeşilköy' yetersiz.",
  },
};

/**
 * ⛔ ÇÖZÜLEMEYEN: acibadem-kocaeli-hospital
 *
 * Google Places aramasında "Acıbadem Kocaeli Hastanesi" diye bir kayıt
 * BULUNAMADI — arama alakasız bir hastane (Aktif Hospital Kocaeli) döndürdü.
 *
 * Bu kayıt zaten şüpheliydi:
 *   - overview'ı 177 karakterle tüm 38 kaydın en kısası
 *   - mapEmbedUrl'inde kapı numarası yok ("Yeni Mahalle İnkılap Cad.")
 *
 * İki ihtimal:
 *   1. Hastane kapanmış / el değiştirmiş / isim değiştirmiş
 *   2. Kayıt en baştan hatalı girilmiş
 *
 * ÖNERİ: Acıbadem ile teyit et. Halen ağında değilse kaydı listeden
 * çıkar — var olmayan bir hastaneyi listelemek, doğrulanmamış
 * akreditasyon rozetinden daha büyük bir güven riski.
 * Teyit edilene kadar yayına almamayı düşün.
 */
