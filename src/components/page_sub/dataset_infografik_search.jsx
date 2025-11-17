import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {Container,Row,Col} from 'react-bootstrap';
import { FaBuildingColumns } from "react-icons/fa6";
import { api_url_satuadmin } from "../../api/axiosConfig";




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

const theme = createTheme({
  components: {
    MuiTablePagination: {
      defaultProps: {
        labelRowsPerPage: 'Baris per halaman',
      },
    },
  }
});


function Infografik({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,bginputku,colortitleku,colordateku }) {
  const [loading, setLoading] = useState(true);
  
  //const [pengelolahku, setDatasetPengelolah] = useState([]);
  //const [tagku, setDatasetTag] = useState([]);
  const [datasetku, setDatasetSearch] = useState([]);
  
  

  useEffect(() => {
    setTimeout(() => {
      //getDatasetUnsur();
      getDatasetSearch();
      setLoading(false);
    }, 2000); 
  }, []);

  

  /*const getDatasetUnsur = async () => {
    try {
      const response = await api_url_satuadmin.get( 'api/opendata/dataset_item', {
        params: {
          search_satker: keywordpengelolah
        }
      });

      const data = response.data;


      setDatasetPengelolah(data.resultSatker);
      setDatasetTag(data.resultTag);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };*/

  


  const getDatasetSearch = async () => {
    try {
      const response = await api_url_satuadmin.get( 'api/opendata/dataset_info');

      const data = response.data;

      setDatasetSearch(data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const columns = useMemo(
    () => [
    
      { 
        field: "nama_opd", 
        headerName: "Satker", 
        flex: 4,
        filterable: true,
        headerClassName: "custom-header", // kelas custom
        minWidth: 100,
        renderCell: (params) => {
          const row = params.row;
          return (
            <div className="">
                <p className="cursor-pointer textsize9" style={{color:colortitleku}}><FaBuildingColumns /> {`${row.nama_opd}`}</p>
            </div>
            
          );
        }
      },
      { 
        field: "count_prioritas", 
        headerName: "Data Prioritas", 
        flex: 2,
        sortable: false,
        filterable: false,
        headerClassName: "custom-header", // kelas custom
        minWidth: 100,
        renderCell: (params) => {
          const row = params.row;
          return (
            <div className="">
                <p className="cursor-pointer textsize9">{`${row.count_prioritas}`}</p>
            </div>
            
          );
        }
      },
      { 
        field: "count_nonprioritas", 
        headerName: "Non Prioritas", 
        flex: 2,
        sortable: false,
        filterable: false,
        headerClassName: "custom-header", // kelas custom
        minWidth: 100,
        renderCell: (params) => {
          const row = params.row;
          return (
            <div className="">
                <p className="cursor-pointer textsize9">{`${row.count_nonprioritas}`}</p>
            </div>
            
          );
        }
      },
      { 
        field: "count_spm", 
        headerName: "SPM", 
        flex: 2,
        sortable: false,
        filterable: false,
        headerClassName: "custom-header", // kelas custom
        minWidth: 100,
        renderCell: (params) => {
          const row = params.row;
          return (
            <div className="">
                <p className="cursor-pointer textsize9">{`${row.count_spm}`}</p>
            </div>
            
          );
        }
      },
      { 
        field: "count_other", 
        headerName: "Lainnya", 
        flex: 2,
        sortable: false,
        filterable: false,
        headerClassName: "custom-header", // kelas custom
        minWidth: 100,
        renderCell: (params) => {
          const row = params.row;
          return (
            <div className="">
                <p className="cursor-pointer textsize9">{`${row.count_other}`}</p>
            </div>
            
          );
        }
      }
  
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  
  const rowsku = Array.isArray(datasetku)
  ? datasetku.map((row, index) => ({
      id: index + 1,
      no: index + 1,
      ...row
      
    }))
  : [];

  const memoRows = useMemo(() => rowsku, [rowsku]);


  return (
    <Row className=' margin-t5 mx-5'>
      
      <Col md={12} sm={12} className='float-center margin-b10'>
        <section id="teams" className="block   py-3 rad15 shaddow1 bg-body">
          <div className="">
            <p className="px-2 text-black textsize12 font_weight600">Tabel Dataset Prioritas, Non Prioritas, SPM, dll. per Satker</p>   
          </div>
          <Container fluid>
            <Row className='portfoliolist'>
              <Col sm={12} key={'bodyku'}>
                <Row>
                   {loading ? (
                      <Spinner />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        viewport={{ once: true }}
                      >
                        <ThemeProvider theme={theme}>
                          <DataGrid
                            loading={loading}
                            rows={memoRows}
                            columns={columns}
                            pageSizeOptions={[5, 10, 50, 100]}
                            initialState={{
                              pagination: {
                                paginationModel: { pageSize: 10, page: 0 }
                              }
                            }}
                            disableSelectionOnClick
                            getRowHeight={() => 'auto'}
                            autoHeight // <- ini penting biar tidak scroll
                            localeText={{
                              noRowsLabel: "📭 Data Tidak Tersedia", // ganti teks default
                              toolbarDensity: 'Kepadatan',
                              toolbarDensityLabel: 'Kepadatan',
                              toolbarDensityCompact: 'Kompak',
                              toolbarDensityStandard: 'Standar',
                              toolbarDensityComfortable: 'Nyaman',
                              toolbarFilters: 'Filter',
                              toolbarFiltersLabel: 'Tampilkan filter',
                              toolbarFiltersTooltipHide: 'Sembunyikan filter',
                              toolbarFiltersTooltipShow: 'Tampilkan filter',
                              footerPaginationRowsPerPage: 'Baris per halaman', // Ganti "Rows per page"
                              footerRowSelected: (count) =>
                                count !== 1
                                  ? `${count.toLocaleString()} baris dipilih`
                                  : `${count.toLocaleString()} baris dipilih`,
                            }}
                            
                            sx={{
                              "--DataGrid-color-background-base": "transparent",
                                backgroundColor: "transparent !important", // paksa transparan table
                                border: "none", // hilangkan border utama,
                                marginBottom:"50px",
                              "& .MuiDataGrid-root": {
                                backgroundColor: "transparent", // ⬅ background utama transparan
                                marginBottom:"50px"
                              },
                                "& .MuiDataGrid-row": {
                                marginTop: "8px",
                                paddingTop:"10px",
                                paddingBottom:"10px",
                                paddingLeft:"5px",
                                paddingRight:"5px",
                                backgroundColor: "rgba(255, 255, 255, 0.9)", // bisa dihapus kalau mau full transparan
                                borderRadius: "6px",
                                boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)"
                                
                              },
                              "& .custom-header": {
                                backgroundColor: bgku,
                                color: "white",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                fontSize: "80%"
                              },
                              "& .MuiDataGrid-virtualScroller": {
                                overflow: "auto !important" // ⬅ hilangkan scroll
                              },
                                "& .MuiDataGrid-cell": {
                                backgroundColor: "transparent", // ⬅ background cell transparan
                                borderTop:"none"
                              },
                              "& .MuiTablePagination-select option:not([value='5']):not([value='10']):not([value='20'])": {
                                display: "none"
                              },
                              "& .MuiTablePagination-selectLabel": {
                                color: "#444",
                                fontWeight: "bold",
                                marginTop: "15px"
                              },
                              "& .MuiTablePagination-displayedRows": {
                                color: "#666",
                                marginTop: "15px"
                              },
                              "& .MuiTablePagination-select": {
                                color: "#000",
                                fontWeight: "600",
                                backgroundColor: "#dbdbdb",
                                borderRadius: "6px"
                              },
                              // style kalau tidak ada data
                              "& .MuiDataGrid-overlay": {
                                backgroundColor: "#fff", // transparan
                                fontSize: "14px",
                                fontWeight: "bold",
                                fontStyle:"italic",
                                color: "#888",
                                marginTop: "-10%",
                                textTransform: "uppercase",
                                borderRadius: "6px",
                              },
                            }}
                          />

                        </ThemeProvider>
                    </motion.div>
                  )}
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
      </Col>
    </Row>
    
  );
}

export default Infografik;