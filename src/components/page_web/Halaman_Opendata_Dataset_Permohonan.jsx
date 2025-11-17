import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import '../../components/styles/style_font.css';
import '../../components/styles/style_bg.css';
import '../../components/styles/style_button.css';
import '../../components/styles/style_design.css';

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import AppSearchdata from '../page_sub/dataset_permohonan_form';
import AppFooter from '../page_sub/opendata_footer';

import FeedbackModal from "../page_sub/FeedbackModal";
import PopupIklan from '../page_sub/PopupIklan';

import Menu from '../navbar/Menu-Opendata2';

import { MdHomeFilled, MdInfoOutline, MdOutlineFeaturedPlayList, MdOutlineFeed } from 'react-icons/md';
import { FcFeedback } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { Col, Image, Row } from 'react-bootstrap';
import { api_url_satudata,api_url_satuadmin } from "../../api/axiosConfig";


const portal = "Portal Open Data";

function DatasetPengelolah() {
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [settings, setSetting] = useState("");
  const [totalVisitors, setTotalVisitors] = useState(null);
  
  const bgku="bg-teal";

  useEffect(() => {
    getImages();
    const increaseVisitor = async () => {
      try {
        // Increment visitor di backend
        await api_url_satuadmin.post(`api/satupeta_visitor/visitor`);

        // Ambil total
        const response = await api_url_satuadmin.get(`api/satupeta_visitor/count`);
        setTotalVisitors(response.data);
      } catch (error) {
        console.error('Gagal ambil data pengunjung:', error);
      }
    };

    increaseVisitor();
  }, []);


  useEffect(() => {
    if (imageLoaded) {
      // Kasih sedikit delay agar transisi smooth
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [imageLoaded]);

  const getImages = async () => {
    try {
      

      const response_image = await api_url_satuadmin.get( 'api/open-item/images_item', {
        params: {
          portal:portal
        }
      });
      const data_image = response_image.data.image_logo;
      const data_image2 = response_image.data.image_diskominfo;
      const data_image3 = response_image.data.image_logo;
      setImage1(data_image.presignedUrl3);
      setImage2(data_image2.presignedUrl1);

      const response_setting = await api_url_satuadmin.get(`api/open-item/site_opendata_setting`);
      const data_setting = response_setting.data;
      setSetting(data_setting);

      

      // ✅ Set loading ke false setelah semua data selesai diambil
      //setLoading(false);

    } catch (error) {
      console.error("Failed to fetch data:", error);
      setLoading(false); // Tetap lanjut meski error
    }
  };

  return (
    <>
      {/* {loading ? (
        <div className="spinner-overlay justify-content-center">
          
          <div 
            className={`spinner-content text-center p-4 flip-card-infinite`} 
          >
            {!imageLoaded && (
            <div className="image-placeholder shimmer rad15 img-logo-50px mb-2" />
          )}
          {image1 && (
            <motion.img
              src={image2}
              alt="Logo"
              className={`rad15 w-50 ${imageLoaded ? 'visible' : 'hidden'}`}
              onLoad={() => setImageLoaded(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 1, 0.3] }} // pudar ke terang ke pudar
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            )}
          <div className="dot-pulse mt-3">
            <span></span>
            <span></span>
            <span></span>
          </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
        </motion.div>
      )
      } */}
      <div className={`App bg-body`}  style={{background:`linear-gradient(170deg, ${settings.bg_body}4D, #fff 40%, #fff 50%, #fff 65%, ${settings.bg_body})`}}>
        <Menu bgku={settings.bg_header}/>
        
        <main>

          <div className='mx-2 padding-t9'>
            <Row className='mb-2'>
              <Col md={12} className="d-flex justify-content-between align-items-center" style={{backgroundColor:"#60728b"}}>
                                          
                {/* Breadcrumb */}
                <div className="px-3 d-flex rad10 italicku" style={{ paddingTop:"5px", paddingBottom:"5px", width:"fit-content"}}>
                  <Link to="/" className="textsize12 text-white-a d-flex"> <MdHomeFilled className='mt-1'/> <span className='px-2'> Beranda</span></Link><span className="mx-3 text-white">/</span>
                  <Link to="/Dataset" className="textsize12 text-white-a d-flex"><MdOutlineFeaturedPlayList className='mt-1'/> <span className='px-2'>Dataset</span></Link><span className="mx-3 text-white">/</span>
                  <Link to="" className="textsize12 text-white-a d-flex"><MdOutlineFeaturedPlayList className='mt-1'/> <span className='px-2'>Permohonan</span></Link>
                </div>
              </Col>
              
            </Row>
            <Row className='shaddow1 rad15 mx-2  py-2 bg-body justify-content-center'>
              
              
             
              <Col md={4} sm={12} className='align-items-center justify-content-cente'>
                  <p className='textsize24 text-left font_weight700 mb-1 text-body'>Permohonan Dataset</p>
                <p 
                  className='text-white textsize14 text-left box-header-title'
                  style={{background:`linear-gradient(to right, ${settings.bg_content}, ${settings.bg_header})`}}
                >
                  Permohonan pengadaan dataset merupakan proses bagi pengguna atau instansi untuk mengusulkan penambahan dataset baru yang relevan dengan bidang tertentu. Melalui mekanisme ini, kebutuhan data dapat dipenuhi secara lebih terbuka dan terkoordinasi.
                </p>

              </Col>
              <Col md={6} sm={12}>
                <AppSearchdata  
                  bgku={settings.bg_header} 
                  bgbodyku={settings.bg_body} 
                  bgtitleku={settings.bg_title}
                  bgcontentku={settings.bg_content}
                  bgcontentku2={settings.bg_content2}
                  bgcontentku3={settings.bg_content3}
                  bginputku={settings.bg_input}
                  colortitleku={settings.color_title}
                  colordateku={settings.color_date}
                />
                
              </Col>
              
            </Row>
            
          </div>
        
          
          
          
        </main>
       
        <Link to="#Feetback" className="shadow rotated-text-feedback textsize8 d-flex" title="Kirim Feedback">
          <span className="icon-wrapper">
            <FcFeedback size={20} />
          </span>
          <span className="text-wrapper">
            Feedback
          </span>
        </Link>
        <FeedbackModal  
          bgku={settings.bg_header} 
          bgbodyku={settings.bg_body} 
          bgtitleku={settings.bg_title}
          bgcontentku={settings.bg_content}
          bgcontentku2={settings.bg_content2}
          bgcontentku3={settings.bg_content3}
          bginputku={settings.bg_input}
          colortitleku={settings.color_title}
          colordateku={settings.color_date}
        />
        <footer id="footer">
          <AppFooter 
            bgfooterku={settings.bg_footer}
            visitor_today={totalVisitors?.today || 0}
            visitor_month={totalVisitors?.month || 0}
            visitor_year={totalVisitors?.year || 0}
            visitor_all={totalVisitors?.allTime || 0}
          />
        </footer>
      </div>
    </>
  );
}

export default DatasetPengelolah;
