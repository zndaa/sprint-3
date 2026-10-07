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

const container = document.querySelector("#detay");
const baslik = document.querySelector("#baslik");

const id = new URLSearchParams(location.search).get("id");
const event = events.find((e) => e.id === id);

if (!event) {
  if (container) {
    container.innerHTML = `
      <div style="background-color: #fde8e8; color: #9b1c1c; border: 1px solid #f8b4b4; padding: 1.2rem; border-radius: 8px; margin-top: 1rem;">
        <h2>Etkinlik Bulunamadı</h2>
        <p>Aradığınız etkinlik bulunamadı veya geçersiz bir bağlantı kullandınız.</p>
        <a href="etkinlikler.html" style="color: #9b1c1c; font-weight: bold;">← Listeye dön</a>
      </div>
    `;
  }
} else {
  // Sekme ve başlık
  document.title = event.title;
  if (baslik) {
    baslik.textContent = event.title;
  }

  // Slayttaki düzen: Afiş solda, Künye sağda, Açıklama ve butonlar altta
  if (container) {
    container.innerHTML = `
      <div class="detay-kapsayici">
        <div class="detay-ust-izgara">
          
          <!-- Sol Taraf: Afiş -->
          <figure class="afis-alani">
            <div class="afis-cerceve">
              <div class="afis-kutu">
                <h3>${event.title}</h3>
                <p class="afis-yil">2026</p>
                <p class="afis-alt-bilgi">${formatTarih(event.date)} · ${event.location}</p>
              </div>
            </div>
            <figcaption>${event.title} afişi</figcaption>
          </figure>

          <!-- Sağ Taraf: Künye Kutusu -->
          <section class="kunye-kutusu">
            <h3>Etkinlik Künyesi</h3>
            <table class="kunye-tablo">
              <tr>
                <td><strong>Tarih</strong></td>
                <td>${formatTarih(event.date)}, ${event.time}</td>
              </tr>
              <tr>
                <td><strong>Yer</strong></td>
                <td>${event.location}</td>
              </tr>
              <tr>
                <td><strong>Kategori</strong></td>
                <td>${event.category}</td>
              </tr>
              <tr>
                <td><strong>Kontenjan</strong></td>
                <td>${event.capacity} kişi</td>
              </tr>
            </table>
          </section>

        </div>

        <!-- Alt Taraf: Açıklama ve Butonlar -->
        <section class="aciklama-bolumu">
          <h3>Açıklama</h3>
          <p>${event.description}</p>

          <div class="detay-buton-grubu">
            <a href="etkinlikler.html" class="btn-detay-don">← Listeye dön</a>
            <a href="etkinlik-guncelle.html?id=${event.id}" class="btn-detay-guncelle">Bu etkinliği güncelle</a>
          </div>
        </section>
      </div>
    `;
  }
}