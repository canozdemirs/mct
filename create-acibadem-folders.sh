#!/bin/bash
# Creates empty folders for all 15 Acıbadem hospital images.
# Run this from the ROOT of your mct project (where "public" folder lives).
# After running, manually save images into each folder as:
#   1.jpg = hospital building / exterior photo
#   2.jpg, 3.jpg, 4.jpg = interior photos (lobby, rooms, corridors, etc.)

set -e

BASE="public/images/hospitals"

SLUGS=(
  "acibadem-adana"
  "acibadem-ankara"
  "acibadem-atasehir"
  "acibadem-bakirkoy"
  "acibadem-bodrum"
  "acibadem-bursa"
  "acibadem-eskisehir"
  "acibadem-fulya"
  "acibadem-international"
  "acibadem-kadikoy"
  "acibadem-kayseri"
  "acibadem-kocaeli"
  "acibadem-kozyatagi"
  "acibadem-maslak"
  "acibadem-taksim"
)

for slug in "${SLUGS[@]}"; do
  mkdir -p "$BASE/$slug"
  echo "Created: $BASE/$slug/ (add 1.jpg, 2.jpg, 3.jpg, 4.jpg here)"
done

echo ""
echo "Done. Folders ready under $BASE/<slug>/"
echo "1.jpg = building/exterior photo. 2-4.jpg = interior photos."
