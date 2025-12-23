import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams,useLocation, Link } from "react-router-dom";
import {Container,Row,Col} from 'react-bootstrap';
import { FaBuildingColumns, FaCheckToSlot, FaHospital, FaLeaf } from "react-icons/fa6";
import Image from 'react-bootstrap/Image';
import { motion } from "framer-motion";
import { createTheme, IconButton, TextField, ThemeProvider } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { DataGrid } from "@mui/x-data-grid";
import { MdAdsClick, MdClose, MdHomeFilled, MdListAlt, MdOutlineFeaturedPlayList, MdSchool } from "react-icons/md";
import { BsBuildings } from "react-icons/bs";
import { GiReceiveMoney } from "react-icons/gi";
import { api_url_satudata,api_url_satuadmin } from "../../api/axiosConfig";

const Spinner = () => 
  <div className='text-center justify-content-center' style={{height:"110px"}}>
      <div className="dot-overlay mt-5" >
          <div className="dot-pulse">
            <span></span>
            <span></span>
            <span></span>
          </div>
          
      </div>
    <p className='text-center text-shadow-border-multicolor-smooth italicku'>Proses ...</p>
  </div>;


const theme = createTheme({
  components: {
    MuiTablePagination: {
      defaultProps: {
        labelRowsPerPage: 'Baris per halaman',
      },
    },
  }
});
const portal = "Portal Open Data";

const getIconBySektor = (id) => {
  switch (id) {
    case 1:
      return (
        <div
          className="p-3 d-flex justify-content-center rad15"
          style={{
            background: "linear-gradient(135deg, #6A1B9A 50%, #AB47BC 50%)",
          }}
        >
          <MdSchool className="textsize40 text-white" />
        </div>
      ); // Pendidikan
    case 2:
      return (
        <div
          className="p-3 d-flex justify-content-center rad15"
          style={{
            background: "linear-gradient(135deg, #F57F17 50%, #FFB300 50%)",
          }}
        >
          <FaHospital className="textsize40 text-white" />
        </div>
      ); // Kesehatan
    case 3:
      return (
        <div
          className="p-3 d-flex justify-content-center rad15"
          style={{
            background: "linear-gradient(135deg, #9E9D24 50%, #D4E157 50%)",
          }}
        >
          <BsBuildings className="textsize40 text-white" />
        </div>
      ); // Ekonomi
    case 4:
      return (
        <div
          className="p-3 d-flex justify-content-center rad15"
          style={{
            background: "linear-gradient(135deg, #AD1457 50%, #EC407A 50%)",
          }}
        >
          <FaLeaf className="textsize40 text-white" />
        </div>
      ); // Lingkungan
    case 5:
      return (
        <div
          className="p-3 d-flex justify-content-center rad15"
          style={{
            background: "linear-gradient(135deg, #EF6C00 50%, #FF9800 50%)",
          }}
        >
          <FaLeaf className="textsize40 text-white" />
        </div>
      ); // Infrastruktur
    case 6:
      return (
        <div
          className="p-3 d-flex justify-content-center rad15"
          style={{
            background: "linear-gradient(135deg, #1A237E 50%, #3949AB 50%)",
          }}
        >
          <GiReceiveMoney className="textsize40 text-white" />
        </div>
      ); // Kemiskinan
    default:
      return (
        <div
          className="p-3 d-flex justify-content-center rad15"
          style={{
            background: "linear-gradient(135deg, #455A64 50%, #90A4AE 50%)",
          }}
        >
          <FaBuildingColumns className="textsize40 text-white" />
        </div>
      ); // fallback
  }
};


