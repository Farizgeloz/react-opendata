import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import { TextField, Autocomplete, CircularProgress, createTheme, ThemeProvider, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Tabs, Tab, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { FaBuildingColumns } from "react-icons/fa6";
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

export default function DataSearch({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,bginputku,colortitleku,colordateku }) {
  
  
  // State
  const [datasetku, setDatasetSearch] = useState([]);
  const [datasetDimensi, setDatasetDimensi] = useState([]);
  const [sektor_idku, setKategori] = useState([]);
  const [satkerku, setDatasetSatker] = useState([]);
  const [periodeku, setDatasetPeriode] = useState([]);
  //const [datasetSifatdata, setDatasetSifatdata] = useState([]);
  const [keyworddimensi, setKeywordDimensi] = useState("");
  const [keywordsatker, setKeywordSatker] = useState("");
  const [keywordsatkerName, setKeywordSatkerName] = useState("");
  const [keywordperiode_dataset, setKeywordPeriode] = useState("");
  //const [keywordSifatdata, setKeywordSifatdata] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("nama_dataset");

  // URL param ?search=
  const location = useLocation();
  const cariParam = new URLSearchParams(location.search).get("search") || "";

  const [sortBy, setSortBy] = useState("terbaru"); // default urutan
  
  


  // ---- Fetchers ----
  const getDatasetUnsur2 = async (dimensi = "",satker = "") => {
    const res = await api_url_satuadmin.get( "api/opendata/dataset_item", {
      params: {
        search_bidangurusan: dimensi,
        search_satker: satker
      }
    });
    setDatasetDimensi(res.data?.resultBidangUrusan || []);
    //setDatasetSifatdata(res.data?.resultSifatData || []);
  };

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
    //setDatasetSifatdata(res.data?.resultSifatData || []);
    //setDatasetTag(res.data?.resultTag || []);
  };

  const getKategori = async () => {
    try {
      const response = await api_url_satudata.get(`referensi/sektor`);

      // Cek apakah response.data itu array atau object
      const payload = Array.isArray(response.data) ? response.data : response.data.datas;

      setKategori(payload);

     

    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
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
          !keyworddimensi || item.sektor.nama_sektor === keyworddimensi;
        const matchSatker =
          !keywordsatker || item.opd.id_opd === keywordsatker;
        const matchPeriode =
          !keywordperiode_dataset || item.periode_dataset === keywordperiode_dataset;
        const matchKeyword =
          !searchKeyword ||
          item.nama_dataset.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.opd.nama_opd.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.sektor.nama_sektor.toLowerCase().includes(searchKeyword.toLowerCase());
        return matchTopik && matchSatker && matchPeriode && matchKeyword;
      });

      // Masukkan hasil filter ke state
      setDatasetSearch(filteredDataset);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
        
      getDatasetUnsur(keywordsatker);
      getKategori();
      
  }, []);
  useEffect(() => {
    
    setTimeout(() => {
      getDatasetSearch({ dimensi: keyworddimensi, satker: keywordsatker, periode_dataset: keywordperiode_dataset});
      
    }, 2000); 
  }, [keyworddimensi,keywordsatker, keywordperiode_dataset]);

  const handleSearch = () => {
    getDatasetSearch({ dimensi: keyworddimensi, satker: keywordsatker, periode_dataset: keywordperiode_dataset, keyword: searchKeyword });
  };
  
  const columns = useMemo(
    () => [
      { 
        field: "nama_dataset", 
        headerName: "Judul", 
        flex: 4, 
        headerClassName: "custom-header", 
        minWidth: 320,
        renderCell: (params) => {
          return (
            <div className="">
              <p
                className="textsize14 text-body font_weight700"
                style={{ color: "#0a367b" || "#000" }} // fallback ke hitam
              >
                {params.row.nama_dataset}
              </p>
              <p className="textsize10 text-body font_weight600 mb-0">Diperbaharui: {}</p>
              <p className="textsize10 text-body">{convertDate(params.row.updated_at)}</p>
              <Link to={ `/Dataset/Detail/${slugify(params.row.nama_dataset)}` } className="btn btn-orangeblue text-white-a mx-1">Lihat Dataset</Link>
              <Link to={ `https://sirusa.web.bps.go.id/metadata/variabel/index` } target="_blank" className="btn btn-blueorange text-white-a mx-1">Detail</Link>
            </div>
           
          );
        }
      },
      { 
        field: "nama_sektor", 
        headerName: "Sektor", 
        flex: 2, 
        headerClassName: "custom-header", 
        minWidth: 240,
        renderCell: (params) => {
          //const isPrioritas = params.row.sifat_data === "Data Prioritas";
          return (
            <div className="">
              
              <p className="cursor-pointer textsize10 text-white text-center bg-green px-5 rad15 uppercaseku" style={{maxWidth:"80%"}}>
                {params.row.sektor.nama_sektor || "-"}
              </p>
              {/*<p className="textsize8 font_weight600 mb-0">Sifat Data: </p>
               <p className={`textsize10 rounded px-2 py-1 d-inline-block text-white ${
                isPrioritas ? "bg-green" : "bg-silver-dark"
              }`}>
                {params.row.sifat_data || "-"}
              </p> */}
              
             
            </div>
           
          );
        }
      },
      { 
        field: "nama_opd", 
        headerName: "OPD", 
        flex: 2, 
        headerClassName: "custom-header", 
        minWidth: 240,
        renderCell: (params) => {
          return (
            <div className="">
              <div className="d-flex align-items-start">
                <div
                className=""
                  style={{
                    width: "30px",          // lebar area icon konsisten
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start" // icon rata atas
                  }}
                >
                  <FaBuildingColumns size={15} className="text-body" />
                </div>

                <p className="cursor-pointer textsize10 mb-0 text-body">
                  {params.row.opd.nama_opd}
                </p>
              </div>

             
            </div>
           
          );
        }
      },
      { 
        field: "kategori_data_periode_dataset", 
        headerName: "Kategori Data & Periode", 
        flex: 2, 
        headerClassName: "custom-header", 
        minWidth: 240,
        renderCell: (params) => {
          return (
            <div className="">
              <p className="textsize10 font_weight600 mb-0 text-body">Kategori Data: </p>
              <p className="cursor-pointer textsize11 text-center bg-red px-5 rad15 uppercaseku text-white" style={{maxWidth:"80%"}}>{params.row.kategori_dataset}</p>
              <p className="textsize10 font_weight600 mb-0 text-body">Periode: </p>
              <p className="cursor-pointer textsize11 text-center bg-blue px-5 rad15 uppercaseku text-white" style={{maxWidth:"80%"}}>{params.row.periode_dataset}</p>
            </div>
           
          );
        }
      },
      
    ],
    []
  );

  const columns2 = useMemo(
    () => [
      { 
        field: "nama_dataset", 
        headerName: "Judul", 
        flex: 4, 
        headerClassName: "custom-header", 
        minWidth: 220,
        renderCell: (params) => {
          return (
            <div className="">
              <p className="textsize12 font_weight700" style={{color:colortitleku}}>{params.row.nama_dataset}</p>
              <p className="textsize8 font_weight600 mb-0">Diperbaharui: </p>
              <p className="textsize10">{convertDate(params.row.updated_at)}</p>
                <Link to={ `/Dataset/Detail/${slugify(params.row.nama_dataset)}` } className="btn btn-orangeblue text-white-a mx-1">Lihat Dataset</Link>
              <Link to={ `https://sirusa.web.bps.go.id/metadata/variabel/index` } target="_blank" className="btn btn-blueorange text-white-a mx-1">Detail</Link>
            </div>
           
          );
        }
      },
      { 
        field: "kegiatan_statistik_klasifikasi", 
        headerName: "Kegiatan & Klasifikasi", 
        flex: 2, 
        headerClassName: "custom-header", 
        minWidth: 240,
        renderCell: (params) => {
          //const isPrioritas = params.row.sifat_data === "Data Prioritas";
          return (
            <div className="">
              
              <p className="textsize8 font_weight600 mb-0">Kegiatan Statistik: </p>
              <p className={`textsize10 rounded d-inline-block }`}>
                {params.row.kegiatan_statistik || "-"}
              </p>
              <p className="textsize8 font_weight600 mb-0">Klasifikasi: </p>
              <p className={`textsize10 rounded d-inline-block }`}>
                {params.row.klasifikasi || "-"}
              </p>
              
             
            </div>
           
          );
        }
      },
      { 
        field: "definisi_konsep_satuan_id_ukur", 
        headerName: "Definisi, Konsep, Satuan & Ukuran", 
        flex: 4, 
        headerClassName: "custom-header", 
        minWidth: 240,
        renderCell: (params) => {
          return (
            <div className="">
              <p className="textsize8 font_weight600 mb-0">Definisi: </p>
              <p className="textsize10">{params.row.definisi}</p>
              <p className="textsize8 font_weight600 mb-0">Konsep: </p>
              <p className="textsize10">{params.row.konsep}</p>
              <p className="textsize8 font_weight600 mb-0">Satuan: </p>
              <p className={`textsize10 rounded d-inline-block }`}>
                {params.row.satuan_id || "-"}
              </p>
              <p className="textsize8 font_weight600 mb-0">Ukuran: </p>
              <p className="textsize10">{params.row.ukuran}</p>
            </div>
           
          );
        }
      }
    ],
    []
  );

  const rowsku = Array.isArray(datasetku)
  ? datasetku.map((row, index) => ({
      id: index + 1,
      no: index + 1,
      ...row,
      kategori_data_periode_dataset: `${row.kategori_data ?? ''} ${row.periode_dataset ?? ''}`
    }))
  : [];

  const memoRows = useMemo(() => rowsku, [rowsku]);

  // 🔥 Urutkan data sebelum render
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

    const indonesianFormat = `${day} ${monthName} ${year}`+' Pukul : '+`${jam}:${menit}:${detik} WIB`;
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
    <>
      <Row className="mx-2 mt-2 bg-body p-3 rad15 justify-content-center mb-3">
        {/* Filter bar */}
        <Col xs={12} className="mb-3 d-flex justify-content-center">
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
        </Col>
        <Col md={3} sm={12} className="mb-3">
            <Autocomplete
              options={sektor_idku}
              getOptionLabel={(opt) => opt?.nama_sektor || ""}
              value={sektor_idku.find((d) => d.nama_sektor === keyworddimensi) || null}
              onChange={(_, v) => setKeywordDimensi(v?.nama_sektor || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sektor"
                  variant="outlined"
                  className="bg-input rad15"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 60,
                      fontSize: "120%",
                      background: "#d2f6fc",
                      borderRadius: "12px"
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "100%",
                      fontWeight: 600,
                      transition: "all 0.2s ease"
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      borderRadius: "6px",
                      padding: "0 6px",
                      transform: "translate(14px, -9px) scale(0.85)"
                    }
                  }}
                />
              )}
              sx={{
                width: "100%",
                "& .MuiAutocomplete-popupIndicator": { color: "#1976d2", transition: "transform 0.3s" },
                "& .MuiAutocomplete-popupIndicatorOpen": { transform: "rotate(180deg)" }
              }}
            />
        </Col> 
        <Col md={4} sm={12} className="mb-3">
          <Autocomplete
            options={satkerku}
            getOptionLabel={(opt) => opt?.nama_opd || ""}
            value={satkerku.find((d) => d.id_opd === keywordsatker) || null}
            onChange={(_, v) => setKeywordSatker(v?.id_opd || "")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Satker"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 60,
                    fontSize: "120%",
                    background: "rgba(255,255,255,0.75)",
                    borderRadius: "12px"
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "100%",
                    fontWeight: 600,
                    transition: "all 0.2s ease"
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    borderRadius: "6px",
                    padding: "0 6px",
                    transform: "translate(14px, -9px) scale(0.85)"
                  }
                }}
              />
            )}
            sx={{
              width: "100%",
              "& .MuiAutocomplete-popupIndicator": { color: "#1976d2", transition: "transform 0.3s" },
              "& .MuiAutocomplete-popupIndicatorOpen": { transform: "rotate(180deg)" }
            }}
          />
        </Col>   
        <Col md={3} sm={12} className="mb-3">
          <Autocomplete
            options={periodeku}
            getOptionLabel={(opt) => opt || ""}
            value={periodeku.find((d) => d === keywordperiode_dataset) || null}
            onChange={(_, v) => setKeywordPeriode(v || "")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Periode Dataset"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 60,
                    fontSize: "120%",
                    background: "rgba(255,255,255,0.75)",
                    borderRadius: "12px"
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "100%",
                    fontWeight: 600,
                    transition: "all 0.2s ease"
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    borderRadius: "6px",
                    padding: "0 6px",
                    transform: "translate(14px, -9px) scale(0.85)"
                  }
                }}
              />
            )}
            sx={{
              width: "100%",
              "& .MuiAutocomplete-popupIndicator": { color: "#1976d2", transition: "transform 0.3s" },
              "& .MuiAutocomplete-popupIndicatorOpen": { transform: "rotate(180deg)" }
            }}
          />
        </Col>  
        {/* <Col sm={3} xs={12} className="mb-3">
          <Autocomplete
            options={datasetSifatdata}
            getOptionLabel={(opt) => opt?.sifat_data || ""}
            value={datasetSifatdata.find((d) => d.sifat_data === keywordSifatdata) || null}
            onChange={(_, v) => setKeywordSifatdata(v?.sifat_data || "")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sifat Data"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 50,
                    fontSize: "0.9rem",
                    background: "rgba(255,255,255,0.75)",
                    borderRadius: "12px"
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    transition: "all 0.2s ease"
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    borderRadius: "6px",
                    padding: "0 6px",
                    transform: "translate(14px, -9px) scale(0.85)"
                  }
                }}
              />
            )}
            sx={{
              width: "100%",
              "& .MuiAutocomplete-popupIndicator": { color: "#1976d2", transition: "transform 0.3s" },
              "& .MuiAutocomplete-popupIndicatorOpen": { transform: "rotate(180deg)" }
            }}
          />
        </Col>   */} 
        
      </Row>
      <Row className="mx-1 mt-2 justify-content-center">
        {/* Tabs + Grid */}
        <Col md={10} sm={12}>
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
                        <div style={{ height: "auto", width: "100%" }}>
                          <DataGrid
                            rows={sortedData.map(r => ({ ...r, id: r.nama_dataset || `row-${r.id_dataset}` }))}
                            columns={columns}
                            loading={loading}
                            getRowId={(row) => row.id_dataset ?? row._id ?? `${row.nama_dataset}-${row.sektor_id}-${Math.random()}`}
                            pageSizeOptions={[5, 10, 50, 100]}
                            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
                            getRowHeight={() => 'auto'}
                            getRowClassName={() => 'bg-body'}
                            disableRowSelectionOnClick
                            localeText={{
                              noRowsLabel: "📭 Data Tidak Tersedia", // ganti teks default
                            }}
                            sx={{
                              "--DataGrid-color-background-base": "transparent",
                                backgroundColor: "transparent !important", // paksa transparan table
                                border: "none", // hilangkan border utama
                              "& .MuiDataGrid-root": {
                                backgroundColor: "transparent", // ⬅ background utama transparan
                              },
                              "& .MuiDataGrid-virtualScroller": {
                                overflow: "auto !important" // ⬅ hilangkan scroll
                              },
                              "& .MuiDataGrid-cell": {
                                backgroundColor: "transparent", // ⬅ background cell transparan
                                borderTop:"none"
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
                              "& .custom-header": {
                                backgroundColor: bgku || "#000",
                                color: "white",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                fontSize: "0.85rem"
                              },
                              "& .MuiDataGrid-columnHeader .MuiDataGrid-menuIcon": {
                                opacity: 1,
                                visibility: "visible",
                                width: "auto",
                                color: "#fff"
                              },
                              "& .MuiDataGrid-columnHeader:hover .MuiDataGrid-menuIcon": {
                                opacity: 1
                              },
                              "& .MuiDataGrid-columnHeader .MuiDataGrid-menuIcon button svg": {
                                fill: "#fff"
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
                              "& .MuiDataGrid-overlay": {
                                backgroundColor: "#fff", // transparan
                                fontSize: "14px",
                                fontWeight: "bold",
                                fontStyle:"italic",
                                color: "#888",
                                marginTop: "-10%",
                                textTransform: "uppercase",
                                borderRadius: "6px",
                              },
                            }}
                          />


                        </div>

                      </ThemeProvider>
              
                    </Row>
                  </Col>
                </Row>
              </motion.div>
            )}
          </Container>
        </Col>
      </Row>
    </>
  );
}
