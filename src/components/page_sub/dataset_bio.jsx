import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { MdCategory, MdOutlineCategory, MdOutlineDataset } from "react-icons/md";
import { FaAngleDown, FaBuildingColumns, FaDatabase, FaMapLocationDot, FaRectangleList } from 'react-icons/fa6';
import { CgScrollV } from "react-icons/cg";
import { FaSearch } from 'react-icons/fa';
import { Link } from "react-router-dom";

const apiurl = import.meta.env.VITE_API_URL;
const portal = "Portal Open Data";


function AppStatistik({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,bginputku,colortitleku,colordateku }) {
  const [caridataset, setCariDataset] = useState("");

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [dataku, setData] = useState("");

  useEffect(() => {
    setTimeout(() => {
      getImage();
    }, 500); 
  }, []);

  const getImage = async () => {
    try {

      const response_image = await axios.get(apiurl + 'api/open-item/images_item', {
        params: {
          portal:portal
        }
      });
      const data_image = response_image.data.image_opendata_bio;
      setImage1(data_image.presignedUrl1);
      setImage2(data_image.presignedUrl2);
      setData(data_image.contents);

    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };


  return (
    <section id="statistiks" className="block statistik-block pt-5"  style={{background:`linear-gradient(170deg, ${bgbodyku}4D, #fff 40%, #fff 50%, #fff 65%, ${bgbodyku})`}}>
      
      
      <Container fluid className=' pb-5'>
       
        <Row className='px-5 py-5'>
          <Col md={7} xs={12} className='mt-0'>
            <h2 
              className='text-left textsize30 font_weight800 '
              style={{color:colortitleku}}
            >Penasaran dengan data 
              <span className='px-3' 
                style={{color:colordateku}}
              > Kabupaten Probolinggo</span> ?
            </h2>
            {dataku.split('\n').map((item, index) => (
              <p key={index} className="text-left textsize16 text-silver font_weight600">
                  {item.replace(/^\d+\.\s*/, '')}
              </p>
            ))}
            
          </Col>
          <Col md={5} xs={7} className='mt-0'>
            <Image className="img-100 mt-2 anim-bounce" src={image1} />
            
          </Col>
          <Col sm={12} className='mt-5'>
           
            <p 
              className='text-center textsize25 font_weight700 mb-0'
              style={{color:colortitleku}}
            >Cari <span style={{color:colordateku}}>&</span> Unduh Dataset...</p>
            <Row className='d-flex justify-content-center'>
            <Col sm={9}>
              <div className="input-group mt-1">
                <input
                  type="text"
                  placeholder="Data apa yang akan anda cari..."
                  className="form-control bg-input2 textsize16 rad10 custom-placeholder"
                  style={{color:colortitleku,height:'8vh'}}
                  value={caridataset}
                  onChange={(e) => setCariDataset(e.target.value)}
                />
                <Link
                  to={`/Dataset?cari=${caridataset}`}
                  className="btn btn-primary textsize10"
                  style={{ height: '8vh' }}
                >
                  <FaSearch size={20} />
                </Link>
              </div>
            </Col>
            </Row>
            
          </Col>
           
        </Row>
      </Container>
    </section>
  );
}

export default AppStatistik;