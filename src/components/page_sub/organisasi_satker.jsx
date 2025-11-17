import Container from 'react-bootstrap/Container';
import { Carousel, Row, Col, Image } from 'react-bootstrap';

import React, { useRef,useState, useEffect } from "react";
import axios from "axios";
import { FaBuildingColumns } from "react-icons/fa6";
//import Slider from "react-slick";
//import "slick-carousel/slick/slick.css";
//import "slick-carousel/slick/slick-theme.css";
//import { motion } from 'framer-motion';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay'; // opsional, tergantung Swiper versi








const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const fadeZoomVariants = {
  initial: { opacity: 0, x: 100 },
animate: { opacity: 1, x: 0 },
exit: { opacity: 0, x: -100 }
};

function AppKategori() {
  const swiperRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [dataku, setData] = useState([])

  const getData = async () => {
    try {
      const response = await api_url_satuadmin.get( `api/open-item/satker_code`);
      const payload = Array.isArray(response.data) ? response.data : response.data.datas;
      setData(payload.slice(0, 9)); // maksimal 9 item (3 per slide * 3 slide)
    } catch (error) {
      console.error("❌ Gagal mengambil data:", error);
    }
  };

  // ✅ Panggil data saat komponen mount
  useEffect(() => {
    getData();
  }, []);

  // ✅ Jika data sudah siap, nyalakan Swiper autoplay
  useEffect(() => {
    if (dataku.length > 0) {
      setReady(true);

      const timer = setTimeout(() => {
        if (swiperRef.current && swiperRef.current.swiper?.autoplay) {
          swiperRef.current.swiper.autoplay.start();
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [dataku]);

  // ✅ Pisahkan menjadi array 3 per slide
  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  const groupedData = chunkArray(dataku, 3);

  if (!ready) return <div>Loading...</div>; // atau spinner skeleton



  return (
    <section id="works" className="block revolusi-block paddingx-5 margin-t5s">
      <div className="title-holder pt-5 garis6 mb-4">
        <h2 className='text-blue-dark font_weight600  margin-t15s'><FaBuildingColumns className='text-red' style={{marginTop:"-5px"}} /> Instansi <span className='text-red'>Terhubung</span></h2>
      </div>
      <Container fluid className='rad15  bg-body-black mt-5 mb-5'>
        <Row className='portfoliolist justify-content-md-center p-2'>
          {
            dataku.map((item,index) => {
              return (
                <Col sm={6} md={3} lg={3}  key={item.id_sektor} className='py-2 col-6'>
                  <div className='portfolio-wrapper rad15' key={item.id_sektor}>
                    <a href="#">
                      <Image src={item.presignedUrl} className='p-5' />
                      <div className='label2 text-center ' style={{marginTop:"-10px"}}>
                        <h3 className='text-black'>{item.nama_opd}</h3>
                      </div>
                    </a>
                  </div>
                </Col>
                
              );
            })
            
          }
        </Row>
        
        
      </Container>  
    </section>
  );
}

export default AppKategori;