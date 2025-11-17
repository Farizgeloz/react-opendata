import { useState, useEffect,useRef  } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import qs from 'qs';

import { Row, Col } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaMinus,FaFacebookF, FaTwitter, FaWhatsapp,FaLink } from 'react-icons/fa';



import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "react-lazy-load-image-component/src/effects/blur.css";
import { MdAddchart, MdAutoAwesomeMotion, MdDownloadForOffline, MdHomeFilled, MdOutlineFeaturedPlayList, MdOutlineFeed, MdRemoveRedEye } from "react-icons/md";
import ImageSlider from "./infografik_detail_slider"; // ✅ arahkan ke path file yang kamu simpan
import { api_url_satudata,api_url_satuadmin } from "../../api/axiosConfig";





const Spinner = () => 
    <div className="height-map">
      <div className="loaderr2"></div>
      <p className="margin-auto text-center text-silver">Dalam Proses...</p>
    </div>;



const portal = "Portal Open Data";

function AppTeams({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,colortitleku,colordateku }) {
  const [loading, setLoading] = useState(true);
  const [dataku, setdataku] = useState([]);
  
  const [id_infografik, setId_infografik] = useState("");
  const [datacount, setDataCount] = useState("");
  const [datacountdownload, setDataCountDownload] = useState("");
  
    const hasSentRef = useRef(false);
  const [index, setIndex] = useState(0);
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
    console.log("setdataku" + dataku);
  }, [id]);

  useEffect(() => {
    if (!id_infografik) return;                 // tunggu id siap
    if (hasSentRef.current) return;  // cegah double-fire di StrictMode
    hasSentRef.current = true;

    (async () => {
      try {
        //console.log("increaseVisitor fire, id =", id_dataset);
        await api_url_satuadmin.post(
          `api/opendata/infografik_visitor`,
          { id_infografik: id_infografik },                           // kirim JSON
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Gagal tambah visitor:", error?.response?.data || error.message);
      }
    })();

    getDataCount();
    
  }, [id_infografik]);

  const getDataCount = async () => {
      try {
        const response = await api_url_satuadmin.get( `api/opendata/infografik_detail_visitor_count/${id_infografik}`);
        //console.log("Dataset online:", response.data);
        //const data = response.data;
        
        
        setDataCount(response.data.datacount);
        setDataCountDownload(response.data.datacountdownload);
        //fetchData(response.data.document);

        
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
  
  };
  

  

  const getDataById = async () => {
    try {
      const response = await api_url_satuadmin.get(`api/opendata/infografik/detail/${id}`);

      if (response?.data) {
        setdataku(response.data); // langsung ambil objek plainItem
        setId_infografik(response.data.id_infografik); // langsung ambil objek plainItem
        //console.log("📦 dataku dari API:", response.data);
        
      } else {
        console.warn("Data kosong atau format tidak sesuai.");
        setdataku(null); // bukan array kosong
        setId_infografik(null); // langsung ambil objek plainItem
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
      
      const response_image = await api_url_satuadmin.get( 'api/open-item/images_item', {
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
      
      const response_artikel = await api_url_satuadmin.get( 'api/opendata/artikel', {
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
            <Link to="/Infografik" className="textsize12 text-white-a d-flex"><MdOutlineFeaturedPlayList className='mt-1'/> <span className='px-2'>Infografik</span></Link><span className="mx-3 text-white">/</span>
            <Link to="" className="textsize12 text-white-a d-flex"><MdOutlineFeed className='mt-1'/> <span className='px-2'>{deslugify(id)}</span></Link>
          </div>
        </Col>
        
      </Row>
      

      <Col md={9} className="px-5">
       
        <p 
          className="textsize16 font_weight600 uppercaseku mt-5 text-body" style={{lineHeight:"1.2"}}
        >{dataku.title}</p>

        <Row>
          <Col md={6}>
            {dataku && <ImageSlider dataku={dataku} />}
            
           
          </Col>
          <Col md={6}>
            <div className="d-flex mb-2">
              <p className="mb-0 textsize10 text-silver font_weight600 italicku">Admin {dataku.nick_admin}  <FaMinus className="mx-2" />  </p>
              <p className="mb-0 textsize10 text-silver font_weight600 italicku">{convertDate(dataku.updated_at?.replace(/T/, ' ')?.replace(/\.\w*/, ''))}</p>
              <p className="text-body textsize10 text-center font_weight600 max-width-180 rad10 px-2 mx-1">
                <MdRemoveRedEye size={20} style={{ marginTop: "-1px" }} /> {datacount}
              </p>
              <p className="text-body textsize10 text-center font_weight600 max-width-180 rad10 px-2 mx-1">
                <MdDownloadForOffline size={20} style={{ marginTop: "-1px" }} /> {datacountdownload}
              </p>
            </div>
            <div className="d-flex mb-2 gap-3">
              <p 
                className={` textsize10 mb-2  d-flex bg-border2 px-5 py-2 rad5`}
                style={{height:"50px"}}
              ><MdAutoAwesomeMotion size={20} className="mt-1" style={{marginRight:"5px"}} />{dataku.nama_topik}</p>
              <p 
                className={` textsize10 mb-3  d-flex bg-border2 px-5 py-2 rad5`}
                style={{height:"50px"}}
              ><MdAddchart size={20} className="mt-1" style={{marginRight:"5px"}} />{dataku.penyusun}</p>
            </div>
            <div className="d-flex justify-content-center align-items-center text-center">
              
            </div>
            
            <p 
              className="textsize12 font_weight600 uppercaseku mt-3 text-body" style={{lineHeight:"1.2"}}
            >{dataku.sub_title}</p>

            {dataku && typeof dataku.content === 'string' ? (
              <div className="textsize10 mt-3">
                 <div className='textsize12 text-body' dangerouslySetInnerHTML={{ __html: dataku.content }} />
                
              </div>
            ) : ("")}
            {typeof dataku?.sumber === "string" && dataku.sumber ? (
              <p className="mt-5 mb-0 textsize12 font_weight600" style={{color:'#EF6C00'}}>Sumber: <span className="font_weight400">{dataku.sumber}</span></p>
            ) : ("")}
            <div className="d-flex mt-5 mx-2 py-2 align-items-center justify-content-center rad10 bg-border2">
              <div className="px-3 d-flex rad10" 
                  style={{paddingBottom:"5px",marginTop:"-10px",width:"fit-content"}}>
                  {dataku.title &&
                    <ShareButtons url={`/Infografik/Detail/${slugify(dataku.title)}`} title={dataku.title} />
                  }
              </div>
            </div>
          </Col>
        </Row>
        
        
      </Col>
      

      

      
    </Row>
  );
}

export default AppTeams;
