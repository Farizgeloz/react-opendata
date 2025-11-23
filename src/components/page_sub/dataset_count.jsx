import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect,useContext } from "react";
import axios from "axios";
import { MdAutoAwesomeMotion, MdCategory } from "react-icons/md";
import { FaBuildingColumns, FaDatabase, FaMapLocationDot, FaRectangleList } from 'react-icons/fa6';
import { api_url_satudata,api_url_satuadmin } from "../../api/axiosConfig";

import { ThemeContext } from "../../ThemeContext";


const portal = "Portal Open Data";


function AppStatistik({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,bginputku,colortitleku,colordateku }) {
  const { theme } = useContext(ThemeContext);
  const [luasku, setLuas] = useState("");
  const [populasiku, setPopulasi] = useState("");
  const [kepadatanku, setKepadatan] = useState("");
  const [zonaku, setZona] = useState("");
  const [kodeposku, setKodepos] = useState("");
  const [count_dataset, setCountDataset] = useState("");
  const [row_periode_dataset, setRowsPeriode] = useState([]);
  const [row_sektor_dataset, setRowsSektor] = useState([]);
  const [row_unitwilayah_dataset, setRowsUnitwilayah] = useState([]);
  const [row_kategoridata_dataset, setRowsKategoridata] = useState([]);
  const [count_datasetpublik, setCountDatasetPublik] = useState("");
  const [datasetku_produkdata, setCountDataset_Produkdata] = useState("");
  const [datasetku_sektor, setCountDataset_Sektor] = useState("");
  const [datasetku_satker, setCountDataset_satker] = useState("");
  const [datasetku_periode, setCountDataset_Periode] = useState("");
  const [datasetku_unitwilayah, setCountDataset_Unitwilayah] = useState("");
  const [datasetku_kategoridata, setCountDataset_Kategoridata] = useState("");



  useEffect(() => {
    getStatistik();
  }, []);

  const getStatistik = async () => {
    try {
      const response = await api_url_satuadmin.get( 'api/open-item/ekosistem-bioinfo');
      const data = response.data;
      
      setLuas(data.luas);
      setPopulasi(data.populasi);
      setKepadatan(data.kepadatan);
      setZona(data.zona);
      setKodepos(data.kode_pos);


      const response2 = await api_url_satudata.get("dataset?limit=1000");
      const data2 = response2.data || [];
      // Hitung jumlah dataset per opd
      const countByperOpd = data2.reduce((acc, item) => {
        const opd = item.opd && item.opd.nama_opd 
          ? String(item.opd.nama_opd).toLowerCase() 
          : "tidak ada opd";
        acc[opd] = (acc[opd] || 0) + 1;
        return acc;
      }, {});

      // total dataset semua opd
      const totalDataset = Object.values(countByperOpd).reduce((a, b) => a + b, 0);

      // jumlah opd unik
      const totalOpd = Object.keys(countByperOpd).length;

      setCountDataset(totalDataset);
      setCountDataset_Produkdata(totalOpd);


      const countByperSektor = data2.reduce((acc, item) => {
        const sektor = item.sektor && item.sektor.nama_sektor 
          ? String(item.sektor.nama_sektor).toLowerCase() 
          : "tidak ada sektor";
        acc[sektor] = (acc[sektor] || 0) + 1;
        return acc;
      }, {});

      const totalSektor = Object.keys(countByperSektor).length;
      setCountDataset_Sektor(totalSektor);


      const countByperPriode = data2.reduce((acc, item) => {
        const periode = item.periode_dataset
          ? String(item.periode_dataset).toLowerCase() 
          : "tidak ada unit wilayah";
        acc[periode] = (acc[periode] || 0) + 1;
        return acc;
      }, {});

      // jumlah sektor unik
      const totalPeriode = Object.keys(countByperPriode).length;

      setCountDataset_Periode(totalPeriode);
      const data_countperiode = Object.entries(countByperPriode).map(([periode_dataset, count_periode_dataset]) => ({
        name: periode_dataset,
        y: count_periode_dataset
      }));
      setRowsPeriode(data_countperiode);


      const countByperUnitwilayah = data2.reduce((acc, item) => {
        const unitwilayah = item.unit_wilayah
          ? String(item.unit_wilayah).toLowerCase() 
          : "tidak ada unit wilayah";
        acc[unitwilayah] = (acc[unitwilayah] || 0) + 1;
        return acc;
      }, {});

      // jumlah sektor unik
      const totalUnitwilayah = Object.keys(countByperUnitwilayah).length;

      setCountDataset_Unitwilayah(totalUnitwilayah);
      const data_countunitwilayah = Object.entries(countByperUnitwilayah).map(([unit_wilayah, count_unitwilayah]) => ({
        name: unit_wilayah,
        y: count_unitwilayah
      }));
      setRowsUnitwilayah(data_countunitwilayah);

      const countByperkategoridata = data2.reduce((acc, item) => {
        const kategoridata = item.kategori_dataset
          ? String(item.kategori_dataset).toLowerCase() 
          : "tidak ada kategori dataset";
        acc[kategoridata] = (acc[kategoridata] || 0) + 1;
        return acc;
      }, {});

      // jumlah sektor unik
      const totalkategoridata = Object.keys(countByperkategoridata).length;

      setCountDataset_Kategoridata(totalkategoridata);
      const data_countkategoridata = Object.entries(countByperkategoridata).map(([kategori_dataset, count_kategoridata]) => ({
        name: kategori_dataset,
        y: count_kategoridata
      }));
      setRowsKategoridata(data_countkategoridata);
      
      

      

    } catch (error) {
      console.error("Failed to fetch data:", error);
    }

    

  };
  return (
    <section id="statistiks" className="statistik-block" style={{marginTop:"-6%"}}>
      
      
      <Container fluid className=' pb-5'>
       
        <Row className='px-2 justify-content-center'>
           
            <Col sm={10} className='  rad15 p-3'>
              
              <div className='content text-center'>
                
                 <Row className='d-flex justify-content-center rad5 p-1'>
                    
                   
                    <Col lg={3} md={3} sm={4} xs={12} className='p-1'>
                        <div className='overlay2 rad5 align-middle d-flex flex-column justify-content-center align-items-center' style={{height:'23vh',backgroundColor:bgcontentku}}>
                            <FaDatabase className='align-middle mt-2 mb-2 text-orange' 
                              style={{
                                width:'40px',height:'40px',
                                
                              }}
                            />
                            <div className='text-center px-2'>
                              <p className='textsize16 text-white font_weight600 mb-2' style={{lineHeight: '18px'}}>Dataset Tersedia</p>
                              <p className='textsize24 text-orange font_weight800  mb-0 '>{count_dataset}</p>
                              
                            </div>
                            
                        </div>
                    </Col>
                    <Col lg={2} md={2} sm={4} xs={6} className='p-1'>
                        <div className='overlay2 bg-body rad5 align-middle d-flex flex-column justify-content-center align-items-center' style={{height:'23vh'}}>
                            <FaBuildingColumns className='align-middle mt-2 mb-2' 
                              style={{
                                width:'40px',height:'40px',
                                color: `${theme === "dark" 
                                  ? colordateku 
                                  : colortitleku}`
                              }}
                            />
                            <div className='text-center px-2'>
                              <p className='textsize16 text-body font_weight600 mb-2' style={{lineHeight: '18px'}}>Satker/OPD</p>
                              <p className='textsize24 text-body font_weight800  mb-0 '>{datasetku_produkdata}</p>
                              
                            </div>
                            
                        </div>
                    </Col>
                    
                    <Col lg={2} md={2} sm={4} xs={6} className='p-1'>
                      <a href='/Opendata/Dataset' target="_blank">
                        <div className='overlay2 bg-body rad5 align-middle d-flex flex-column justify-content-center align-items-center' style={{height:'23vh'}}>
                            <MdAutoAwesomeMotion className='align-middle mt-2 mb-2' 
                              style={{
                                width:'40px',height:'40px',
                                color: `${theme === "dark" 
                                  ? colordateku 
                                  : colortitleku}`
                              }}
                            />
                            <div className='text-center px-2'>
                              <p className='textsize16 text-body font_weight600 mb-2' style={{lineHeight: '18px'}}>Sektor Dimensi</p>
                              <p className='textsize24 text-body font_weight800  mb-0 '>{datasetku_sektor}</p>
                              
                            </div>
                            
                        </div>
                      </a> 
                    </Col>
                    <Col lg={2} md={2} sm={4} xs={6} className='p-1'>
                      <a href='/Opendata/Dataset' target="_blank">
                        <div className='overlay2 bg-body rad5 align-middle d-flex flex-column justify-content-center align-items-center' style={{height:'23vh'}}>
                            <MdAutoAwesomeMotion className='align-middle mt-2 mb-2' 
                              style={{
                                width:'40px',height:'40px',
                                color: `${theme === "dark" 
                                  ? colordateku 
                                  : colortitleku}`
                              }}
                            />
                            <div className='text-center px-2'>
                              <p className='textsize16 text-body font_weight600 mb-2' style={{lineHeight: '18px'}}>Unit Wilayah</p>
                              <p className='textsize24 text-body font_weight800  mb-0 '>{datasetku_unitwilayah}</p>
                              
                            </div>
                            
                        </div>
                      </a> 
                    </Col>
                    <Col lg={2} md={2} sm={4} xs={6} className='p-1'>
                      <a href='/Opendata/Dataset' target="_blank">
                        <div className='overlay2 bg-body rad5 align-middle d-flex flex-column justify-content-center align-items-center' style={{height:'23vh'}}>
                            <MdAutoAwesomeMotion className='align-middle mt-2 mb-2' 
                              style={{
                                width:'40px',height:'40px',
                                color: `${theme === "dark" 
                                  ? colordateku 
                                  : colortitleku}`
                              }}
                            />
                            <div className='text-center px-2'>
                              <p className='textsize16 text-body font_weight600 mb-2' style={{lineHeight: '18px'}}>Periode Data</p>
                              <p className='textsize24 text-body font_weight800  mb-0 '>{datasetku_periode}</p>
                              
                            </div>
                            
                        </div>
                      </a> 
                    </Col>
                    {/* <Col lg={2} md={2} sm={4} xs={6} className='p-1'>
                      <a href='/Opendata/Dataset' target="_blank">
                        <div className='overlay2 bg-body rad5 align-middle' style={{height:'150px'}}>
                            <FaBuildingColumns className='align-middle mt-2 mb-2' style={{width:'40px',height:'40px',color:colortitleku}} />
                            <div className='text-center px-2'>
                              <p className='textsize12 text-silver-dark font_weight600 mb-2' style={{lineHeight: '18px'}}>Desa Terhubung</p>
                              <p className='textsize16 text-black font_weight800  mb-0 '>{datasetku_desa}</p>
                              
                            </div>
                            
                        </div>
                      </a> 
                    </Col> */}
                 </Row>
                
               
              </div>
            </Col>
        </Row>
      </Container>
    </section>
  );
}

export default AppStatistik;