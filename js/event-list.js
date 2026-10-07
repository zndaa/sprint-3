import { events } from "./data.js";

function formatTarih(tarihStr) {
  const [gun, ay, yil] = tarihStr.split("-");
  const dateObj = new Date(yil, ay - 1, gun);
  return dateObj.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// Slayttaki kart tasarımı: Tarih, Yer, Kontenjan, Açıklama ve "Detayları gör"
function createCard(event) {
  return `
    <article class="kart">
      <div class="kart-ust-cizgi"></div>
      <h3>${event.title}</h3>
      <p class="kart-kategori">${event.category}</p>
      <div class="kart-detaylar">
        <p><strong>Tarih:</strong> ${formatTarih(event.date)}, ${event.time}</p>
        <p><strong>Yer:</strong> ${event.location}</p>
        <p><strong>Kontenjan:</strong> ${event.capacity} kişi</p>
      </div>
      <p class="kart-aciklama">${event.description}</p>
      <a href="etkinlik-detay.html?id=${event.id}" class="kart-detay-link">Detayları gör</a>
    </article>
  `;
}

const list = document.querySelector("#etkinlik-listesi");
const arama = document.querySelector("#arama");
const kategoriFiltre = document.querySelector("#kategori-filtre");
const filtreFormu = document.querySelector("#filtre-formu");
const sonucSatiri = document.querySelector("#sonuc");

function render(dizi) {
  if (!list) return;

  if (dizi.length === 0) {
    list.innerHTML = '<p class="bos-mesaj">Aradığınız kriterlere uygun etkinlik bulunamadı.</p>';
    return;
  }

  list.innerHTML = dizi.map(createCard).join("");
}

// Kategorileri dinamik ekleme (varsa)
if (kategoriFiltre) {
  const kategoriler = [...new Set(events.map(e => e.category))];
  kategoriler.forEach(kat => {
    const option = document.createElement("option");
    option.value = kat;
    option.textContent = kat;
    kategoriFiltre.appendChild(option);
  });
}

function filtrele() {
  const aranan = arama ? arama.value.toLocaleLowerCase("tr-TR").trim() : "";
  const secilenKategori = kategoriFiltre ? kategoriFiltre.value : "";

  const sonuc = events.filter((e) => {
    const baslik = e.title.toLocaleLowerCase("tr-TR");
    const aciklama = e.description.toLocaleLowerCase("tr-TR");
    const metinUyuyor = !aranan || baslik.includes(aranan) || aciklama.includes(aranan);
    const kategoriUyuyor = !secilenKategori || e.category === secilenKategori;

    return metinUyuyor && kategoriUyuyor;
  });

  render(sonuc);

  if (sonucSatiri) {
    sonucSatiri.textContent = `${sonuc.length} etkinlik listeleniyor.`;
  }
}

if (arama) arama.addEventListener("input", filtrele);
if (kategoriFiltre) kategoriFiltre.addEventListener("change", filtrele);

if (filtreFormu) {
  filtreFormu.addEventListener("submit", (e) => e.preventDefault());
}

// Ana sayfa için limit kontrolü ve tarihe göre sıralama
if (list && list.dataset.limit) {
  const yaklasan = [...events]
    .sort((a, b) => {
      const formatA = a.date.split("-").reverse().join("-");
      const formatB = b.date.split("-").reverse().join("-");
      return formatA.localeCompare(formatB);
    })
    .slice(0, Number(list.dataset.limit));

  render(yaklasan);
} else {
  render(events);
  if (sonucSatiri) {
    sonucSatiri.textContent = `${events.length} etkinlik listeleniyor.`;
  }
}