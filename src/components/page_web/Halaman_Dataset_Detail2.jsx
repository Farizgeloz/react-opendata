import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import '../../components/styles/style_font.css';
import '../../components/styles/style_bg.css';
import '../../components/styles/style_button.css';
import '../../components/styles/style_design.css';

import AppPengelolah from '../page_sub/dataset_pengelolah';
import AppSearchdata from '../page_sub/dataset_searchdata';
import AppFooter from '../page_sub/footer';

import Menu from '../navbar/Menu-Sub';
import React from "react";
import {Row,Col,Image} from 'react-bootstrap';


function DatasetPengelolah() {

  return (
    <div className="App">
     
        
      <Menu/>
      
      <main>
        <div className='margin-t10 shaddow1 rad15 mx-2'>
          <Row className='p-2'>
            <Col md={2} sm={12} className='float-center'>
              <Image className="img-100" src={'../../../assetku/images/icons/dataset.png'} />
            </Col>
            <Col md={10} sm={12}>
              <p className='text-blue-dark textsize16 text-left font_weight600'>Dataset</p>
              <p className='text-white textsize12 text-left btn-grad-blue p-2 rad15'>Temukan kumpulan data mentah berupa tabel yang bisa diolah lebih lanjut di sini. Portal Satu Data Kab. Probolinggo menyediakan akses ke beragam koleksi dataset dari seluruh Perangkat Daerah (PD) di Kabupaten Probolinggo</p>
            </Col>
            
          </Row>
          
        </div>
        <Row className='p-2 margin-t5 mx-1'>
          <Col md={4} sm={12}>
              <AppPengelolah/>
          </Col>
          <Col md={8} sm={12} className='float-center'>
              <AppSearchdata/>
          </Col>
        </Row>
        
      </main>
      <footer id="footer">
        <AppFooter />
      </footer>
    </div>
  );
}

export default DatasetPengelolah;
