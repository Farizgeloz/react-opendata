import React, { useState, useEffect,useContext } from "react"; // ⬅️ tambahkan useContext di sini
import axios from "axios";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {Row,Col} from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { FaArrowRightArrowLeft, FaArrowUpWideShort, FaBuildingColumns, FaBuildingUser, FaPeopleArrows, FaRectangleList } from "react-icons/fa6";
import { MdOutlineDatasetLinked } from "react-icons/md";
import { motion } from "framer-motion";
import { ThemeContext } from "../../ThemeContext";

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
import { api_url_satudata,api_url_satuadmin } from "../../api/axiosConfig";

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


const portal = "Portal Open Data";

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

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");

  const [isDark, setIsDark] = useState(false);
  const { theme } = useContext(ThemeContext);
  

  

  
  

  useEffect(() => {
    setTimeout(() => {
      getStatistik();
     setLoading(false);
    }, 2000); 
  }, []);

  const getStatistik = async () => {
    try {
      const response = await api_url_satudata.get("dataset");
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
      

      const response_image = await api_url_satuadmin.get( 'api/open-item/images_item', {
        params: {
          portal:portal
        }
      });
      const data_image = response_image.data.image_opendata_kategoribidang;
      setImage1(data_image.presignedUrl1);
      setImage2(data_image.presignedUrl2);

      

    } catch (error) {
      console.error("Failed to fetch data:", error);
    }

    

  };
 

  const options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
    },
    title: {
      text: `<span style="color:${colordateku}">Grafik Jumlah </span>
            <span style="color:${isDark ? '#ccc' : '#333'}">Per Satker</span> /
            <span style="color:${colortitleku}">Produsen Data</span>`,
      useHTML: true,
      style: {
        fontSize: '200%',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '800'
      }
    },
    xAxis: {
      type: 'category',
      labels: {
        autoRotation: [-45, -90],
        style: {
          fontSize: '110%',
          fontFamily: 'Roboto, sans-serif',
          color: isDark ? '#ddd' : '#333',
          fontWeight: 'bold',
        },
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Banyak Data',
        style: {
          fontSize: '110%',
          fontFamily: 'Roboto, sans-serif',
          color: isDark ? '#ccc' : '#666',
          fontWeight: 'bold',
        }
      },
      labels: {
        autoRotation: [-45, -90],
        style: {
          fontSize: '100%',
          fontFamily: 'Roboto, sans-serif',
          color: isDark ? '#aaa' : '#666'
        }
      }
    },
    tooltip: {
      useHTML: true,
      backgroundColor: isDark ? '#333' : '#fff',
      borderColor: isDark ? '#aaa' : '#666',
      style: {
        color: isDark ? '#fff' : '#000',
        fontSize: '90%'
      },
      pointFormatter: function () {
        let dataSum = 0;
        this.series.points.forEach(p => { dataSum += p.y });
        const percentage = ((this.y / dataSum) * 100).toFixed(1);

        return `
          <p><b>${this.name}</b></p>
          <p>Banyak Data: <b>${this.y}</b> (${percentage}%)</p>
        `;
      }
    },
    plotOptions: {
      column: {
        borderRadius: '5%',
        dataLabels: {
          enabled: true
        },
        groupPadding: 0.1,
        borderColor: isDark ? '#555' : '#fff',
        borderWidth: 2,
      }
    },
    series: [{
      name: 'Jumlah',
      colorByPoint: true,
      colors: [bgcontentku, bgku],
      groupPadding: 0,
      data: row_graph,
      dataLabels: {
        enabled: true,
        rotation: -90,
        color: isDark ? '#fff' : '#000',
        inside: true,
        verticalAlign: 'top',
        format: '{point.y:1f}',
        y: 10,
        style: {
          fontSize: '130%',
          fontFamily: 'Roboto, sans-serif',
          color: isDark ? '#fff' : '#000'
        }
      }
    }],
    legend: {
      enabled: false,
      itemStyle: {
        color: isDark ? '#ccc' : '#000',
        fontFamily: 'Roboto, sans-serif',
        fontSize: '70%'
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 600
        },
        chartOptions: {
          chart: { height: 300 }
        }
      }]
    }
  };

  
  
  
  
  return (
    <>
     
      <Row className=" py-2 mx-4 ">
        <Col md={12} sm={12}>
          <div className=' shaddow1 rad15 mx-2 px-2 bg-body'>
            <Row className='p-1'>
              <Col md={2} sm={3} xs={3} className='float-center'>
                <Image className="img-100" src={image1} />
              </Col>
              <Col md={10} sm={9} xs={9}>
                <p className='textsize24 text-left font_weight700 mb-1 text-body'>Info Grafik</p>
                <p 
                  className='text-white textsize14 text-left box-header-title mr-5'
                  style={{background:`linear-gradient(to right, ${bgcontentku}, ${bgku})`}}
                >
                  Info Grafik adalah bentuk penyajian data yang dikemas secara visual melalui kombinasi grafik, diagram, dan elemen visual lainnya, informasi yang kompleks dapat ditampilkan secara ringkas, interaktif, dan menarik.
                </p>
              </Col>
              
            </Row>
              
          </div>
        </Col>
        <Col lg={2} md={12} sm={12} xs={12} className=" px-3 py-3 text-white bg-body shaddow4 rad15  max-height2  margin-t5">
          <Row className=" ">
            <Col lg={12} md={6} sm={6} xs={6}>
              
              <p className=" font_weight600 text-white text-center bg-orange rad15 p-1 d-flex flex-column justify-content-center  align-items-center shaddow4" style={{height:'17vh'}}>
                <MdOutlineDatasetLinked className="mt-1  svg-1  text-black bg-white p-2 rad15" />
                <span className="mt-1 textsize24 font_weight700">{datasetku}</span>
                <span className="mb-1 text-center text-white italicku textsize14">Dataset Tesedia</span>
              </p>
            </Col>
            <Col lg={12} md={6} sm={6} xs={6}>
              
              <p 
                className="font_weight600 text-white text-center rad15 p-1 d-flex flex-column justify-content-center  align-items-center shaddow4"
                style={{backgroundColor:bgku,height:'17vh'}}
              >
                <FaBuildingColumns  className="mt-1  svg-1  text-black bg-white p-2 rad15" />
                <span className="mt-1 textsize24 font_weight700">{datasetku_satker}</span>
                <span className=" mb-1 text-center textsize14 text-white italicku">Satker / OPD</span>
              </p>
            </Col>
            <Col lg={12} md={6} sm={6} xs={6}>
              
              <p 
                className="font_weight600 text-white text-center rad15 p-1 d-flex flex-column justify-content-center  align-items-center shaddow4"
                style={{backgroundColor:bgku,height:'17vh'}}
              >
                <FaBuildingUser className="mt-1  svg-1  text-black bg-white p-2 rad15" />
                <span className="mt-1 textsize24 font_weight700">{datasetku_sektor}</span>
                <span className=" mb-1 text-center textsize14 text-white italicku">Sektor Dimensi</span>
              </p>
            </Col>
            <Col lg={12} md={6} sm={6} xs={6}>
              
              <p 
                className="font_weight600 text-white text-center rad15 p-1 d-flex flex-column justify-content-center  align-items-center shaddow4"
                style={{backgroundColor:bgku,height:'17vh'}}
              >
                <FaBuildingUser className="mt-1  svg-1  text-black bg-white p-2 rad15" />
                <span className="mt-1 textsize24 font_weight700">{datasetku_unitwilayah}</span>
                <span className=" mb-1 text-center textsize14 text-white italicku">Unit Wilayah</span>
              </p>
            </Col>
          
          </Row>
        </Col>    
        <Col  lg={10} md={12} sm={12} xs={12} className="drop-shadow-lg max-height2 margin-t5">
          {loading ? (
            <Spinner />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
                <div className="bg-body  rad15 shaddow4">

                  <HighchartsReact
                    highcharts={Highcharts}
                    options={
                      { 
                        chart: {
                          type: "column",
                          name:"coba",
                          backgroundColor: `${theme === "dark" ? '#212529' : '#ffffff'}`,
                          borderRadius:"5%"
                        },
                        title: {
                          text: `<span style="color:${theme === "dark" ? '#fff' : '#000'}">Grafik Jumlah </span>
                                <span style="color:#EF6C00">Per Satker / Produsen Data</span>`,
                          useHTML: true,
                          style: {
                            fontSize: '200%',
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: '800'
                          }
                        },
                        
                        xAxis: {
                            type: 'category',
                            labels: {
                              autoRotation: [-45, -90],
                              style: {
                                fontSize: '110%',
                                fontFamily: 'Roboto, sans-serif',
                                fontWeight: 'bold', // atau angka seperti '600'
                                color:`${theme === "dark" ? '#fff' : '#000'}`
                              },
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Banyak Data',
                                style: {
                                fontSize: '110%',
                                fontFamily: 'Roboto, sans-serif',
                                fontWeight: 'bold', // atau angka seperti '600'
                                color:`${theme === "dark" ? '#fff' : '#000'}`
                              }
                            },
                            labels: {
                                autoRotation: [-45, -90],
                                style: {
                                    fontSize: '100%',
                                    fontFamily: "Roboto, sans-serif",
                                    color:`${theme === "dark" ? '#fff' : '#000'}`
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
                                    fontSize: '130%',
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
                                    fontSize: '70%'
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

      <Row className="mx-4 my-5">
        {/* Chart - Muncul dulu di mobile, pindah kiri di desktop */}
        <Col lg={12} md={12} sm={12} xs={12} className="drop-shadow-lg order-1 order-xs-last">
          {loading ? (
            <Spinner />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              <Row className="">
                <Col md={6} sm={6} xs={12} className="py-5 px-2">
                  <div className="bg-body  rad15 shaddow4">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={{
                        chart: {
                          plotBackgroundColor: null,
                          plotBorderWidth: null,
                          plotShadow: false,
                          backgroundColor: null,
                          // Donut chart di Highcharts sebenarnya type "pie"
                          type: "pie"
                        },
                        colors: ['#9654be','#f45945','#f9c907','#aad255','#00ada7','#05759a'],
                        title: {
                          text: `<span class="text-body">Grafik Jumlah </span>
                                <span style="color:#EF6C00">Per Sektor</span>`,
                          useHTML: true,
                          style: {
                            fontSize: '200%',
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: '800'
                          }
                        },
                        tooltip: {
                          pointFormat:`{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)`,
                        },
                        accessibility: { enabled: false },


                        plotOptions:
                          
                        {
                          pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            innerSize: "50%",
                            dataLabels: [
                              {
                                enabled: true,
                                distance: 0,
                                style: { fontSize: '0.5em', opacity: 0.7 }
                              },
                              {
                                enabled: true,
                                distance: -40,
                                format: '{point.percentage:.1f}%',
                                style: { fontSize: '80%', opacity: 0.7 }
                              }
                            ],
                            showInLegend: true
                          }
                        },
                        series:
                          [
                            {
                              name: " data",
                              colorByPoint: true,
                              data: row_sektor_dataset
                            }
                          ],

                        legend: {
                          enabled: true,
                          itemStyle: {
                            color:`${theme === "dark" ? '#fff' : '#000'}`,
                            fontFamily: 'MuseoS500',
                            fontSize: '100%'
                          }
                        }
                      }}
                      containerProps={{ style: { height: "100%", width: "100%" } }}
                    />
                  </div>
                </Col>
                <Col md={6} sm={6} xs={12} className="py-5 px-2">
                 <div className="bg-body  rad15 shaddow4">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={{
                        chart: { type: 'area', backgroundColor: null },
                        title: {
                          text: `<span class="text-body">Grafik Jumlah </span>
                                <span style="color:#EF6C00">Per Periode</span>`,
                          useHTML: true,
                          style: {
                            fontSize: '200%',
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: '800'
                          }
                        },
                        
                       xAxis: {
                        categories: row_periode_dataset.map(item => item.name),
                        title: {
                          text: `<span class="text-body">Periode</span>`,
                          useHTML: true, // ⬅️ WAJIB
                          style: {
                            fontSize: '120%',
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 'bold',
                            color:`${theme === "dark" ? '#fff' : '#000'}`
                          }
                        },
                        labels: {
                          autoRotation: [-45, -90],
                          style: {
                            fontSize: '90%',
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 'bold', // atau angka seperti '600'
                            color:`${theme === "dark" ? '#fff' : '#000'}`
                          },
                        }
                      },
                      yAxis: {
                        title: {
                          text: 'Jumlah Data',
                          useHTML: true,
                          style: {
                            fontSize: '14px',
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 'bold',
                            color:`${theme === "dark" ? '#fff' : '#000'}`
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
                </Col>
                <Col md={6} sm={6} xs={12} className="py-5 px-2">
                 <div className="bg-body  rad15 shaddow4">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={{
                        chart: { type: 'bar', backgroundColor: null },
                        title: {
                          text: `<span class="text-body">Grafik Jumlah </span>
                                <span style="color:#EF6C00">Per Unit Wilayah</span>`,
                          useHTML: true,
                          style: {
                            fontSize: '200%',
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: '800'
                          }
                        },

                        xAxis: {
                          categories: row_unitwilayah_dataset.map(item => item.name),
                          title: {
                            text: 'Wilayah',
                            style: { fontSize: '120%', fontWeight: 'bold', color:`${theme === "dark" ? '#fff' : '#000'}` }
                          },
                          labels: {
                            autoRotation: [-45, -90],
                            style: {
                              fontSize: '90%',
                              fontFamily: 'Roboto, sans-serif',
                              fontWeight: 'bold', // atau angka seperti '600'
                              color:`${theme === "dark" ? '#fff' : '#000'}`
                            },
                          }
                        },

                        yAxis: {
                          title: {
                            text: 'Jumlah Data',
                            style: { fontSize: '120%', fontWeight: 'bold', color:`${theme === "dark" ? '#fff' : '#000'}` }
                          },
                          allowDecimals: false
                        },

                        tooltip: { pointFormat: '{series.name}: <b>{point.y}</b>' },

                        plotOptions: {
                          bar: {
                            dataLabels: { enabled: true }
                          }
                        },

                        // daftar warna yang dipakai bergiliran
                        colors: ['#9654be','#f45945','#f9c907','#aad255','#00ada7','#05759a'],

                        series: [{
                          name: 'Jumlah Data',
                          colorByPoint: true, // <- aktifkan ini
                          data: row_unitwilayah_dataset.map(item => item.y)
                        }],
                        legend: { enabled: false }
                      }}
                    />


                 </div>
                </Col>

                <Col md={6} sm={6} xs={12} className="py-5 px-2">
                 <div className="bg-body  rad15 shaddow4">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={{
                        chart: { type: 'column', backgroundColor: null },
                        title: {
                          text: `<span class="text-body">Grafik Jumlah </span>
                                <span style="color:#EF6C00">Per Kategori Data</span>`,
                          useHTML: true,
                          style: {
                            fontSize: '200%',
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: '800'
                          }
                        },

                        xAxis: {
                          categories: row_kategoridata_dataset.map(item => item.name),
                          title: {
                            text: 'Kategori Data',
                            style: { fontSize: '120%', fontWeight: 'bold', color:`${theme === "dark" ? '#fff' : '#000'}` }
                          },
                          labels: {
                            autoRotation: [-45, -90],
                            style: {
                              fontSize: '90%',
                              fontFamily: 'Roboto, sans-serif',
                              fontWeight: 'bold', // atau angka seperti '600'
                              color:`${theme === "dark" ? '#fff' : '#000'}`
                            },
                          }
                        },

                        yAxis: {
                          title: {
                            text: 'Jumlah Data',
                            style: { fontSize: '120%', fontWeight: 'bold', color:`${theme === "dark" ? '#fff' : '#000'}` }
                          },
                          allowDecimals: false
                        },

                        tooltip: { pointFormat: '{series.name}: <b>{point.y}</b>' },

                        plotOptions: {
                          bar: {
                            dataLabels: { enabled: true }
                          }
                        },

                        // daftar warna yang dipakai bergiliran
                        colors: ['#9654be','#f45945','#f9c907','#aad255','#00ada7','#05759a'],

                        series: [{
                          name: 'Jumlah Data',
                          colorByPoint: true, // <- aktifkan ini
                          data: row_kategoridata_dataset.map(item => item.y)
                        }],
                        legend: { enabled: false }
                      }}
                    />


                 </div>
                </Col>

              </Row>
            </motion.div>
          )}
        </Col>
      </Row>

      

             
    </>
  );
};

export default DatasetGraph;
