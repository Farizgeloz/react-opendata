import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import '../../components/styles/style_font.css';
import '../../components/styles/style_bg.css';
import '../../components/styles/style_button.css';
import '../../components/styles/style_design.css';

import AppSatker from '../page_sub/bantuan';
import AppFooter from '../page_sub/opendata_footer';
import FeedbackModal from "../page_sub/FeedbackModal";
import Menu from '../navbar/Menu-Opendata2';

import { FcFeedback } from "react-icons/fc";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { api_url_satudata,api_url_satuadmin } from "../../api/axiosConfig";


const portal = "Portal Open Data";

function Dashboard() {
  //const [image1, setImage1] = useState("");
  //const [image2, setImage2] = useState("");
  const [totalVisitors, setTotalVisitors] = useState(null);
  const [settings, setSetting] = useState("");

  useEffect(() => {
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
  useEffect(() => {
    setTimeout(() => {
      getImage();
    }, 500);  
    
  }, []);

  const getImage = async () => {
    try {

      /*const response_image = await api_url_satuadmin.get( 'api/open-item/images_item', {
        params: {
          portal:portal
        }
      });
      const data_image = response_image.data.image_opendata_dataset;
      setImage1(data_image.presignedUrl1);
      setImage2(data_image.presignedUrl2);*/

      const response_setting = await api_url_satuadmin.get(`api/open-item/site_opendata_setting`);
      const data_setting = response_setting.data;
      setSetting(data_setting);

    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  return (
    <div className="App bg-body">
     
        
       <Menu bgku={settings.bg_header}/>
      
      <main className='bg-body mt-10'>
        
        <AppSatker />
        
      </main>
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

export default Dashboard;
