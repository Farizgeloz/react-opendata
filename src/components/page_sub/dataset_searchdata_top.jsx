import React, { useState, useEffect } from "react";
import axios from "axios";

import {Container,Row,Col} from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { motion } from "framer-motion";
import { MdRemoveRedEye } from "react-icons/md";
import { api_url_satudata,api_url_satuadmin } from "../../api/axiosConfig";
import { Link } from "react-router-dom";

const Spinner = () => 
  <div className='text-center justify-content-center' style={{height:"110px"}}>
      <div className="dot-overlay mt-5" >
          <div className="dot-pulse">
            <span></span>
            <span></span>
            <span></span>
          </div>
          
      </div>
    <p className='text-center text-shadow-border-multicolor-smooth italicku'>Proses ...</p>
  </div>;


const portal = "Portal Open Data";



function DataSearch({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,bginputku,colortitleku,colordateku }) {
  const [loading, setLoading] = useState(true);
 
  const [datasetku, setDatasetSearch] = useState([]);
  const [datacount, setDataCount] = useState([]);
  //const [keywordsatker, setKeywordPengelolah] = useState("");
  //const [keywordtag, setKeywordTag] = useState("");

  const [image1, setImage1] = useState("");
  //const [image2, setImage2] = useState("");
 



  useEffect(() => {
    setTimeout(() => {
      
      setLoading(false);
    }, 2000);  
    setTimeout(() => {
      getDatasetSearch();
      getImage();
    }, 1000); 
    
  }, []);


  const getDatasetSearch = async () => {
    try {
      const response = await api_url_satudata.get("dataset");
      const datasetSearchRaw = response.data;

      const response2 = await api_url_satuadmin.get( `api/opendata/dataset_data_top`);
      const dataCountRaw = response2.data;

    // Buat map id_dataset → count_dataset (langsung dari API)
    // Buat map id_dataset → count (paksa number)
const countMap = new Map(
  dataCountRaw.map((item) => [Number(item.id_dataset), Number(item.count_dataset)])
);

// Gabungkan datasetSearch dengan count_dataset
const datasetWithCount = datasetSearchRaw.map((item) => {
  const count = countMap.get(Number(item.id_dataset)) || 0;
  return {
    ...item,
    count_dataset: count
  };
});

// Urutkan descending
const datasetSorted = [...datasetWithCount].sort(
  (a, b) => b.count_dataset - a.count_dataset
);

/* console.log("countMap", [...countMap.entries()]);
console.log("datasetWithCount", datasetWithCount.map(d => ({
  id: d.id_dataset,
  count: d.count_dataset
})));
console.log("datasetSorted", datasetSorted.map(d => ({
  id: d.id_dataset,
  count: d.count_dataset
}))); */


    setDatasetSearch(datasetSorted);
    setDataCount(dataCountRaw);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const getImage = async () => {
    try {

      const response_image = await api_url_satuadmin.get( 'api/open-item/images_item', {
        params: {
          portal:portal
        }
      });
      const data_image = response_image.data.image_opendata_populer;
      setImage1(data_image.presignedUrl1);
      //setImage2(data_image.presignedUrl2);

    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        // Ganti spasi dengan strip (-)
      .replace(/[^\w\-]+/g, '')    // Hapus karakter non-kata
      .replace(/\-\-+/g, '-');     // Hapus strip ganda
  };


  return (
    <Row className=' margin-t5 mx-1'>
      <Col md={12} sm={12} className='float-center margin-b10' style={{paddingLeft:"2%",paddingRight:"2%"}}>
        <section id="teams" className="block  py-3 bg-body shaddow5 rad15">
          <div className=" rad15 mx-1 text-center">
            <h2 
              className='text-left textsize24 font_weight700 text-body'
            >Dataset <span style={{color:colordateku}}>Terpopuler</span></h2>
          </div>
          <Container fluid>
            {loading ? (
              <Spinner />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <Row className='portfoliolist d-flex justify-content-center ' style={{paddingLeft:"2%",paddingRight:"2%"}}>
                  <Col md={4} xs={9}>
                     <Image className="img-100 mt-2 anim-bounce" src={image1} />
                  </Col>
                  <Col md={8} xs={12} className=" ">
                    <Row>
                      {datasetku
                        ?.slice(0, 6) // ambil 9 data teratas
                        .map((datas, index) => (
                          <Col md={12} xs={12} className="cekkk rad10" key={index}>
                            <Row className="m-1 w-100">
                              <Col md={10} xs={10}>
                                <Link to={`/Dataset/Detail/${slugify(datas.nama_dataset)}`}>
                                  <p
                                    className="textsize12 font_weight600 text-white-a mb-0 shaddow3 rad15 px-3 py-2"
                                    style={{ backgroundColor: bgcontentku }}
                                  >
                                    {datas.nama_dataset}
                                  </p>
                                </Link>
                              </Col>
                              <Col md={2} xs={2} className="justify-content-end d-flex align-items-center">
                                <p
                                  className="px-3 py-2 rad15 text-white"
                                  style={{ backgroundColor: bgcontentku, textAlign: "right",height:"auto",lineHeight:"20px" }}
                                >
                                  <MdRemoveRedEye />
                                  {datas.count_dataset} 
                                </p>
                              </Col>
                            </Row>
                          </Col>
                        ))}
                    </Row>
                  </Col>
                </Row>
              </motion.div>
            )}
          </Container>
        </section>
      </Col>
    </Row>
    
  );
}

export default DataSearch;