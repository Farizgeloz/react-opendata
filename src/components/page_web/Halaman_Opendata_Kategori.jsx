import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import '../../components/styles/style_font.css';
import '../../components/styles/style_bg.css';
import '../../components/styles/style_button.css';
import '../../components/styles/style_design.css';

import AppSearchdata from '../page_sub/dataset_kategori_searchdata';
import AppFooter from '../page_sub/opendata_footer';
import FeedbackModal from "../page_sub/FeedbackModal";
import { FcFeedback } from "react-icons/fc";
import { MdInfoOutline } from "react-icons/md";
import { api_url_satudata,api_url_satuadmin } from "../../api/axiosConfig";


import Menu from '../navbar/Menu-Opendata2';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";



function DatasetKategori() {
  const { kategori } = useParams();
  const [totalVisitors, setTotalVisitors] = useState(null);
  const [settings, setSetting] = useState("");

  useEffect(() => {
    setTimeout(() => {
      getImage();
    }, 500);  

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
      
      const response_setting = await api_url_satuadmin.get(`api/open-item/site_opendata_setting`);
      const data_setting = response_setting.data;
      setSetting(data_setting);

    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  return (
    <div className="App bg-body" style={{background:`linear-gradient(170deg, ${settings.bg_body}4D, #fff 40%, #fff 50%, #fff 65%, ${settings.bg_body})`}}>
     
        
      <Menu bgku={settings.bg_header}/>
      
      <main className='w-100'>
       
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
      <Link to="/Tentang" className="shadow rotated-text-tentang textsize8 d-flex" title="Tentang Opendata">
        <span className="icon-wrapper">
          <MdInfoOutline size={20} />
        </span>
        <span className="text-wrapper">
          Tentang
        </span>
      </Link>
      <Link to="#Feetback" className="shadow rotated-text-feedback textsize8 d-flex" title="Kirim Feedback">
        <span className="icon-wrapper">
          <FcFeedback size={20} />
        </span>
        <span className="text-wrapper">
          Feedback
        </span>
      </Link>
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

export default DatasetKategori;
