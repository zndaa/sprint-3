import { events } from "./data.js";

const form = document.querySelector("#etkinlik-formu");
const formMesaj = document.querySelector("#form-mesaj");
const guncelleUyari = document.querySelector("#guncelle-uyari");
const guncelleKapsayici = document.querySelector("#guncelle-form-kapsayici");

// Sayfa URL parametresi (?id=...)
const params = new URLSearchParams(window.location.search);
const editId = params.get("id");

// GÜNCELLEME SAYFASI KONTROLÜ
if (window.location.pathname.includes("etkinlik-guncelle.html") || guncelleUyari) {
  const currentEvent = editId ? events.find((e) => e.id === editId) : null;

  if (!currentEvent) {
    // Slayt 7 Sağ Taraf: id yoksa veya geçersizse formu gizle, uyarı kutusunu göster
    if (guncelleKapsayici) guncelleKapsayici.style.display = "none";
    if (guncelleUyari) {
      guncelleUyari.innerHTML = `
        <div style="border: 1px solid #f87171; background-color: #fef2f2; color: #b91c1c; padding: 1.2rem; border-radius: 6px; font-size: 0.9rem; line-height: 1.5; margin-top: 1rem;">
          Güncellenecek etkinlik seçilmedi. Önce listeden bir etkinlik seçin, detay sayfasındaki "Bu etkinliği güncelle" butonunu kullanın.
        </div>
        <div style="margin-top: 1.2rem;">
          <a href="etkinlikler.html" class="btn-kaydet" style="text-decoration: none; display: inline-block;">Etkinliklere git</a>
        </div>
      `;
    }
  } else if (form) {
    // Slayt 7 Sol Taraf: Etkinlik bulundu, formu doldur
    form.elements["ad"].value = currentEvent.title || "";
    form.elements["kategori"].value = currentEvent.category || "";
    
    // GG-AA-YYYY formatını input type="date" için YYYY-AA-GG formatına çevirelim
    if (currentEvent.date) {
      const parcalar = currentEvent.date.split("-");
      if (parcalar.length === 3) {
        form.elements["tarih"].value = `${parcalar[2]}-${parcalar[1]}-${parcalar[0]}`;
      } else {
        form.elements["tarih"].value = currentEvent.date;
      }
    }

    form.elements["saat"].value = currentEvent.time || "";
    form.elements["yer"].value = currentEvent.location || "";
    form.elements["kapasite"].value = currentEvent.capacity || "";
    form.elements["aciklama"].value = currentEvent.description || "";
  }
}

// FORM DOĞRULAMA VE GÖNDERME
function hatalariTemizle() {
  const hataSpanlari = form.querySelectorAll(".hata-mesaj");
  hataSpanlari.forEach((span) => span.textContent = "");

  const tumAlanlar = form.querySelectorAll("input, select, textarea");
  tumAlanlar.forEach((alan) => alan.removeAttribute("aria-invalid"));

  if (formMesaj) formMesaj.innerHTML = "";
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hatalariTemizle();

    const fd = new FormData(form);
    const data = {
      id: editId || `event-${events.length + 1}`,
      title: (fd.get("ad") || "").trim(),
      category: fd.get("kategori") || "",
      date: (fd.get("tarih") || "").trim(),
      time: (fd.get("saat") || "").trim(),
      location: (fd.get("yer") || "").trim(),
      capacity: fd.get("kapasite") !== "" ? Number(fd.get("kapasite")) : 0,
      description: (fd.get("aciklama") || "").trim()
    };

    const errors = {};

    if (data.title.length < 3) errors.ad = "Etkinlik adı en az 3 karakter olmalı.";
    if (!data.category) errors.kategori = "Bir kategori seçin.";
    if (!data.date) errors.tarih = "Tarih seçin.";
    if (!data.time) errors.saat = "Saat seçin.";
    if (!data.location) errors.yer = "Yer bilgisini yazın.";
    if (data.capacity && (data.capacity < 1 || data.capacity > 1000)) {
      errors.kapasite = "Kontenjan 1-1000 arasında olmalı.";
    }

    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      errorKeys.forEach((key) => {
        const span = document.querySelector(`#${key}-hata`);
        if (span) span.textContent = errors[key];

        const inputAlan = form.elements[key];
        if (inputAlan) inputAlan.setAttribute("aria-invalid", "true");
      });
      return;
    }

    // Başarılı JSON çıktısı
    if (formMesaj) {
      formMesaj.innerHTML = `
        <div class="basari-kutu">
          <p>Etkinlik ${editId ? "bilgileri güncellendi" : "oluşturuldu"} (bu sprintte kaydedilmez):</p>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
      `;
    }
  });
}