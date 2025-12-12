import { useState, useEffect,useRef } from "react";
import axios from "axios";
import qs from 'qs';
import { Link, useParams } from "react-router-dom";
import { Container, Row, Col, Image,Modal, Button } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { motion } from "framer-motion";


import "react-lazy-load-image-component/src/effects/blur.css";

import { TextField, Autocomplete, CircularProgress, createTheme, ThemeProvider, IconButton } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';

import { MdAddchart, MdAutoAwesomeMotion, MdOutlineErrorOutline } from "react-icons/md";
import { FaDownload } from "react-icons/fa6";
import { api_url_satudata,api_url_satuadmin, api_url_satuadmin_create } from "../../api/axiosConfig";



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


const koleksiOptions = [
  { label: "Peta Interaktif", value: "Peta Interaktif" },
  { label: "Peta Layout", value: "Peta Layout" }
];


function AppTeams({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,bginputku,colortitleku,colordateku }) {
  const { cari } = useParams();
  const [loading, setLoading] = useState(true);
  const [datainfografikku, setdatainfografik] = useState([]);
  
  const [sektor_idku, setKategori] = useState([]);
  const [penyusun_ku, setPenyusun] = useState([]);
  
  const [keyworddimensi, setKeywordDimensi] = useState("");
  const [keywordpenyusun, setKeywordPenyusun] = useState("");
  const [kunci, setkunci] = useState( cari|| "");
  const [sortBy, setSortBy] = useState("terbaru"); // default urutan

  const [showModal, setShowModal] = useState(false);
  const [showModalArtikel, setShowModalArtikel] = useState(false);
  const [modalData, setModalData] = useState({ title: '', image: '' });
  const [modalDataArtikel, setModalDataArtikel] = useState({ title: '', image: '', id: '' });
  const swiperRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  
  const pagess = 1;

  const [pagination, setPagination] = useState({     // Info pagination
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1
  });

  const handleShowModal = (data) => {
    setModalData({ title: data.title, image: data.presignedUrl });
    setShowModal(true);
  };
  const handleShowModalArtikel = (data) => {
    setModalDataArtikel({ title: data.title, image: data.presignedUrl_a, id:data.id });
    setShowModalArtikel(true);
  };


  useEffect(() => {
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        img.addEventListener('contextmenu', (e) => e.preventDefault());
      });
  
      return () => {
        images.forEach((img) => {
          img.removeEventListener('contextmenu', (e) => e.preventDefault());
        });
      };
    }, []);
  
  useEffect(() => {
    
    getKategori();
    getPenyusun();
    setTimeout(() => {
      getData({ page: pagess, setkunci: kunci, setdimensi: keyworddimensi, settopik: keywordpenyusun});
      setLoading(false);
    }, 1000); 
  }, []);

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

  const getPenyusun = async () => {
    //console.log("Fetching data with params:", { page, setkunci });
    
    try {

      const response_infografik = await api_url_satuadmin_create.get('api/opendata/infografik/penyusun');

      const res = response_infografik.data;
      setPenyusun(res.data_penyusun);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const getData = async ({page,setkunci,setdimensi,setpenyusun}) => {
    //console.log("Fetching data with params:", { page, setkunci });
    
    try {

      const response_infografik = await api_url_satuadmin.get('api/opendata/infografik', {
        params: {
          search_kunci: setkunci || '',
          search_dimensi: setdimensi || '',
          search_penyusun: setpenyusun || '',
          page,
          limit: pagination.limit
        },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
      });

      const res = response_infografik.data;
      setdatainfografik(res.data);
      setPagination((prev) => ({
        ...prev,
        page: res.pagination.page,
        total: res.pagination.total,
        totalPages: res.pagination.totalPages
      }));

      
     
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleSearch = () => {
    getData({ page:pagess,setkunci: kunci,setdimensi: keyworddimensi,setpenyusun: keywordpenyusun });
  };

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

    const indonesianFormat = `${day} ${monthName} ${year}`;
    return indonesianFormat;
  }

  // 🔥 Urutkan data sebelum render
  const sortedData = [...datainfografikku].sort((a, b) => {
    if (sortBy === "terbaru") {
      return new Date(b.updated_at) - new Date(a.updated_at); 
    }
    if (sortBy === "abjad") {
      return a.title.localeCompare(b.title, "id", { sensitivity: "base" });
    }
    if (sortBy === "z-a") {
      return b.title.localeCompare(a.title, "id", { sensitivity: "base" });
    }
    return 0;
  });

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');        // Ganti spasi dengan strip (-)
      //.replace(/[^\w\-]+/g, '')    // Hapus karakter non-kata
      //.replace(/\-\-+/g, '-');     // Hapus strip ganda
  };

  return (
    <Row className=" mx-5 mt-3 d-flex justify-content-center ">
      <Col md={12} className="px-4 mb-2 bg-body py-4 rad10 shaddow3">
          <Row className="">
            <Col md={12} className="justify-content-center text-center">
              <TextField
                label="Masukkan Kata Kunci"
                className="bg-input rad15 textsize12"
                value={kunci}
                onChange={(e) => setkunci(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                InputProps={{
                  endAdornment: (
                    kunci && (
                      <IconButton
                        aria-label="clear"
                        size="small"
                        onClick={() => {
                          setkunci("") ;
                          getData({ page:pagess,setkunci: "" });
                        }}
                        edge="end"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )
                  ),
                }}
                sx={{ 
                  width: "90%", 
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
           
            
            
          </Row>
      </Col>
      <Col sm={3} xs={12} className="mb-3">
        <Autocomplete
          options={sektor_idku}
          getOptionLabel={(opt) => opt?.nama_sektor || ""}
          value={sektor_idku.find((d) => d.id_sektor === keyworddimensi) || null}
          onChange={(_, v) => setKeywordDimensi(v?.id_sektor || "")}
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
      <Col sm={3} xs={12} className="mb-3">
        <Autocomplete
          options={penyusun_ku}
          getOptionLabel={(opt) => opt?.penyusun || ""}
          value={penyusun_ku.find((d) => d.penyusun === keywordpenyusun) || null}
          onChange={(_, v) => setKeywordPenyusun(v?.penyusun || "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Penyusun"
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
      

      <Col md={10}>
        <section className="block py-1 mt-4 rad15 px-2">
          {loading ? (
            <Spinner />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              
              <Container fluid className='rad15'>   
                <Row className="mb-3 pb-2" style={{borderBottom:"1px solid #c5c3c3"}}>
                  <Col className="text-start">
                    <p className="mb-0 text-muted textsize12 italicku text-body">
                      Ditemukan <strong>{sortedData.length}</strong> Infografik 
                    </p>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <select
                      className="form-select form-select-sm w-auto textsize12"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="terbaru">Urutkan: Terbaru</option>
                      <option value="abjad">Urutkan: A-Z</option>
                      <option value="z-a">Urutkan: Z-A</option> {/* opsional tambahan */}
                    </select>
                  </Col>
                </Row>
                <Row className='portfoliolist justify-content-md-center p-2'>
                  {sortedData.length > 0 ? (
                    <>
                    {
                      sortedData.map((data) => {
                      
                        return (
                          <Col sm={12} md={3} lg={3} xs={12} key={data.id} className='py-2 col-6'>
                            <div className='portfolio-wrapper rad10 bg-body p-2'>
                                <div
                                  className='justify-content-center'
                                >
                                  <div 
                                    className='label text-left py-2'
                                    style={{ height: '20vh',cursor: 'pointer',overflow:"hidden" }}
                                  >
                                    <Image
                                      src={data.presignedUrl_a}
                                      className='shaddow3 rad5'
                                      style={{ height: '20vh',width:"100%",cursor: 'pointer' }}
                                      onContextMenu={(e) => e.preventDefault()}
                                      draggable={false}
                                      onClick={() => handleShowModalArtikel(data)}
                                    />
                                  </div>
                                  <div className='label text-left py-2'>
                                    <p 
                                      className={` textsize10 mb-1`}
                                      style={{color:'#EF6C00'}}
                                    >{convertDate(data.updated_at.toString().replace(/T/, ' ').replace(/\.\w*/, ''))}</p>
                                    <p
                                      className={` textsize11 font_weight600 mb-2 text-body`}
                                      style={{ lineHeight: '1.5',minHeight:"70px"}}
                                    >
                                      {data.title.length > 70 ? data.title.slice(0, 70) + '...' : data.title}
                                    </p>
                                    
                                    <p 
                                      className={` textsize10 mb-2  d-flex text-body`}
                                    ><MdAutoAwesomeMotion size={20} className="mt-1" style={{marginRight:"5px"}} />{data.nama_topik}</p>
                                    <p 
                                      className={` textsize10 mb-3  d-flex text-body`}
                                    ><MdAddchart size={20} className="mt-1" style={{marginRight:"5px"}} />{data.penyusun}</p>
                                    <Link to={`/Infografik/Detail/${slugify(data.title)}`} 
                                      className={`text-white-a textsize10 p-2 rad10`}
                                      style={{backgroundColor:bgcontentku}}
                                    >Baca Selengkapnya </Link>
                                  </div>
                                </div>
                            </div>
                          </Col>
                        );
                      })

                      
                    }
                    {/* Modal */}
                    <Modal show={showModalArtikel} onHide={() => setShowModalArtikel(false)} size="lg" centered style={{ zIndex: 9999 }}>
                      <Modal.Header closeButton>
                        <Modal.Title>{modalDataArtikel.title}</Modal.Title>
                      </Modal.Header>
                      <Modal.Body className="text-center">
                        <Image
                          src={modalDataArtikel.image}
                          fluid
                          className="rad10"
                          onContextMenu={(e) => e.preventDefault()}
                          draggable={false}
                        />
                      </Modal.Body>
                      <Modal.Footer>
                        <Link
                          to={modalDataArtikel.image}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-success"
                        >
                          <FaDownload /> Download
                        </Link>
                        <Button variant="secondary" onClick={() => setShowModalArtikel(false)}>
                          Tutup
                        </Button>
                      </Modal.Footer>
                    </Modal>
                    <Col sm={12}>
                      <div className="d-flex justify-content-center my-3">
                        <nav>
                          <ul className="pagination pagination-sm">
                            {/* Prev Button */}
                            <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                              <button className="page-link" onClick={() => getData(pagination.page - 1)}>
                                &laquo; Kembali
                              </button>
                            </li>

                            {/* Page Numbers */}
                            {Array.from({ length: pagination.totalPages }).map((_, index) => {
                              const pageNum = index + 1;
                              // Optional: tampilkan maksimal 5 halaman dekat halaman aktif
                              if (
                                pageNum === 1 ||
                                pageNum === pagination.totalPages ||
                                (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                              ) {
                                return (
                                  <li
                                    key={pageNum}
                                    className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}
                                  >
                                    <button className="page-link" onClick={() => getData(pageNum)}>
                                      {pageNum}
                                    </button>
                                  </li>
                                );
                              }

                              // Tampilkan titik-titik (...) di sela halaman
                              if (
                                (pageNum === pagination.page - 2 && pageNum > 1) ||
                                (pageNum === pagination.page + 2 && pageNum < pagination.totalPages)
                              ) {
                                return (
                                  <li key={`dots-${pageNum}`} className="page-item disabled">
                                    <span className="page-link">...</span>
                                  </li>
                                );
                              }

                              return null;
                            })}

                            {/* Next Button */}
                            <li
                              className={`page-item ${
                                pagination.page === pagination.totalPages ? 'disabled' : ''
                              }`}
                            >
                              <button className="page-link" onClick={() => getData(pagination.page + 1)}>
                                Lanjut &raquo;
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </Col>
                    </>
                  ) : (
                    <Col xs={12} className="text-center py-5 bg-body rad10">
                      <p className="textsize16 text-silver italicku"><MdOutlineErrorOutline className="text-orange"/> Data Tidak Ditemukan.</p>
                    </Col>
                  )}

                </Row>
                
              </Container>  
            </motion.div>
          )}  
         
        </section>
      </Col>

      

      
    </Row>
  );
}

export default AppTeams;
