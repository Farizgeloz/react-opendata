import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "react-lazy-load-image-component/src/effects/blur.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { api_url_satudata,api_url_satuadmin } from "../../api/axiosConfig";

export default function ImageSlider({ dataku }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenSrc, setFullscreenSrc] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null); // 🔹 untuk preview PDF

  const images = [
    dataku?.presignedUrl_a,
    dataku?.presignedUrl_b,
    dataku?.presignedUrl_c,
    dataku?.presignedUrl_d,
  ].filter(Boolean);

  if (!dataku) return <p className="text-center text-muted">Memuat gambar...</p>;
  if (!images.length) return <p className="text-center text-muted">Tidak ada gambar.</p>;

  // 🔹 Unduh semua gambar ZIP
  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const folder = zip.folder("gambar_infografik");
    for (let i = 0; i < images.length; i++) {
      const response = await fetch(images[i]);
      const blob = await response.blob();
      folder.file(`gambar_${i + 1}.jpg`, blob);
    }
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${dataku?.title || "infografik"}_gambar.zip`);
    setDownloadvisitor();
  };

  // 🔹 Buat PDF dan tampilkan preview
  const handlePreviewPDF = async () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 20;
    const usableWidth = pageWidth - marginX * 2;

    const title = dataku?.title || "Dataset Gambar";
    const sub_title = dataku?.sub_title || "";
    const content = dataku?.content || "";

    // 🔸 Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const splitTitle = doc.splitTextToSize(title, usableWidth);
    doc.text(splitTitle, pageWidth / 2, 20, { align: "center" });

    // 🔸 Subtitle
    if (sub_title) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "italic");
      const splitSub = doc.splitTextToSize(sub_title, usableWidth);
      doc.text(splitSub, pageWidth / 2, 45, { align: "center" });
    }

    // 🔸 Content
    if (content) {
      doc.setFontSize(12);
      doc.setFont("times", "normal");
      const splitContent = doc.splitTextToSize(content, usableWidth);
      doc.text(splitContent, marginX, 60);
    }

    // 🔸 Gambar di halaman baru
    doc.addPage();
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const res = await fetch(img);
      const blob = await res.blob();
      const reader = new FileReader();

      await new Promise((resolve) => {
        reader.onload = function (e) {
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text(`Gambar ${i + 1}`, pageWidth / 2, 20, { align: "center" });
          doc.addImage(e.target.result, "JPEG", marginX - 5, 30, usableWidth + 10, 120);
          if (i < images.length - 1) doc.addPage();
          resolve();
        };
        reader.readAsDataURL(blob);
      });
    }

    // 🔹 Buat URL preview PDF
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfPreviewUrl(pdfUrl);
  };

  // 🔹 Download PDF setelah preview
  const handleDownloadPDF = () => {
    if (!pdfPreviewUrl) return;
    const title = dataku?.title || "Dataset Gambar";
    saveAs(pdfPreviewUrl, `${title}.pdf`);
    setPdfPreviewUrl(null);
    setDownloadvisitor();
  };

  const setDownloadvisitor = async () => {
    await api_url_satuadmin.post(
      `api/opendata/infografik_download`,
      { id_infografik: dataku.id_infografik },                           // kirim JSON
      { headers: { "Content-Type": "application/json" } }
    );

  }

  return (
    <div className="w-100">
      

      {/* 🔹 Slider utama */}
      <Swiper
        modules={[Navigation, Pagination, Thumbs]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        thumbs={{ swiper: thumbsSwiper }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="w-100 justify-content-center"
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                height: "60vh",
                backgroundColor: "#f8f9fa",
              }}
            >
              <LazyLoadImage
                src={src}
                alt={`Gambar ${i + 1}`}
                visibleByDefault
                effect="blur"
                className="img-fluid rounded"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  cursor: "pointer",
                }}
                onClick={() => setFullscreenSrc(src)}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>


      {/* 🔹 Thumbnail */}
      <div className="mt-3">
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Thumbs]}
          spaceBetween={10}
          slidesPerView={4}
          breakpoints={{
            320: { slidesPerView: 3 },
            640: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          watchSlidesProgress
          freeMode
          className="cursor-pointer"
        >
          {images.map((src, i) => (
            <SwiperSlide key={`thumb-${i}`}>
              <img
                src={src}
                alt={`Thumbnail ${i + 1}`}
                className={`img-fluid rounded border ${
                  i === activeIndex ? "border-success opacity-100" : "border-secondary opacity-50"
                }`}
                style={{
                  height: "80px",
                  objectFit: "cover",
                  cursor: "pointer",
                  transition: "opacity 0.3s",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* 🔹 Tombol Unduh */}
      <div className="d-flex justify-content-end mt-3 mb-3 gap-2">
        <button className="btn btn-success btn-sm" onClick={handleDownloadAll}>
          Unduh Semua Gambar (ZIP)
        </button>
        <button className="btn btn-primary btn-sm" onClick={handlePreviewPDF}>
          Preview PDF
        </button>
      </div>

      {/* 🔹 Modal Fullscreen */}
      {fullscreenSrc && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          onClick={() => setFullscreenSrc(null)}
          style={{
            backgroundColor: "rgba(0,0,0,0.9)",
            position: "fixed",
            inset: 0,
            zIndex: 1050,
          }}
        >
          <div
            className="d-flex justify-content-center align-items-center h-100"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fullscreenSrc}
              alt="Fullscreen"
              className="img-fluid rounded shadow"
              style={{ maxHeight: "90vh", objectFit: "contain" }}
            />
          </div>
          <button
            className="btn btn-light position-fixed top-0 end-0 m-3"
            onClick={() => setFullscreenSrc(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* 🔹 Modal Preview PDF */}
      {pdfPreviewUrl && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          onClick={() => setPdfPreviewUrl(null)}
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            position: "fixed",
            inset: 0,
            zIndex: 1060,
          }}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Preview PDF</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setPdfPreviewUrl(null)}
                ></button>
              </div>
              <div className="modal-body" style={{ height: "80vh" }}>
                <iframe
                  src={pdfPreviewUrl}
                  title="PDF Preview"
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                ></iframe>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setPdfPreviewUrl(null)}>
                  Tutup
                </button>
                <button className="btn btn-primary" onClick={handleDownloadPDF}>
                  Unduh PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
