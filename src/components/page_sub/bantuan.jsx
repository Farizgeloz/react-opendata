import Container from 'react-bootstrap/Container';
import { Row, Col, Table, Accordion } from 'react-bootstrap';
import React, { useEffect, useState } from "react";
import { FaBuildingColumns, FaBookOpen } from "react-icons/fa6";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { api_url_satudata, api_url_satuadmin } from "../../api/axiosConfig";

function AppKategori({ bgku, bgbodyku, bgtitleku, bgcontentku, bgcontentku2, bgcontentku3, bginputku, colortitleku, colordateku }) {
  const [dataku, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await api_url_satuadmin.get('openitem/opendata-bantuan');
      const data = response.data.resultWithUrls;
      setData(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  // Fungsi scroll yang lebih aman untuk Production/Server
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Menghitung offset jika ada sticky header (opsional)
      const headerOffset = 80; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="works" className="revolusi-block paddingx-5">
      <Container fluid className='rad15 mt-5 mb-5'>
        <Row className='portfoliolist justify-content-md-left p-2'>
          <Col sm={12} md={9} lg={9} className='py-2 text-left' style={{ overflow: 'auto' }}>
            {dataku.map((datas, index) => (
              <section key={index} id={datas.seksi} style={{ paddingTop: '5%', marginBottom: '20px' }}>
                <div className="pt-5 mb-4">
                  <p className='textsize20 font_weight600 margin-t15s text-body'>
                    <FaBookOpen style={{ marginTop: "-5px" }} /> {datas.title}
                  </p>
                </div>
                <div className='textsize12 text-body' dangerouslySetInnerHTML={{ __html: datas.content }} />
              </section>
            ))}
          </Col>

          <Col sm={5} md={3} lg={3} className='py-2 text-left'>
            <Accordion defaultActiveKey="0" style={{ position: "fixed", width: "300px" }} className='mt-5 custom-accordion'>
              {/* Seksi Open Data */}
              <Accordion.Item eventKey="0">
                <Accordion.Header>Open Data Probolinggo</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-unstyled mb-0">
                    {dataku
                      .filter(datas => datas.kategori === "Opendata")
                      .map((datas, index) => (
                        <li key={index} className="mb-2">
                          <a
                            href={`#${datas.seksi}`}
                            onClick={(e) => scrollToSection(e, datas.seksi)}
                            className="text-green-a textsize12"
                            style={{ cursor: 'pointer', textDecoration: 'none' }}
                          >
                            {datas.title}
                          </a>
                        </li>
                      ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>

              {/* Seksi Dataset */}
              <Accordion.Item eventKey="1">
                <Accordion.Header>Dataset</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-unstyled mb-0">
                    {dataku
                      .filter(datas => datas.kategori === "Dataset")
                      .map((datas, index) => (
                        <li key={index} className="mb-2">
                          <a
                            href={`#${datas.seksi}`}
                            onClick={(e) => scrollToSection(e, datas.seksi)}
                            className="text-green-a textsize12"
                            style={{ cursor: 'pointer', textDecoration: 'none' }}
                          >
                            {datas.title}
                          </a>
                        </li>
                      ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default AppKategori;