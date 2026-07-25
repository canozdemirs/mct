#!/bin/bash
# Downloads Memorial hospital images from memorial.com.tr CDN
# into public/images/hospitals/{slug}/1.jpg ... 4.jpg
# Image 1 = building/exterior cover photo, 2-4 = interior gallery photos
# Run this from the ROOT of your mct project (where "public" folder lives).

set -e

BASE="public/images/hospitals"

download() {
  local slug=$1
  shift
  local urls=("$@")
  mkdir -p "$BASE/$slug"
  local i=1
  for url in "${urls[@]}"; do
    echo "Downloading $slug image $i..."
    curl -sL "$url" -o "$BASE/$slug/$i.jpg"
    i=$((i+1))
  done
}

# Memorial Şişli — 1: building exterior, 2-4: interior
download memorial-sisli \
  "https://cdn.memorial.com.tr/files/Uploads/1/2/sisli-web_555x376px-1jpg_8844.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/d0fc43ac-3d60-4676-95ba-9c281b4a4eb9.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/e4a4ee0c-4da0-41e9-b3e1-a8a416f7a1c0.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/30ef6399-2503-4db6-905a-a2b1dd18f7ed.jpg"

# Memorial Ataşehir
download memorial-atasehir \
  "https://cdn.memorial.com.tr/files/Uploads/1/2/atasehir-web_555x376pxjpg_3e01.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/b56865bd-46d4-4198-a8ad-80a7b305d28f.JPG" \
  "https://cdn.memorial.com.tr/files/2015/11/9eb815e9-75dc-4906-9785-444791980ef2.JPG" \
  "https://cdn.memorial.com.tr/files/2015/11/0ae83760-b893-43ed-a6ea-323a32e54adf.JPG"

# Memorial Bahçelievler
download memorial-bahcelievler \
  "https://cdn.memorial.com.tr/files/Uploads/1/2/07e8576ddf624c14b75cd19ae8f2e0acjpg_dc13.jpg" \
  "https://cdn.memorial.com.tr/files/2018/2/ca57a4c8-088c-4a6b-96f1-d075b61c6495.jpg" \
  "https://cdn.memorial.com.tr/files/2018/2/fd7ca646-c5af-4258-818e-278f7b521a74.jpg" \
  "https://cdn.memorial.com.tr/files/2018/2/91a8f128-9dfe-4f00-b913-be67202063b4.jpg"

# Memorial Göztepe (new hospital — only 1 official photo exists, it IS the building cover)
download memorial-goztepe \
  "https://cdn.memorial.com.tr/files/Uploads/1/2/goztepe-web_555x376pxjpg_f72c.jpg"

# Memorial Ankara
download memorial-ankara \
  "https://cdn.memorial.com.tr/files/Uploads/1/2/ankara-web_555x376px-1jpg_243c.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/cfd714e2-bdd3-4adf-a73f-2a5b0861927f.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/59d0b38e-d31b-4f4c-b92a-389bccf0398e.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/68d7453a-7c69-417c-91c0-e73d41984464.jpg"

# Memorial Antalya
download memorial-antalya \
  "https://cdn.memorial.com.tr/files/Uploads/1/2/antalyahastanejpg_1417.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/bfb3af32-c63c-40f6-b94a-41e813968ab5.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/2d206f00-2395-4282-ac30-9f218fe99285.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/2f038ca9-3a2a-42b3-88c8-e39312ac47d8.jpg"

# Memorial Kayseri
download memorial-kayseri \
  "https://cdn.memorial.com.tr/files/Uploads/1/2/kayseri-web_555x376pxjpg_5199.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/5cbac27f-4ea1-419a-afbb-d1340ae615bb.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/e7be47a1-c47a-48f5-89e5-dcc72e540972.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/5dd73c75-62aa-42f5-a6ce-d3aa87b35947.jpg"

# Memorial Diyarbakır (filename literally says "bina" = building)
download memorial-diyarbakir \
  "https://cdn.memorial.com.tr/files/Uploads/1/2/memorialdiyarbakirbina570x37601minjpg_bde8.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/d91b50b2-43bf-405e-bcd6-dc7a89caf080.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/d99f9160-6d8f-4490-8500-45fac2cfefc4.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/195c4e5c-f4fd-4b77-bf6b-7045008fc397.jpg"

# Memorial Dicle
download memorial-dicle \
  "https://cdn.memorial.com.tr/files/Uploads/1/2/diclehastanejpg_04b9.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/9cb5ac8d-889a-4e84-8cec-b41925af04a7.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/45eb4e2f-5478-4a0a-b62e-964e8dd7d644.jpg" \
  "https://cdn.memorial.com.tr/files/2015/11/396f0f46-e646-437b-8adf-2fdc38a98237.jpg"

echo "Done. Images placed under $BASE/<slug>/"
echo "1.jpg = building/exterior cover photo, 2.jpg-4.jpg = interior gallery photos."
echo "NOTE: memorial-goztepe only has 1 image total (the building cover) — hospital just opened, no interior gallery yet."
