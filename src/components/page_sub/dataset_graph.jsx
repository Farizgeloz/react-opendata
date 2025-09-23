import React, { useState, useEffect } from "react";
import axios from "axios";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {Row,Col} from 'react-bootstrap';
import { FaArrowRightArrowLeft, FaArrowUpWideShort, FaBuildingColumns, FaBuildingUser, FaPeopleArrows, FaRectangleList } from "react-icons/fa6";
import { MdOutlineDatasetLinked } from "react-icons/md";
import { motion } from "framer-motion";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import api_url from "../../api/axiosConfig";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

  

//const apikey=process.env.REACT_APP_API_KEY;
const apiurl = import.meta.env.VITE_API_URL;

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
    

const DatasetGraph = ({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,bginputku,colortitleku,colordateku }) => {
  const [loading, setLoading] = useState(true);
  const [row_graph, setRowsGraph] = useState([]);
  const [row_periode_dataset, setRowsPeriode] = useState([]);
  const [row_sektor_dataset, setRowsSektor] = useState([]);
  const [row_unitwilayah_dataset, setRowsUnitwilayah] = useState([]);
  const [row_kategoridata_dataset, setRowsKategoridata] = useState([]);

  const [datasetku, setCountDataset] = useState("");
  const [datasetku_sektor, setCountDataset_sektor] = useState("");
  const [datasetku_satker, setCountDataset_satker] = useState("");
  const [datasetku_unitwilayah, setCountDataset_Unitwilayah] = useState("");
  const [datasetku_kategoridata, setCountDataset_Kategoridata] = useState("");
  const [datasetku_kecamatan, setCountDataset_Kecamatan] = useState("");
  const [datasetku_desa, setCountDataset_Desa] = useState("");
  /* const [datasetku_prioritas, setCountDataset_Prioritas] = useState("");
  const [datasetku_nonprioritas, setCountDataset_NonPrioritas] = useState("");
  const [datasetku_spm, setCountDataset_SPM] = useState("");
  const [datasetku_other, setCountDataset_Other] = useState(""); */


  

  useEffect(() => {
    setTimeout(() => {
      getStatistik();
     setLoading(false);
    }, 2000); 
  }, []);

  const getStatistik = async () => {
    try {
      const response = await api_url.get("dataset");
      const data = response.data || [];
      // Hitung jumlah dataset per opd
      const countByperOpd = data.reduce((acc, item) => {
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
      setCountDataset_satker(totalOpd);
      const data_countopd = Object.entries(countByperOpd).map(([nama_opd, count_opd]) => ({
        name: nama_opd,
        y: count_opd
      }));
      setRowsGraph(data_countopd);


      const countByperSektor = data.reduce((acc, item) => {
        const sektor = item.sektor && item.sektor.nama_sektor
          ? String(item.sektor.nama_sektor).toLowerCase() 
          : "tidak ada sektor";
        acc[sektor] = (acc[sektor] || 0) + 1;
        return acc;
      }, {});

      // jumlah sektor unik
      const totalSektor = Object.keys(countByperSektor).length;

      setCountDataset_sektor(totalSektor);
      const data_countsektor = Object.entries(countByperSektor).map(([nama_sektor, count_sektor]) => ({
        name: nama_sektor,
        y: count_sektor
      }));
      setRowsSektor(data_countsektor);


      const countByperPriode = data.reduce((acc, item) => {
        const periode = item.periode_dataset 
          ? String(item.periode_dataset).toLowerCase() 
          : "tidak ada periode";
        acc[periode] = (acc[periode] || 0) + 1;
        return acc;
      }, {});
      const data_countperiode = Object.entries(countByperPriode).map(([periode_dataset, count_periode]) => ({
        name: periode_dataset,
        y: count_periode
      }));
      setRowsPeriode(data_countperiode);

      const countByperUnitwilayah = data.reduce((acc, item) => {
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

      const countByperkategoridata = data.reduce((acc, item) => {
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
    <>
     
      <Row className=" bg-white  py-2 mx-4 my-3 rad15 d-flex flex-column item-align-center justify-content-center">
        
          
        <Col  lg={12} md={12} sm={12} xs={12} className="drop-shadow-lg max-height2">
          {loading ? (
            <Spinner />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="md:col-span-4 col-span-6 p-2 ">
                

                <HighchartsReact
                  highcharts={Highcharts}
                  options={
                    { 
                      chart: {
                        type: "column",
                        name:"coba",
                        backgroundColor: 'transparent',
                      },
                      title: {
                        text: `<span style="color:${colordateku}">Grafik Jumlah </span>
                              <span style="color:${colortitleku}">Per Satker</span> /
                              <span style="color:${colortitleku}">Produsen Data</span>`,
                        useHTML: true,
                        style: {
                          fontSize: '200%',
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: '800' // atau angka seperti '600'
                        }
                      },
                      
                      xAxis: {
                          type: 'category',
                          labels: {
                              autoRotation: [-45, -90],
                              style: {
                              fontSize: '120%',
                              fontFamily: 'Roboto, sans-serif',
                              color: '#000000',
                              fontWeight: 'bold', // atau angka seperti '600'
                            }
                          }
                      },
                      yAxis: {
                          min: 0,
                          title: {
                              text: 'Banyak Data',
                              style: {
                              fontSize: '120%',
                              fontFamily: 'Roboto, sans-serif',
                              color: '#666666',
                              fontWeight: 'bold', // atau angka seperti '600'
                            }
                          },
                          labels: {
                              autoRotation: [-45, -90],
                              style: {
                                  fontSize: '100%',
                                  fontFamily: "Roboto, sans-serif",
                                  color: '#666666'
                              }
                          }
                      },
                      tooltip: {
                        useHTML: true,
                        headerFormat: '<div>',
                        footerFormat: '</div>',
                        pointFormatter: function() {
                          var dataSum = 0,
                            percentage;

                          this.series.points.forEach(function(point) {
                            dataSum += point.y;
                          });

                          percentage = (this.y / dataSum) * 100;
                          let result = percentage.toString().substring(0, 5);

                          return `<p><span><b>${this.name}</b></span></p>
                                <p><span>Banyak Data: <b>${this.y}</b></span> (<span>${result}%</span>)</p>`
                        }
                      },
                      plotOptions: {
                          column: {
                              borderRadius: '5%',
                              dataLabels: {
                                  enabled: true
                              },
                              groupPadding: 0.1,
                              borderColor:'white',
                              borderWidth:3,
                          }
                      },
                      series: [{
                        name: 'Population',
                          colorByPoint: true,
                          colors: [bgcontentku, bgku], // Biru dan Oranye
                          groupPadding: 0,
                          data: row_graph,
                          dataLabels: {
                              enabled: true,
                              rotation: -90,
                              color: '#FFFFFF',
                              inside: true,
                              verticalAlign: 'top',
                              format: '{point.y:1f}', // one decimal
                              y: 10, // 10 pixels down from the top
                              style: {
                                  fontSize: '120%',
                                  fontFamily: 'Roboto, sans-serif',
                                  color:'#ffffff'
                              }
                          }
                      }],
                      legend: {
                          enabled: false,
                          
                          itemStyle: {
                                  color: '#000',
                                  fontFamily: 'Roboto, sans-serif',
                                  fontSize: '120%'
                          }
                      },
                      responsive: {
                        rules: [{
                            condition: {
                                maxWidth: '80vh'
                            },
                            chartOptions: {
                                chart: {
                                    height: 300
                                },
                                subtitle: {
                                    text: null
                                },
                                navigator: {
                                    enabled: false
                                }
                            }
                        }]
                    }
                    }      
                      
                  }
                  containerProps={{ style: { height: "80vh" } }}
                />
              </div>
            </motion.div>
          )}   
        </Col>
            
      </Row>

      <Row className="bg-white  py-2 mx-4 my-3 rad15">
        {/* Chart - Muncul dulu di mobile, pindah kiri di desktop */}
        <Col lg={12} md={12} sm={12} xs={12} className="drop-shadow-lg max-height3 order-1 order-xs-last">
          {loading ? (
            <Spinner />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="p-2">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: { type: 'area', backgroundColor: null },
                    title: {
                      text: `<span style="color:${colordateku}">Grafik Jumlah </span>
                            <span style="color:${colortitleku}">Per Periode</span>`,
                      useHTML: true,
                      style: {
                        fontSize: '200%',
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: '800' // atau angka seperti '600'
                      }
                    },
                    
                    xAxis: {
                      categories: row_periode_dataset.map(item => item.name),
                      title: {
                        text: 'Periode',
                        style: {
                          fontSize: '120%',
                          fontFamily: 'Roboto, sans-serif',
                          color: '#666666',
                          fontWeight: 'bold'
                        }
                      }
                    },
                    yAxis: {
                      title: {
                        text: 'Jumlah Data',
                        style: {
                          fontSize: '120%',
                          fontFamily: 'Roboto, sans-serif',
                          color: '#666666',
                          fontWeight: 'bold'
                        }
                      },
                      allowDecimals: false
                    },
                    tooltip: { pointFormat: '{series.name}: <b>{point.y}</b>' },
                    plotOptions: {
                      area: {
                        marker: {
                          enabled: false,
                          symbol: 'circle',
                          radius: 2,
                          states: { hover: { enabled: true } }
                        },
                        fillOpacity: 0.5
                      }
                    },
                    colors: [bgcontentku],
                    series: [{
                      name: 'Banyak Data',
                      data: row_periode_dataset.map(item => item.y)
                    }],
                    legend: { enabled: false }
                  }}
                  containerProps={{ style: { height: "100%" } }}
                />
              </div>
            </motion.div>
          )}
        </Col>

        {/* Bagian Kiri → Akan pindah ke kanan di layar md */}
        {/* <Col lg={3} md={12} sm={12} xs={12} className="px-5 text-blue-dark order-2 order-xs-first  shaddow4 rad15">
          <Row className=" margin-t5 ">
            <Col lg={12} md={6} sm={6} xs={6}>
              <p className="mb-1 text-center">Prioritas :</p>
              <p className="textsize16 font_weight600 text-white text-center bg-orange rad15 p-1 d-flex justify-content-center align-items-center">
                <FaArrowUpWideShort className="me-2 svg-1 text-black bg-white p-2 rad15" />
                <span>{datasetku_prioritas}</span>
              </p>
            </Col>
            <Col lg={12} md={6} sm={6} xs={6}>
              <p className="mb-1 text-center">Non Prioritas :</p>
              <p 
                className="textsize16 font_weight600 text-white text-center rad15 p-1 d-flex  justify-content-center"
                style={{backgroundColor:bgku}}
              >
                <FaArrowRightArrowLeft className="me-2 svg-1 text-black bg-white p-2 rad15" />
                <span>{datasetku_nonprioritas}</span>
              </p>
            </Col>
            <Col lg={12} md={6} sm={6} xs={6}>
              <p className="mb-1 text-center">SPM :</p>
              <p className="textsize16 font_weight600 text-white text-center bg-orange rad15 p-1 d-flex justify-content-center align-items-center">
                <FaPeopleArrows className="me-2 svg-1 text-black bg-white p-2 rad15" />
                <span>{datasetku_spm}</span>
              </p>
            </Col>
            <Col lg={12} md={6} sm={6} xs={6}>
              <p className="mb-1 text-center">Lainnya :</p>
              <p 
                className="textsize16 font_weight600 text-white text-center rad15 p-1 d-flex  justify-content-center"
                style={{backgroundColor:bgku}}
              >
                <FaRectangleList className="me-2 svg-1 text-black bg-white p-2 rad15" />
                <span>{datasetku_other}</span>
              </p>
            </Col>
          </Row>
        </Col> */}
      </Row>

             
    </>
  );
};

export default DatasetGraph;
