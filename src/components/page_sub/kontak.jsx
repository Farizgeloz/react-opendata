import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';



function AppKontak() {
  return (
    <section id="kontak" className="block statistik-block margin-t10 py-10">
      
      <Container fluid className=' margin-t10'>
        <iframe className='w-100' title="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9402.474234141997!2d113.40938301209272!3d-7.762924977704708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7005af3181627%3A0x4b033c7ae3a4880e!2sKantor%20Bupati%20Probolinggo!5e0!3m2!1sid!2sid!4v1746818580876!5m2!1sid!2sid" height="450px"></iframe>
        <Row className='px-5 bg-sage'>
          <Col sm={12}>
          
        </Col>
            <Col sm={3}>
              
              <div className='content py-5'>
                <h3 className='text-white font_weight600'>Temukan Kami</h3>
                <span className='designation text-white'>Jalan: Raya Panglima Sudirman No. 134</span>
                <p className='text-white'>Kota Kraksaan Kab. Probolinggo</p>
              </div>
            </Col>
            <Col sm={5}>
              
              <div className='content py-5'>
                <h3 className='text-white font_weight600'>Temukan Kami</h3>
                <span className='designation text-white'>Jalan: Raya Panglima Sudirman No. 134</span>
                <p className='text-white'>Kota Kraksaan Kab. Probolinggo</p>
              </div>
            </Col>
            <Col sm={3}>
              
              <div className='content py-5 d-flex'>
                 <img src="/assetku/logo-kab-probolinggo.png" className='img-header'  />
                  <div className="footer-logo ">
                    <p className='textsize10 font_weight600 text-orange '>Portal</p>
                    <p className='textsize12 font_weight600 text-white '>Kab. Probolinggo</p>
                    
                  </div>
              </div>
            </Col>
        </Row>
      </Container>
    </section>
  );
}

export default AppKontak;