function AppTeams({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,bginputku,colortitleku,colordateku }) {
  const [loading, setLoading] = useState(true);
  const { topik } = useParams();  // ⬅️ otomatis berubah sesuai link
  const sektorDecoded = decodeURIComponent(topik);

  const [showFilter, setShowFilter] = useState(true);
  
  const [sektor_idku, setKategori] = useState([]);
  const [satkerku, setDatasetSatker] = useState([]);
  const [periodeku, setDatasetPeriode] = useState([]);
  const [kategoriku, setDatasetKategori] = useState([]);
  const [unitwilayahku, setDatasetUnitWilayah] = useState([]);
  const [satuanku, setDatasetSatuan] = useState([]);
  const [searchtermsatker, setSearchTermSatker] = useState("");
  const [searchtermperiode_dataset, setSearchTermPeriode] = useState("");
  const [searchtermkategori_dataset, setSearchTermKategori] = useState("");
  const [searchtermunitwilayah_dataset, setSearchTermUnitWilayah] = useState("");
  const [searchtermsatuan_dataset, setSearchTermSatuan] = useState("");
  //const [searchtermtag, setSearchTermTag] = useState("");
  //const [sifatdataku, setDatasetSifatdata] = useState([]);
  const [periode_datasetku, setDatasetPeriode_dataset] = useState([]);
  //const [tagku, setDatasetTag] = useState([]);

  const [datasetku, setDatasetSearch] = useState([]);
  const [keywordsatker, setKeywordSatker] = useState("");
  const [keywordsatkerName, setKeywordSatkerName] = useState("");
  const [keywordperiode_dataset, setKeywordPeriode] = useState("");
  const [keywordkategori_dataset, setKeywordKategori] = useState("");
  const [keywordunitwilayah_dataset, setKeywordUnitWilayah] = useState("");
  const [keywordsatuan_dataset, setKeywordSatuan] = useState("");
  const [keywordsatuanName, setKeywordSatuanName] = useState("");
  //const [keywordtag, setKeywordTag] = useState("");

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");

  const [searchKeyword, setSearchKeyword] = useState("");
  const location = useLocation();
  const cariParam = new URLSearchParams(location.search).get("search") || "";

  const [sortBy, setSortBy] = useState("terbaru"); // default urutan

  const isMobile = window.innerWidth < 768;
  
  useEffect(() => {
    if (window.innerWidth < 768) {
      setShowFilter(false);
    }
  }, []);

  const getDatasetUnsur = async (dimensi = "",satker = "") => {
     
    const res3 = await api_url_satudata.get("dataset?limit=1000");
    const allDataset = res3.data || [];


    const satkerList = allDataset
      .map(item => ({
        id_opd: item.opd?.id_opd,
        nama_opd: item.opd?.nama_opd
      }))
      .filter(opd => opd.id_opd && opd.nama_opd);

    const uniqueSatker = Array.from(
      new Map(satkerList.map(opd => [opd.id_opd, opd])).values()
    );

    setDatasetSatker(uniqueSatker);

    const uniquePeriode = [
      ...new Set(allDataset.map(item => item.periode_dataset).filter(Boolean))
    ];
    //console.log("Full response periode:", uniqueSatker);
    // simpan ke state
    setDatasetPeriode(uniquePeriode);

    const uniqueKategori = [
      ...new Set(allDataset.map(item => item.kategori_dataset).filter(Boolean))
    ];
    setDatasetKategori(uniqueKategori);

    const uniqueUnitWilayah = [
      ...new Set(allDataset.map(item => item.unit_wilayah).filter(Boolean))
    ];
    setDatasetUnitWilayah(uniqueUnitWilayah);

    const satuanList = allDataset
      .map(item => ({
        id_satuan: item.satuan?.id_satuan,
        nama_satuan: item.satuan?.nama_satuan
      }))
      .filter(satuan => satuan.id_satuan && satuan.nama_satuan);

    const uniqueSatuan = Array.from(
      new Map(satuanList.map(satuan => [satuan.id_satuan, satuan])).values()
    );

    setDatasetSatuan(uniqueSatuan);
    //setDatasetSifatdata(res.data?.resultSifatData || []);
    //setDatasetTag(res.data?.resultTag || []);
  };

  const getDatasetSearch = async ({ satker = "", periode_dataset = "", keyword = "" } = {}) => {
    setLoading(true);
    try {
     

      const res2 = await api_url_satudata.get("dataset?limit=1000");

      // ini respons axios lengkap (ada data, status, headers, dll)
      //console.log("Full response dataset:", res2);

      // ambil hanya datanya
      //console.log("Dataset online:", res2.data);
      const allDataset = res2.data || [];
      // kalau keywordsatker ada isinya, filter berdasarkan opd.id_opd
      let filteredDataset = allDataset;

      filteredDataset = filteredDataset.filter(item => {
        const matchTopik =
          !sektorDecoded || item.sektor.nama_sektor === sektorDecoded;
        const matchSatker =
          !keywordsatker || item.opd.id_opd === keywordsatker;
        const matchPeriode =
          !keywordperiode_dataset || item.periode_dataset === keywordperiode_dataset;
        const matchKategori =
          !keywordkategori_dataset || item.kategori_dataset === keywordkategori_dataset;
        const matchUnitwilayah =
          !keywordunitwilayah_dataset || item.unit_wilayah === keywordunitwilayah_dataset;
        const matchSatuan =
          !keywordsatuan_dataset || item.satuan.id_satuan === keywordsatuan_dataset;
        const matchKeyword =
          !searchKeyword ||
          item.nama_dataset.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.opd.nama_opd.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.sektor.nama_sektor.toLowerCase().includes(searchKeyword.toLowerCase());
        return matchTopik && matchSatker && matchPeriode&& matchKategori && matchUnitwilayah && matchSatuan && matchKeyword;
      });

      // Masukkan hasil filter ke state
      setDatasetSearch(filteredDataset);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getKategori = async () => {
    try {
      const response = await axios.get(`https://api.mataprabulinggih.net/api/v1/public/referensi/sektor`);

      // Cek apakah response.data itu array atau object
      const payload = Array.isArray(response.data) ? response.data : response.data.datas;

      setKategori(payload);

      const response_image = await api_url_satuadmin.get( 'open-item/images_item', {
        params: {
          portal:portal
        }
      });
      const data_image = response_image.data.image_opendata_kategoribidang;
      setImage1(data_image.presignedUrl1);
      setImage2(data_image.presignedUrl2);

    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
      
      getDatasetUnsur(keywordsatker);
      getKategori();
      
  }, []);
  useEffect(() => {
    
    setTimeout(() => {
      getDatasetSearch({ satker: keywordsatker, periode_dataset: keywordperiode_dataset, kategori_dataset: keywordkategori_dataset, unitwilayah_dataset: keywordunitwilayah_dataset, satuan_dataset: keywordsatuan_dataset});
      
    }, 1000); 
  }, [sektorDecoded,keywordsatker, keywordperiode_dataset, keywordkategori_dataset, keywordunitwilayah_dataset, keywordsatuan_dataset]);

  const handleSearch = () => {
    getDatasetSearch({ satker: keywordsatker, periode_dataset: keywordperiode_dataset, kategori_dataset: keywordkategori_dataset, unitwilayah_dataset: keywordunitwilayah_dataset, satuan_dataset: keywordsatuan_dataset, keyword: searchKeyword });
  };

  const columns = useMemo(
    () => [
    
      { 
        field: "mycolumn", 
        headerName: "", 
        flex: 10,
        filterable: true,
        headerClassName: "custom-header", // kelas custom
        minWidth: 100,
        renderCell: (params) => {
          const row = params.row;
          return (
            <Row className="bg-body">
                <Col md={2} xs={2}>
                  {/* <Image src={row.presignedUrl} className="rad15" /> */}
                  
                  {getIconBySektor(row.sektor?.id_sektor)}
                </Col>
                <Col md={10} xs={10}>
                <div>
                  <p className="font_weight600 textsize14 text-body">{`${row.nama_dataset}`}</p>
                  <p className="cursor-pointer textsize12 text-body"><FaBuildingColumns /> {`${row.opd.nama_opd}`}</p>
                  <Row className="">
                    <Col md="auto">
                    <p className="cursor-pointer textsize10 text-white bg-green px-5 rad15 uppercaseku"> {`${row.sektor.nama_sektor}`}</p>
                    </Col>
                    <Col md="auto">
                    <p className="cursor-pointer textsize10 text-white bg-red px-5 rad15 uppercaseku"> {`${row.kategori_dataset}`}</p>
                    </Col>
                    <Col md="auto">
                    <p className="cursor-pointer textsize10 text-white bg-blue px-5 rad15 uppercaseku"> {`${row.periode_dataset}`}</p>
                    </Col>
                    {/* <Col md="auto">
                      <p
                        className={`cursor-pointer textsize8 text-white px-2 rad15 ${
                          row.sifat_data === "Data Prioritas" ? "bg-orange" : "bg-silver-dark"
                        }`}
                      >
                        <FaCheckToSlot /> {row.sifat_data}
                      </p>
                      
                      
                    </Col> */}
                    
                  </Row>
                  <p className="textsize10  text-body">
                    <span className="font_weight600 text-body">Diperbaharui Tanggal: </span>{convertDate(row.updated_at)}
                  </p>
                  <Link to={`/Dataset/Detail/${slugify(params.row.nama_dataset)}` } className="btn btn-orangeblue text-white-a">Detail Dataset</Link>
                </div>
              </Col>
            </Row>
            
          );
        }
      }
  
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rowsku = Array.isArray(datasetku)
  ? datasetku.map((row, index) => ({
      id: index + 1,
      no: index + 1,
      ...row,
      mycolumn: `${row.nama_sektor ?? ''} ${row.kegiatan_statistik ?? ''} ${row.klasifikasi ?? ''} ${row.kategori_data ?? ''} ${row.periode_dataset ?? ''}`
      
    }))
  : [];

  const memoRows = useMemo(() => rowsku, [rowsku]);
  
    const [activeItemSatker, setActiveItemSatker] = useState(null);
    //const [activeItemSifatdata, setActiveItemSifatdata] = useState(null);
    const [activeItemPeriode, setActiveItemPeriode] = useState(null);
    const [activeItemKategori, setActiveItemKategori] = useState(null);
    const [activeItemUnitWilayah, setActiveItemUnitWilayah] = useState(null);
    const [activeItemSatuan, setActiveItemSatuan] = useState(null);
  //const [activeItemTag, setActiveItemTag] = useState(null);

  const handleClicksatker = (index) => {
    setActiveItemSatker(index);
    
  };
  const handleClickperiode_dataset = (index) => {
    setActiveItemPeriode(index);
    
  };
  const handleClickkategori_dataset = (index) => {
    setActiveItemKategori(index);
    
  };
  const handleClickunitwilayah_dataset = (index) => {
    setActiveItemUnitWilayah(index);
    
  };
  const handleClicksatuan_dataset = (index) => {
    setActiveItemSatuan(index);
    
  };
  /* const handleClickTag = (index) => {
    setActiveItemTag(index);
  }; */

  const filteredSatker = satkerku.filter((satker) =>
    satker.nama_opd.toLowerCase().includes(searchtermsatker.toLowerCase())
  );

  const filteredPeriode = searchtermperiode_dataset
  ? periodeku.filter((periode) =>
      periode.toLowerCase().includes(searchtermperiode_dataset.toLowerCase())
    )
  : periodeku;

  const filteredKategori = searchtermkategori_dataset
  ? kategoriku.filter((kategori) =>
      kategori.toLowerCase().includes(searchtermkategori_dataset.toLowerCase())
    )
  : kategoriku;

  const filteredunitwilayah = searchtermunitwilayah_dataset
  ? unitwilayahku.filter((unit_wilayah) =>
      unit_wilayah.toLowerCase().includes(searchtermunitwilayah_dataset.toLowerCase())
    )
  : unitwilayahku;


  const filteredsatuan = satuanku.filter((satuan) =>
    satuan.nama_satuan.toLowerCase().includes(searchtermsatuan_dataset.toLowerCase())
  );

  const sortedData = [...memoRows].sort((a, b) => {
    if (sortBy === "terbaru") {
      return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
    }
    if (sortBy === "abjad") {
      return (a.nama_dataset || "").localeCompare(b.nama_dataset || "", "id", { sensitivity: "base" });
    }
    if (sortBy === "z-a") {
      return (b.nama_dataset || "").localeCompare(a.nama_dataset || "", "id", { sensitivity: "base" });
    }
    return 0;
  });

  function convertDate(datePicker) {
      const selectedDate = new Date(datePicker);

      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

      const dayName = dayNames[selectedDate.getDay()];
      const day = selectedDate.getDate();
      const monthName = monthNames[selectedDate.getMonth()];
      const year = selectedDate.getFullYear();

      const jam=selectedDate.getHours();
      const menit=selectedDate.getMinutes();
      const detik=selectedDate.getSeconds();

      const indonesianFormat = `${day} ${monthName} ${year}` + ` Pukul : `+`${jam}:${menit}:${detik} WIB`;
      return indonesianFormat;
  }

  
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        // Ganti spasi dengan strip (-)
      .replace(/[^\w\-]+/g, '')    // Hapus karakter non-kata
      .replace(/\-\-+/g, '-');     // Hapus strip ganda
  };



  

  

  return (
    <Row className=' mx-1 w-100 justify-content-center'>
      <Col md={12} sm={12}>
       <div className='mb-5'>
          
          <Row className='p-1  bg-body rad10 mx-2 shaddow4'>
            <Col md={2} sm={3} xs={3} className='float-center'>
              <Image className="img-100" src={image1} />
            </Col>
            <Col md={10} sm={9} xs={9}>
              <p className='textsize20 text-left font_weight700 mb-1 text-body'>Cari Dataset Berdasarkan Sektor</p>
              
              {loading ? (
                <Spinner />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Row className="  px-5">
                    {
                      sektor_idku.map((sektor_idi, index) => (
                        <Col sm={6} md={4} lg={4} xs={12} key={sektor_idi.id_sektor} className="py-0">
                          <div className="portfolio-wrapper">
                            <Link to={`/Dataset/Sektor/${encodeURIComponent(sektor_idi.nama_sektor)}`}>
                              <div 
                                className={`label text-center ${sektor_idi.nama_sektor === sektorDecoded ? 'btn-blueorange' : 'btn-orangeblue'}`}
                                style={{backgroundColor:sektor_idi.nama_sektor === sektorDecoded ? bgcontentku : ''}}
                              >
                                <p className="textsize12 px-2 py-1">{sektor_idi.nama_sektor}</p>
                              </div>
                            </Link>
                          </div>
                        </Col>
                      ))
                    }
                  </Row>
                </motion.div>
              )}
            </Col>
            
          </Row>
          
        </div>
      </Col>
      {/* SIDEBAR */}
     <motion.div
        animate={{
          width: showFilter
            ? (isMobile ? "100%" : "33%")
            : "0%",
          opacity: showFilter ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {showFilter && (
          <Col md={12}>
            <section id="teams" className="bg-body py-0 rad10 mx-1 shaddow4 mb-3">
              <div 
                className="text-center shaddow4 rad10"
                style={{backgroundColor:bgcontentku}}
              
              >
                <p className="text-light textsize14 font_weight600">OPD / Produsen Data</p>
              </div>
              <Container fluid className="pb-3">
                <input
                  type="text"
                  placeholder="Cari OPD..."
                  className="form-control bg-input textsize12 rad10"
                  value={searchtermsatker}
                  onChange={(e) => setSearchTermSatker(e.target.value)}
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Row className='portfoliolist'>
                    <Col sm={12} className="max-height1">
                      <Row>
                        {Array.isArray(filteredSatker) && filteredSatker.length > 0 ? (
                          filteredSatker.map((satker, index) => (
                            <Col
                              sm={12}
                              key={satker.id_opd || index}
                              className={activeItemSatker === index ? `text-body border-bottom mt-1 rad10 cursor-true` : `border-bottom mt-1 cursor-true`}
                              style={{ backgroundColor: activeItemSatker === index ? bgcontentku : `` }}
                              onClick={() => {
                                activeItemSatker === index ? setKeywordSatker("") : setKeywordSatker(satker.id_opd);
                                activeItemSatker === index ? setKeywordSatkerName("") : setKeywordSatkerName(satker.nama_opd);
                                //activeItemSatker === index ? setKeywordTag("") : setKeywordTag("");
                                activeItemSatker === index ? setSearchKeyword("") : setSearchKeyword("");
                                activeItemSatker === index ? handleClicksatker(null) : handleClicksatker(index);
                                //activeItemSatker === index ? handleClickTag(null) : handleClickTag(null);
                              }}
                            >
                              <Row>
                                <Col key={satker.id} className="col-12 clearfix py-1">
                                  <div
                                    className={
                                      activeItemSatker === index
                                        ? "category textsize10 text-white cursor-true float-left  uppercaseku"
                                        : "category textsize10 text-body bg-body cursor-true float-left uppercaseku"
                                    }
                                  >
                                    {satker.nama_opd.length >= 35
                                      ? satker.nama_opd.substring(0, 35) + "..."
                                      : satker.nama_opd}
                                  </div>
                                  <div className="text-end float-right bg-silver-dark px-3 height-05 rad10">
                                    <p className="textsize8 text-white">
                                      {activeItemSatker === index ? <MdClose /> : <MdAdsClick  />}
                                    </p>
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          ))

                        ) : (
                          <p className="text-body font_weight600 italicku text-center mt-3">Ups.. OPD Tidak Ditemukan</p>
                        )}
                      </Row>
                    </Col>
                  </Row>
                </motion.div>
              </Container>
            </section>
            <section id="teams" className="bg-body py-0 rad10 mx-1 shaddow4 mb-5">
              <div 
                className="text-center shaddow4 rad10"
                style={{backgroundColor:bgcontentku}}
              
              >
                <p className="text-light textsize14 font_weight600">Periode</p>
              </div>
              <Container fluid className="pb-3">
                <input
                  type="text"
                  placeholder="Cari Periode..."
                  className="form-control bg-input textsize12 rad10"
                  value={searchtermperiode_dataset}
                  onChange={(e) => setSearchTermPeriode(e.target.value)}
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Row className='portfoliolist'>
                    <Col sm={12} className="max-height1">
                      <Row>
                        {Array.isArray(filteredPeriode) && filteredPeriode.length > 0 ? (
                          filteredPeriode.map((periode_datasetn, index) => {
                            const periodeText = periode_datasetn || ""; // string langsung
                            return (
                              <Col
                                sm={12}
                                key={index}
                                className={
                                  activeItemPeriode === index
                                    ? "text-body border-bottom mt-1 rad10 cursor-true"
                                    : "border-bottom mt-1 cursor-true"
                                }
                                style={{ backgroundColor: activeItemPeriode === index ? bgcontentku : "" }}
                                onClick={() => {
                                  activeItemPeriode === index
                                    ? setKeywordPeriode("")
                                    : setKeywordPeriode(periodeText);
                                  activeItemPeriode === index ? setSearchKeyword("") : setSearchKeyword("");
                                  activeItemPeriode === index
                                    ? handleClickperiode_dataset(null)
                                    : handleClickperiode_dataset(index);
                                }}
                              >
                                <Row>
                                  <Col className="col-12 clearfix py-1">
                                    <div
                                      className={
                                        activeItemPeriode === index
                                          ? "category textsize10 text-white cursor-true float-left uppercaseku"
                                          : "category textsize10 text-body cursor-true float-left uppercaseku"
                                      }
                                    >
                                      {periodeText.length >= 35 ? periodeText.substring(0, 35) + "..." : periodeText}
                                    </div>
                                    <div className="text-end float-right bg-silver-dark px-3 height-05 rad10">
                                      {/* karena array of string, ga ada count_periode_dataset */}
                                      <p className="textsize8 text-white">
                                        {activeItemPeriode === index ? <MdClose /> : <MdAdsClick />}
                                      </p>
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            );
                          })
                        ) : (
                          <p className="text-silver-light font_weight600 italicku text-center mt-3">Ups.. Periode Tidak Ditemukan</p>
                        )}


                      </Row>
                    </Col>
                  </Row>
                </motion.div>
              </Container>
            </section>
            <section id="teams" className="bg-body py-0 rad10 mx-1 shaddow4 mb-5">
              <div 
                className="text-center shaddow4 rad10"
                style={{backgroundColor:bgcontentku}}
              
              >
                <p className="text-light textsize14 font_weight600">Kategori Data</p>
              </div>
              <Container fluid className="pb-3">
                <input
                  type="text"
                  placeholder="Cari Kategori Data..."
                  className="form-control bg-input textsize12 rad10"
                  value={searchtermkategori_dataset}
                  onChange={(e) => setSearchTermKategori(e.target.value)}
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Row className='portfoliolist'>
                    <Col sm={12} className="max-height1">
                      <Row>
                        {Array.isArray(filteredKategori) && filteredKategori.length > 0 ? (
                          filteredKategori.map((kategori_datasetn, index) => {
                            const kategoriText = kategori_datasetn || ""; // string langsung
                            return (
                              <Col
                                sm={12}
                                key={index}
                                className={
                                  activeItemKategori === index
                                    ? "text-body border-bottom mt-1 rad10 cursor-true"
                                    : "border-bottom mt-1 cursor-true"
                                }
                                style={{ backgroundColor: activeItemKategori === index ? bgcontentku : "" }}
                                onClick={() => {
                                  activeItemKategori === index
                                    ? setKeywordKategori("")
                                    : setKeywordKategori(kategoriText);
                                  activeItemKategori === index ? setSearchKeyword("") : setSearchKeyword("");
                                  activeItemKategori === index
                                    ? handleClickkategori_dataset(null)
                                    : handleClickkategori_dataset(index);
                                }}
                              >
                                <Row>
                                  <Col className="col-12 clearfix py-1">
                                    <div
                                      className={
                                        activeItemKategori === index
                                          ? "category textsize10 text-white cursor-true float-left uppercaseku"
                                          : "category textsize10 text-body cursor-true float-left uppercaseku"
                                      }
                                    >
                                      {kategoriText.length >= 35 ? kategoriText.substring(0, 35) + "..." : kategoriText}
                                    </div>
                                    <div className="text-end float-right bg-silver-dark px-3 height-05 rad10">
                                      {/* karena array of string, ga ada count_periode_dataset */}
                                      <p className="textsize8 text-white">
                                        {activeItemKategori === index ? <MdClose /> : <MdAdsClick />}
                                      </p>
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            );
                          })
                        ) : (
                          <p className="text-silver-light font_weight600 italicku text-center mt-3">Ups.. Kategori Data Tidak Ditemukan</p>
                        )}


                      </Row>
                    </Col>
                  </Row>
                </motion.div>
              </Container>
            </section>
            <section id="teams" className="bg-body py-0 rad10 mx-1 shaddow4 mb-5">
              <div 
                className="text-center shaddow4 rad10"
                style={{backgroundColor:bgcontentku}}
              
              >
                <p className="text-light textsize14 font_weight600">Unit Wilayah</p>
              </div>
              <Container fluid className="pb-3">
                <input
                  type="text"
                  placeholder="Cari Unit Wilayah..."
                  className="form-control bg-input textsize12 rad10"
                  value={searchtermunitwilayah_dataset}
                  onChange={(e) => setSearchTermUnitWilayah(e.target.value)}
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Row className='portfoliolist'>
                    <Col sm={12} className="max-height1">
                      <Row>
                        {Array.isArray(filteredunitwilayah) && filteredunitwilayah.length > 0 ? (
                          filteredunitwilayah.map((unitwilayah_datasetn, index) => {
                            const unitwilayahText = unitwilayah_datasetn || ""; // string langsung
                            return (
                              <Col
                                sm={12}
                                key={index}
                                className={
                                  activeItemUnitWilayah === index
                                    ? "text-body border-bottom mt-1 rad10 cursor-true"
                                    : "border-bottom mt-1 cursor-true"
                                }
                                style={{ backgroundColor: activeItemUnitWilayah === index ? bgcontentku : "" }}
                                onClick={() => {
                                  activeItemUnitWilayah === index
                                    ? setKeywordUnitWilayah("")
                                    : setKeywordUnitWilayah(unitwilayahText);
                                  activeItemUnitWilayah === index ? setSearchKeyword("") : setSearchKeyword("");
                                  activeItemUnitWilayah === index
                                    ? handleClickunitwilayah_dataset(null)
                                    : handleClickunitwilayah_dataset(index);
                                }}
                              >
                                <Row>
                                  <Col className="col-12 clearfix py-1">
                                    <div
                                      className={
                                        activeItemUnitWilayah === index
                                          ? "category textsize10 text-white cursor-true float-left uppercaseku"
                                          : "category textsize10 text-body cursor-true float-left uppercaseku"
                                      }
                                    >
                                      {unitwilayahText.length >= 35 ? unitwilayahText.substring(0, 35) + "..." : unitwilayahText}
                                    </div>
                                    <div className="text-end float-right bg-silver-dark px-3 height-05 rad10">
                                      <p className="textsize8 text-white">
                                        {activeItemUnitWilayah === index ? <MdClose /> : <MdAdsClick />}
                                      </p>
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            );
                          })
                        ) : (
                          <p className="text-silver-light font_weight600 italicku text-center mt-3">Ups.. UnitWilayah Tidak Ditemukan</p>
                        )}


                      </Row>
                    </Col>
                  </Row>
                </motion.div>
              </Container>
            </section>
            <section id="teams" className="bg-body py-0 rad10 mx-1 shaddow4 mb-3">
              <div 
                className="text-center shaddow4 rad10"
                style={{backgroundColor:bgcontentku}}
              
              >
                <p className="text-light textsize14 font_weight600">Satuan Dataset</p>
              </div>
              <Container fluid className="pb-3">
                <input
                  type="text"
                  placeholder="Cari Satuan..."
                  className="form-control bg-input textsize12 rad10"
                  value={searchtermsatuan_dataset}
                  onChange={(e) => setSearchTermSatuan(e.target.value)}
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Row className='portfoliolist'>
                    <Col sm={12} className="max-height1">
                      <Row>
                        {Array.isArray(filteredsatuan) && filteredsatuan.length > 0 ? (
                          filteredsatuan.map((satuan, index) => (
                            <Col
                              sm={12}
                              key={satuan.id_satuan || index}
                              className={activeItemSatuan === index ? `text-body border-bottom mt-1 rad10 cursor-true` : `border-bottom mt-1 cursor-true`}
                              style={{ backgroundColor: activeItemSatuan === index ? bgcontentku : `` }}
                              onClick={() => {
                                activeItemSatuan === index ? setKeywordSatuan("") : setKeywordSatuan(satuan.id_satuan);
                                activeItemSatuan === index ? setKeywordSatuanName("") : setKeywordSatuanName(satuan.nama_satuan);
                                //activeItemSatuan === index ? setKeywordTag("") : setKeywordTag("");
                                activeItemSatuan === index ? setSearchKeyword("") : setSearchKeyword("");
                                activeItemSatuan === index ? handleClicksatuan_dataset(null) : handleClicksatuan_dataset(index);
                                //activeItemSatuan === index ? handleClickTag(null) : handleClickTag(null);
                              }}
                            >
                              <Row>
                                <Col key={satuan.id} className="col-12 clearfix py-1">
                                  <div
                                    className={
                                      activeItemSatuan === index
                                        ? "category textsize10 text-white cursor-true float-left  uppercaseku"
                                        : "category textsize10 text-body bg-body cursor-true float-left uppercaseku"
                                    }
                                  >
                                    {satuan.nama_satuan.length >= 35
                                      ? satuan.nama_satuan.substring(0, 35) + "..."
                                      : satuan.nama_satuan}
                                  </div>
                                  <div className="text-end float-right bg-silver-dark px-3 height-05 rad10">
                                    <p className="textsize8 text-white">
                                      {activeItemSatuan === index ? <MdClose /> : <MdAdsClick  />}
                                    </p>
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          ))

                        ) : (
                          <p className="text-body font_weight600 italicku text-center mt-3">Ups.. Satuan Tidak Ditemukan</p>
                        )}
                      </Row>
                    </Col>
                  </Row>
                </motion.div>
              </Container>
            </section>
           </Col>
        )}
      </motion.div>

     
      <Col md={showFilter ? 7 : 12} sm={12} className="mt-4 margin-b10">
        {/* ⬇️ PINDAHKAN HEADER KE SINI */}
        
        <section id="teams" className="block  py-1 ">
          <div className="d-flex justify-content-between align-items-center mb-3">

           <button
              className="btn btn-sm rad10 w-5 px-3"
              style={{ backgroundColor: bgcontentku, color: "#fff" }}
              onClick={() => setShowFilter(!showFilter)}
              title={showFilter ? "Tutup Filter" : "Buka Filter"}
            >
              {showFilter ? "✕" : "☰"}
            </button>
            <div className="text-center w-95">
              <p className="text-body textsize10 ">Pencarian berdasarkan Judul, OPD, Dll.</p>
              <div className="mb-3">
                <TextField
                  label="Masukkan Kata Kunci"
                  className="bg-input rad15 textsize12"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  InputProps={{
                    endAdornment: (
                      searchKeyword && (
                        <IconButton
                          aria-label="clear"
                          size="small"
                          onClick={() => setSearchKeyword("")}
                          edge="end"
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      )
                    ),
                  }}
                  sx={{ 
                    width: "80%", 
                    "& .MuiOutlinedInput-root": {
                      height: "6vh",
                      fontSize: "100%",
                      borderRadius: "15px"
                    },
                    // 🔹 Ukuran label normal
                    "& .MuiInputLabel-root": {
                      fontSize: "90%", // 👉 label saat normal
                    },
                    "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiInputLabel-shrink": {
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      borderRadius: "6px",
                      padding: "0 6px",
                      transform: "translate(14px, -9px) scale(0.85)",
                      fontSize:"70%"
                    }
                  }}
                />
    
                <button
                  onClick={handleSearch}
                  style={{
                    margin:"0px 5px",
                    padding: "18px 20px",
                    borderRadius: 10,
                    border: "none",
                    background: bgku,
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "16px",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(25,118,210,.3)"
                  }}
                >
                  Cari
                </button>
              </div>
            </div>
          </div>
          
          <div className="rad15 mx-4  rad15 shaddow4" style={{background:`linear-gradient(to right, ${bgcontentku}, ${bgku})`}}>
            <p className="px-2">
                <span className="font_weight600 text-white">OPD: </span><span className="text-white font_weight400 p-1 rad10 uppercaseku">{keywordsatkerName}</span>,
                <span className="font_weight600 text-white">Periode: </span><span className="text-white font_weight400 p-1 rad10 uppercaseku">{keywordperiode_dataset}</span>    
              
            </p>     
          </div>
          
          <Container fluid>
            {loading ? (
              <Spinner />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <Row className='portfoliolists'>
                  <Row className="mb-3 pb-2" style={{borderBottom:"1px solid #c5c3c3"}}>
                    <Col className="text-start">
                      <p className="mb-0 text-muted textsize12 italicku text-body">
                        Ditemukan <strong>{sortedData.length}</strong> Dataset
                      </p>
                    </Col>
                    <Col className="d-flex justify-content-end">
                      <select
                        className="form-select form-select-sm w-auto textsize12 rad10"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="terbaru">Urutkan: Terbaru</option>
                        <option value="abjad">Urutkan: A-Z</option>
                        <option value="z-a">Urutkan: Z-A</option> {/* opsional tambahan */}
                      </select>
                    </Col>
                  </Row> 
                  <Col sm={12} key={'bodyku'}>
                    <Row>
                      <ThemeProvider theme={theme}>
                        <DataGrid
                          hideHeader
                          loading={loading}
                          rows={sortedData.map(r => ({ ...r, id: r.nama_dataset || `row-${r.id_dataset}` }))}
                          columns={columns}
                          pageSizeOptions={[5, 10, 50, 100]}
                          initialState={{
                            pagination: {
                              paginationModel: { pageSize: 10, page: 0 }
                            }
                          }}
                          disableSelectionOnClick
                          getRowHeight={() => 'auto'}
                          getRowClassName={() => 'bg-body'}
                          autoHeight // <- ini penting biar tidak scroll
                          localeText={{
                            noRowsLabel: "📭 Data Tidak Ditemukan", // ganti teks default
                            toolbarDensity: 'Kepadatan',
                            toolbarDensityLabel: 'Kepadatan',
                            toolbarDensityCompact: 'Kompak',
                            toolbarDensityStandard: 'Standar',
                            toolbarDensityComfortable: 'Nyaman',
                            toolbarFilters: 'Filter',
                            toolbarFiltersLabel: 'Tampilkan filter',
                            toolbarFiltersTooltipHide: 'Sembunyikan filter',
                            toolbarFiltersTooltipShow: 'Tampilkan filter',
                            footerPaginationRowsPerPage: 'Baris per halaman', // Ganti "Rows per page"
                            footerRowSelected: (count) =>
                              count !== 1
                                ? `${count.toLocaleString()} baris dipilih`
                                : `${count.toLocaleString()} baris dipilih`,
                          }}
                          
                          sx={{
                            "--DataGrid-color-background-base": "transparent",
                              backgroundColor: "transparent !important", // paksa transparan table
                              border: "none", // hilangkan border utama,
                              marginBottom:"50px",
                            "& .MuiDataGrid-root": {
                              backgroundColor: "transparent", // ⬅ background utama transparan
                              marginBottom:"50px"
                            },
                              "& .MuiDataGrid-row": {
                              marginTop: "8px",
                              paddingTop:"10px",
                              paddingBottom:"10px",
                              paddingLeft:"5px",
                              paddingRight:"5px",
                              borderRadius: "6px",
                              boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)"
                              
                            },
                            "& .MuiDataGrid-columnHeaders": {
                              display: "none"
                            },
                            "& .custom-header": {
                              backgroundColor: "#1886ca",
                              color: "white",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                              fontSize: "80%"
                            },
                            "& .MuiDataGrid-virtualScroller": {
                              overflow: "auto !important" // ⬅ hilangkan scroll
                            },
                              "& .MuiDataGrid-cell": {
                              backgroundColor: "transparent", // ⬅ background cell transparan
                              borderTop:"none"
                            },
                            "& .MuiTablePagination-select option:not([value='5']):not([value='10']):not([value='20'])": {
                              display: "none"
                            },
                            "& .MuiTablePagination-selectLabel": {
                              color: "#444",
                              fontWeight: "bold",
                              marginTop: "15px"
                            },
                            "& .MuiTablePagination-displayedRows": {
                              color: "#666",
                              marginTop: "15px"
                            },
                            "& .MuiTablePagination-select": {
                              color: "#000",
                              fontWeight: "600",
                              backgroundColor: "#dbdbdb",
                              borderRadius: "6px"
                            },
                            // style kalau tidak ada data
                            "& .MuiDataGrid-overlay": {
                              backgroundColor: "#fff", // transparan
                              fontSize: "120%",
                              fontWeight: "bold",
                              fontStyle:"italic",
                              color: "#888",
                              marginTop: "-10%",
                              paddingTop: "40px",
                              textTransform: "uppercase",
                              borderRadius: "6px",
                            },
                          }}
                        />

                      </ThemeProvider>

                    </Row>
                  </Col>
                </Row>
              </motion.div>
            )}
          </Container>
        </section>
      </Col>
    </Row>
    
  );
}

export default AppTeams;