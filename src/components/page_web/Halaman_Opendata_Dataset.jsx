import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import '../../components/styles/style_font.css';
import '../../components/styles/style_bg.css';
import '../../components/styles/style_button.css';
import '../../components/styles/style_design.css';

import React, { useState, useEffect,useContext } from "react";
import axios from "axios";

import AppSearchdata from '../page_sub/dataset_searchdata';
import AppFooter from '../page_sub/opendata_footer';
import FeedbackModal from "../page_sub/FeedbackModal";
import PermohonanLacakModal from "../page_sub/dataset_permohonan_lacak_modal";

import Menu from '../navbar/Menu-Opendata2';
import {Row,Col,Image} from 'react-bootstrap';

import { FcFeedback } from "react-icons/fc";
import { MdHomeFilled, MdInfoOutline, MdOutlineFeaturedPlayList } from "react-icons/md";
import { Link } from 'react-router-dom';
import { ThemeContext } from "../../ThemeContext";
import { api_url_satudata,api_url_satuadmin } from "../../api/axiosConfig";


const portal = "Portal Open Data";

function DatasetPengelolah() {
  const { theme } = useContext(ThemeContext);
  const [totalVisitors, setTotalVisitors] = useState(null);

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [settings, setSetting] = useState("");

  


  useEffect(() => {
    
      getImage();

    const increaseVisitor = async () => {
      try {
        // Increment visitor di backend
        await api_url_satuadmin.post(`api/opendata_visitor/visitor`);

        // Ambil total
        const response = await api_url_satuadmin.get(`api/opendata_visitor/count`);
        setTotalVisitors(response.data);
      } catch (error) {
        console.error('Gagal ambil data pengunjung:', error);
      }
    };

    increaseVisitor();
    
  }, []);

  const getImage = async () => {
    try {

      const response_image = await api_url_satuadmin.get( 'api/open-item/images_item', {
        params: {
          portal:portal
        }
      });
      const data_image = response_image.data.image_opendata_dataset;
      setImage1(data_image.presignedUrl1);
      setImage2(data_image.presignedUrl2);

      const response_setting = await api_url_satuadmin.get(`api/open-item/site_opendata_setting`);
      const data_setting = response_setting.data;
      setSetting(data_setting);

    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  return (
    <div className="App"  
        style={{
          background: `${theme === "dark" 
          ? '#000' 
          : `linear-gradient(170deg, ${settings.bg_body}4D, #fff 40%, #fff 50%, #fff 65%, ${settings.bg_body} 90%, ${settings.bg_body}4D 100%)`}`}}
      >
        
       <Menu bgku={settings.bg_header}/>
      
      <main className='w-100'>
        
        <div className='mx-2 padding-t9 w-100'>
          <Row className='mb-2'>
            <Col md={12} className="d-flex justify-content-between align-items-center" style={{backgroundColor:"#60728b"}}>
                            
              {/* Breadcrumb */}
              <div className="px-3 d-flex rad10 italicku" style={{ paddingTop:"7px", paddingBottom:"7px", width:"fit-content"}}>
                <Link to="/" className="textsize12 text-white-a d-flex"> <MdHomeFilled className='mt-1'/> <span className='px-2'> Beranda</span></Link><span className="mx-3 text-white">/</span>
                <Link to="/Dataset" className="textsize12 text-white-a d-flex"><MdOutlineFeaturedPlayList className='mt-1'/> <span className='px-2'>Koleksi Dataset</span></Link>
              </div>
            </Col>
          </Row>
          <Row className='shaddow4 rad15 mx-2 bg-body '>
            <Col md={2} sm={12} className='float-center'>
              <Image className="img-80 mt-2" src={image1} />
            </Col>
            <Col md={10} sm={12}>
              <Row className=''>
                <Col md={6} sm={12} sx={12} className='float-center'>
                 <p className='textsize20 text-left font_weight700 mb-1 text-body'>Cari Dataset</p>
                </Col>
                <Col md={6} sm={12} sx={12} className=''>
                  <div className='d-flex justify-content-end gap-2'>
                    <a href='/Dataset/Permohonan' className='px-3 py-2 btn btn-orangeblue text-white-a font_weight600 bg-border2 mt-2'>Ajukan Permohonan Dataset</a>
                    <PermohonanLacakModal 
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
                  </div>
                </Col>
               
                
              </Row>
             
              <p 
                className='text-white textsize12 text-left box-header-title'
                style={{background:`linear-gradient(to right, ${settings.bg_content}, ${settings.bg_header})`}}
              >
                Temukan kumpulan data mentah berupa tabel yang bisa diolah lebih lanjut di sini. Portal Satu Data Kab. Probolinggo menyediakan akses ke beragam koleksi dataset dari seluruh Perangkat Daerah (PD) di Kabupaten Probolinggo
              </p>
             
            </Col>
            
          </Row>
          
        </div>
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
         
        
      </main>
      <a href="/Tentang" className="shadow rotated-text-tentang textsize8 d-flex" title="Tentang Opendata">
        <span className="icon-wrapper">
          <MdInfoOutline size={20} />
        </span>
        <span className="text-wrapper">
          Tentang
        </span>
      </a>
      <a href="#Feetback" className="shadow rotated-text-feedback textsize8 d-flex" title="Kirim Feedback">
        <span className="icon-wrapper">
          <FcFeedback size={20} />
        </span>
        <span className="text-wrapper">
          Feedback
        </span>
      </a>
      <FeedbackModal />
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
  );
}

export default DatasetPengelolah;
