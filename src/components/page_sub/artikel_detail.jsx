import { useState, useEffect,useRef  } from "react";
import { useNavigate, useParams,NavLink, Link } from "react-router-dom";
import axios from "axios";
import qs from 'qs';

import { Container, Row, Col, Image,Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";

import { TextField, InputAdornment, IconButton,Box } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { FaMinus,FaFacebookF, FaTwitter, FaWhatsapp,FaLink } from 'react-icons/fa';


import { FaDownload } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules'

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MdHomeFilled, MdOutlineFeaturedPlayList, MdOutlineFeed } from "react-icons/md";





const Spinner = () => 
    <div className="height-map">
      <div className="loaderr2"></div>
      <p className="margin-auto text-center text-silver">Dalam Proses...</p>
    </div>;

const apiurl = import.meta.env.VITE_API_URL;

const portal = "Portal Open Data";

function AppTeams({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,colortitleku,colordateku }) {
  const [loading, setLoading] = useState(true);
  const [dataku, setdataku] = useState([]);
  const [dataartikelku, setdataartikel] = useState([]);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showModalArtikel, setShowModalArtikel] = useState(false);
  const [modalData, setModalData] = useState({ title: '', image: '' });
  const [modalDataArtikel, setModalDataArtikel] = useState({ title: '', image: '' });

  const { id } = useParams();

  
  const handleShowModal = (data) => {
    setModalData({ title: data.title, image: data.presignedUrl });
    setShowModal(true);
  };
  const handleShowModalArtikel = (data) => {
    setModalDataArtikel({ title: data.title, image: data.presignedUrl_a });
    setShowModalArtikel(true);
  };

  useEffect(() => {
    getImages();
  }, []);

  useEffect(() => {
    
    setLoading(true);
    setTimeout(() => {
      getDataById();
      
      getData();
      setLoading(false);
    }, 1000); 
  }, [id]);


  

  const getDataById = async () => {
    try {
      const response = await axios.get(apiurl +`api/opendata/artikel/detail/${id}`);

      if (response?.data) {
        setdataku(response.data); // langsung ambil objek plainItem
      } else {
        console.warn("Data kosong atau format tidak sesuai.");
        setdataku(null); // bukan array kosong
      }

    } catch (error) {
      console.error("Gagal mengambil data:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    }
  };

  const getImages = async () => {
    try {
      
      const response_image = await axios.get(apiurl + 'api/open-item/images_item', {
        params: {
          portal:portal
        }
      });
      const data_image = response_image.data.image_logo;
      const data_image2 = response_image.data.image_diskominfo;
      const data_image3 = response_image.data.image_kabupaten;
      setImage1(data_image.presignedUrl3);
      setImage2(data_image3.presignedUrl1);

    } catch (error) {
      console.error("Gagal mengambil data:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    }
  };

  const getData = async (page = 1) => {
    try {
      
      const response_artikel = await axios.get(apiurl + 'api/opendata/artikel', {
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
      });

      const res_artikel = response_artikel.data;
      setdataartikel(res_artikel.data);
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const ShareButtons = ({ url, title }) => {
    // Pastikan link absolut
    const fullUrl = url?.startsWith('http') ? url : `${window.location.origin}${url}`;
    const shareUrl = encodeURIComponent(fullUrl);
    const shareText = encodeURIComponent(title || 'Cek ini!');
    const [copied, setCopied] = useState(false);

    // Buka popup kecil di tengah layar
    const openPopup = (e, shareLink) => {
      e.preventDefault();
      const width = 600;
      const height = 400;
      const left = (window.innerWidth / 2) - (width / 2);
      const top = (window.innerHeight / 2) - (height / 2);

      window.open(
        shareLink,
        '_blank',
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
      );
    };

    const copyToClipboard = (e) => {
      e.preventDefault();
      const linkToCopy = url?.startsWith('http') ? url : `${window.location.origin}${url}` || window.location.href;

      navigator.clipboard.writeText(linkToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };

    


    return (
      <div className="d-flex gap-3 mt-3 justify-content-center">
        {/* Facebook */}
        <Link
          to={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          onClick={(e) =>
            openPopup(e, `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`)
          }
          className="btn btn-blue p-2 rounded-circle text-white"
          style={{height:"35px",width:"35px"}}
          data-bs-toggle="tooltip"
          title="Facebook"
        >
          <FaFacebookF size={18} style={{marginTop:"-10px",marginLeft:"-1px"}} />
        </Link>

        {/* Twitter */}
        <Link
          to={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
          onClick={(e) =>
            openPopup(e, `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`)
          }
          className="btn btn-blue-sky p-2 rounded-circle text-white"
          style={{height:"35px",width:"35px"}}
          data-bs-toggle="tooltip"
          title="Twitter"
        >
          <FaTwitter size={18} style={{marginTop:"-10px",marginLeft:"-1px"}} />
        </Link>

        {/* WhatsApp */}
        <Link
          to={`https://wa.me/?text=${shareText}%20${shareUrl}`}
          onClick={(e) =>
            openPopup(e, `https://wa.me/?text=${shareText}%20${shareUrl}`)
          }
          className="btn btn-green p-2 rounded-circle text-white"
          style={{height:"35px",width:"35px"}}
          data-bs-toggle="tooltip"
          title="WhatsApp"
        >
          <FaWhatsapp size={19} style={{marginTop:"-10px",marginLeft:"-1px"}} />
        </Link>
        <Link
          to="#"
          onClick={copyToClipboard}
          className="btn btn-dark p-2 rounded-circle text-white"
          style={{ height: "35px", width: "35px" }}
          data-bs-toggle="tooltip"
          title={copied ? "Link sudah disalin!" : "Salin tautan"}
        >
          <FaLink size={19} style={{ marginTop: "-10px", marginLeft: "-1px" }} />
        </Link>
      </div>
    );
  };

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');        // Ganti spasi dengan strip (-)
      //.replace(/\-\-+/g, '-');     // Hapus strip ganda
  };
  const deslugify = (text) => {
    return text
      .toString()
      .trim()
      .replace(/-+/g, ' ');  // semua strip jadi spasi
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
  
  

  return (
    <Row className=" padding-t9 mx-0 px-0 d-flex justify-content-center align-content-center mb-5">
      <Row className='mb-2'>
        <Col md={12} className="d-flex justify-content-between align-items-center" style={{backgroundColor:"#60728b"}}>
                                    
          {/* Breadcrumb */}
          <div className="px-3 d-flex rad10 italicku" style={{ paddingTop:"5px", paddingBottom:"5px", width:"fit-content"}}>
            <Link to="/" className="textsize12 text-white-a d-flex"> <MdHomeFilled className='mt-1'/> <span className='px-2'> Beranda</span></Link><span className="mx-3 text-white">/</span>
            <Link to="/Artikel" className="textsize12 text-white-a d-flex"><MdOutlineFeaturedPlayList className='mt-1'/> <span className='px-2'>Artikel</span></Link><span className="mx-3 text-white">/</span>
            <Link to="/Artikel" className="textsize12 text-white-a d-flex"><MdOutlineFeed className='mt-1'/> <span className='px-2'>{deslugify(id)}</span></Link>
          </div>
        </Col>
        
      </Row>
      

      <Col md={8} className="px-5">
       
            <p 
              className="textsize24 font_weight600 uppercaseku mt-5" style={{lineHeight:"1.2",color:colortitleku}}
            >{dataku.title}</p>
        
        <div className="d-flex mb-4">
          <p className="mb-0 textsize14 text-silver font_weight600 italicku">Admin {dataku.nick_admin}  <FaMinus className="mx-2" />  </p>
          <p className="mb-0 textsize14 text-silver font_weight600 italicku">{convertDate(dataku.updated_at?.replace(/T/, ' ')?.replace(/\.\w*/, ''))}</p>
        </div>
        <Image
          src={dataku.presignedUrl_a}
          className="rad10 w-100 "
         
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
        />
       
       
        {dataku && typeof dataku.content_a === 'string' ? (
          <div className="textsize12">
            {dataku.content_a.split('\n').map((line, index) => (
              <p className="mb-0" key={index}>{line}</p>
            ))}
          </div>
        ) : ("")}
        <Image 
          src={dataku.presignedUrl_b} 
          className="rad10 w-100 mt-3 mb-3"
          onContextMenu={(e) => e.preventDefault()}
          draggable={false} 
        />
        {typeof dataku?.content_b === "string" && dataku.content_b ? (
          <div className="textsize12">
            {dataku.content_b.split('\n').map((line, index) => (
              <p className="mb-0" key={index}>{line}</p>
            ))}
          </div>
        ) : ("")}
        <Image 
          src={dataku.presignedUrl_c} 
          className="rad10 w-100 mt-3 mb-3"
          onContextMenu={(e) => e.preventDefault()}
          draggable={false} 
        />
        {dataku && typeof dataku.content_c === 'string' ? (
          <div className="textsize12">
            {dataku.content_c.split('\n').map((line, index) => (
              <p className="mb-0" key={index}>{line}</p>
            ))}
          </div>
        ) : ("")}
        {typeof dataku?.sumber === "string" && dataku.sumber ? (
          <p className="mt-5 mb-0 textsize12 font_weight600">Sumber: <span className="font_weight400">{dataku.sumber}</span></p>
        ) : ("")}
        {dataku.download_file && dataku.download_file.length >= 3 ? (
          <Link
            to={dataku.presignedUrl_download}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success"
          >
            <FaDownload /> Download File
          </Link>
        ) : null}
      </Col>
      <Col md={3}>
        

        <Row className='portfoliolist justify-content-md-center p-2 mt-5'>
          <Col md={12} sm={12} className='d-flex align-items-center justify-content-center'>
              <div className='px-0 py-4 rad10 bg-zebra-170 d-flex align-items-center justify-content-center w-100"'>
                <Image className="img-100 mx-auto justify-center  d-block px-5" src={image2} style={{width:'70%'}} />
              </div>
          </Col>
          <Col md={12} className="mb-2">
            <div className="d-flex mx-2 py-2 align-items-center justify-content-center rad10" style={{backgroundColor:"#60728b"}}>
              <div className="px-3 d-flex rad10" 
                  style={{paddingBottom:"5px",marginTop:"-10px",width:"fit-content"}}>
                <ShareButtons url={`/Artikel/${dataku.id}`} title={dataku.judul} />
              </div>
            </div>
          </Col>
          
          {dataartikelku.length > 0 ? (
            <>
            {
              dataartikelku
              .slice(0, 4)
              .map((data) => {
                return (
                    <div className=' px-4'>
                        <Row
                          className='justify-content-center rad15 bg-white mb-2 p-2'
                        >
                          <Col md={3} sm={3}
                            className='label text-left py-2'
                            style={{ maxHeight: '210px',cursor: 'pointer' }}
                          >
                            <Image
                              src={data.presignedUrl_a}
                              className='shaddow3 rad10 w-100'
                              style={{ maxHeight: '210px',cursor: 'pointer' }}
                              onContextMenu={(e) => e.preventDefault()}
                              draggable={false}
                              onClick={() => handleShowModalArtikel(data)}
                            />
                          </Col>
                          <Col md={9} sm={9} className='label text-left py-2 mt-0 mb-2'>
                            <p
                              className="text-black textsize12 font_weight600 mb-3"
                              style={{ lineHeight: '1.5' }}
                            >
                              {data.title.length > 70 ? data.title.slice(0, 70) + '...' : data.title}
                            </p>
                            <p className='text-black textsize10 mb-3'>{convertDate(data.updated_at.toString().replace(/T/, ' ').replace(/\.\w*/, ''))}</p>
                            
                            <Link to={`/Artikel/Detail/${slugify(data.title)}`} 
                              className={` text-white-a textsize10 p-2 rad10`}
                              style={{backgroundColor:bgcontentku}}
                            >Baca Selengkapnya </Link>
                          </Col>
                        </Row>
                    </div>
                );
              })
            }
            {/* Modal */}
            <Modal show={showModalArtikel} onHide={() => setShowModalArtikel(false)} size="lg" centered style={{zIndex:9999}}>
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
                  <FaDownload /> Download Gambar
                </Link>
                <Button variant="secondary" onClick={() => setShowModalArtikel(false)}>
                  Tutup
                </Button>
              </Modal.Footer>
            </Modal>
            
            </>
          ) : ("")}
          

        </Row>
      </Col>

      

      
    </Row>
  );
}

export default AppTeams;
