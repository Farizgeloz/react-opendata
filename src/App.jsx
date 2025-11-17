import { HashRouter, Routes, Route,BrowserRouter } from "react-router-dom";
import HalDatasetDashboard from "./components/page_web/Halaman_Opendata_Dashboard";
import HalDataset from "./components/page_web/Halaman_Opendata_Dataset";
import HalKategori from "./components/page_web/Halaman_Opendata_Kategori";
import HalInfografik from "./components/page_web/Halaman_Opendata_Infografik";
import HalInfografikDetail from "./components/page_web/Halaman_Opendata_Infografik_detail";
import HalOrganisasi from "./components/page_web/Halaman_Organisasi";
import HalMetadata from "./components/page_web/Halaman_Opendata_Metadata";
import HalDatasetDetail from "./components/page_web/Halaman_Opendata_Dataset_Detail";
import HalDatasetPermohonan from "./components/page_web/Halaman_Opendata_Dataset_Permohonan";
import HalDatasetPermohonanTiket from "./components/page_web/Halaman_Opendata_Dataset_Permohonan _Tiket";
import HalArtikel from "./components/page_web/Halaman_Opendata_Artikel";
import HalArtikelDetail from "./components/page_web/Halaman_Opendata_Artikel_detail";
import HalBantuan from "./components/page_web/Halaman_Bantuan";
import HalDataset2 from "./components/page_sub/dataset_searchdata";
import ScrollToTop from "./ScrollToTop";

const Router =
  process.env.NODE_ENV === "development" ? BrowserRouter : HashRouter;

function App() {
  return (
    <div>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HalDatasetDashboard />} />
          <Route path="/Dataset" element={<HalDataset />} />
          <Route path="/Dataset/Detail/:id" element={<HalDatasetDetail />} />
          <Route path="/Dataset/Sektor/:topik" element={<HalKategori />} />
          <Route path="/Dataset/Sektor" element={<HalKategori />} />
          <Route path="/Dataset/Permohonan" element={<HalDatasetPermohonan />} />
          <Route path="/Dataset/Permohonan/Tiket/:id" element={<HalDatasetPermohonanTiket />} />
          <Route path="/Infografik" element={<HalInfografik />} />
          <Route path="/Infografik/Detail/:id" element={<HalInfografikDetail />} />
          <Route path="/Organisasi" element={<HalOrganisasi />} />
          <Route path="/Metadata" element={<HalMetadata />} />
          <Route path="/Artikel" element={<HalArtikel />} />
          <Route path="/Artikel/Detail/:id" element={<HalArtikelDetail />} />
          <Route path="/Tentang" element={<HalBantuan />} />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;