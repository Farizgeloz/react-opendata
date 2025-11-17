import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import '../../components/styles/style_font.css';
import '../../components/styles/style_bg.css';
import '../../components/styles/style_button.css';
import '../../components/styles/style_design.css';

import AppFooter from '../page_sub/opendata_footer';
import Menu from '../navbar/Menu-Opendata2';
import React, { useState, useEffect,useContext } from "react";
import axios from "axios";
import { useNavigate, useParams,NavLink, Link } from "react-router-dom";
import {Row,Col,Image} from 'react-bootstrap';
import { MdRemoveRedEye,MdDownloadForOffline, MdOutlineListAlt, MdOutlineEditCalendar, MdHomeFilled, MdOutlineFeaturedPlayList, MdOutlineFeed } from "react-icons/md";
import { FaMinus,FaFacebookF, FaTwitter, FaWhatsapp,FaLink } from 'react-icons/fa';

import Papa from 'papaparse';
import useFetch from '../page_sub/useFeach';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

//import { readString } from 'react-papaparse';
import _ from "lodash";

import Dropdown from 'react-bootstrap/Dropdown';
import { CSVLink } from "react-csv";
import { motion } from "framer-motion";
import { DataGrid } from "@mui/x-data-grid";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { downloadJSON } from '../utils/downloadJSON';
import { useRef } from 'react';
import { FaRecycle } from 'react-icons/fa6';
import { Autocomplete, TextField } from '@mui/material';
import { api_url_satudata,api_url_satuadmin } from "../../api/axiosConfig";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import 'highcharts/highcharts-more';
import 'highcharts/modules/solid-gauge';

import { ThemeContext } from "../../ThemeContext";

const XLSX = window.XLSX;

const portal = "Portal Open Data";


// Theme MUI custom label pagination
const theme = createTheme({
  components: {
    MuiTablePagination: {
      defaultProps: {
        labelRowsPerPage: "Data per halaman:"
      }
    }
  }
});


//const Spinner = () => <div className="loaderr3 "></div>;
const Spinner = () => (
  <div className='text-center justify-content-center' style={{height:"110px"}}>
    <div className="dot-overlay mt-5" >
        <div className="dot-pulse">
          <span></span>
          <span></span>
          <span></span>
        </div>
        
    </div>
    <p className='text-center text-shadow-border-multicolor-smooth italicku'>Proses ...</p>
  </div>
);


const GaugeChartCol = ({ item, keywordX,data_chart_a }) => {
  const colRef = useRef(null);
  const [colWidth, setColWidth] = useState(150);
  const { themeku } = useContext(ThemeContext);

  useEffect(() => {
    const handleResize = () => {
      if (colRef.current) {
        setColWidth(colRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={colRef} className='shaddow4'>
      <HighchartsReact
        highcharts={Highcharts}
        options={{
          chart: {
            type: "solidgauge",
            plotBackgroundColor: null,
            backgroundColor: null, // latar chart full
            plotBorderWidth: 0,
            plotShadow: true, // aktifkan shadow
            height: colWidth, // tinggi sama dengan lebar agar bulat
            width: colWidth,
            shadow: {
              color: 'rgba(0, 0, 0, 0.3)',
              offsetX: 0,
              offsetY: 4,
              opacity: 0.5,
              width: 10
            },
          },
          title: {
            text: "",
            style: {
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
              color:`${themeku === "dark" ? '#fff' : '#000'}`,
              fontWeight: '600',
            }
          },
          tooltip: { enabled: false },
          pane: {
            startAngle: -90,
            endAngle: 90,
            background: {
              backgroundColor: '#eee',
              innerRadius: '60%',
              outerRadius: '100%',
              shape: 'arc'
            }
          },
          yAxis: {
            min: 0,
            max: Math.max(...data_chart_a.map(d => d.y)) * 1.2,
            stops: [
              [0.1, '#DF5353'],
              [0.5, '#DDDF0D'],
              [0.9, '#55BF3B']
            ],
            lineWidth: 0,
            tickWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            title: { text: item.y },
            labels: { y: 16 }
          },
          plotOptions: {
            solidgauge: {
              dataLabels: {
                y: -20,
                borderWidth: 0,
                useHTML: true,
                format: `<div class="text-body" style="text-align:center">
                          <span style="font-size:24px">{y}</span><br/>
                          <span style="font-size:16px;opacity:0.6">${item.name ? item.name : ''}</span>
                        </div>`
              }
            }
          },
          series: [
            { name: item.name, data: [item.y] }
          ],
          legend: { enabled: false }
        }}
        containerProps={{ style: { width: "100%" } }}
      />
    </div>
  );
};



function DatasetPengelolah() {
  const [loading, setLoading] = useState(true);
  const { themeku2 } = useContext(ThemeContext);
  const [isMobile, setIsMobile] = useState(false);
  const hasSentRef = useRef(false);
  const [totalVisitors, setTotalVisitors] = useState(null);
  const [settings, setSetting] = useState("");
  const [id_dataset, setId_dataset] = useState("");
  const [Nama_dataset, setNama_dataset] = useState("");
  const [satker, setsatker] = useState("");
  const [Kategori, setkategori] = useState("");
  const [unit_wilayah, setunit_wilayah] = useState("");
  const [Kategori_Data, setKategori_Data] = useState("");
  const [Periode_dataset, setPeriode_dataset] = useState("");
  const [TanggalUnggah, setTanggalUnggah] = useState("");
  const [TanggalUpdate, setTanggalUpdate] = useState("");
  const [Statistik, setStatistik] = useState("");
  const [Klasifikasi, setKlasifikasi] = useState("");
  const [Konsep, setKonsep] = useState("");
  const [Definisi, setDefinisi] = useState("");
  const [Ukuran, setUkuran] = useState("");
  const [Satuan, setSatuan] = useState("");
  const [variabel_a, setvariabel_a] = useState("");
  const [kuantitas_a, setkuantitas_a] = useState("");
  const [grafik_a, setgrafik_a] = useState("");
  const [variabel_b, setvariabel_b] = useState("");
  const [kuantitas_b, setkuantitas_b] = useState("");
  const [grafik_b, setgrafik_b] = useState("");
  const [variabel_c, setvariabel_c] = useState("");
  const [kuantitas_c, setkuantitas_c] = useState("");
  const [grafik_c, setgrafik_c] = useState("");
  const [deskripsi_dataset, setdeskripsi_dataset] = useState("");
  const [documentt, setDocument] = useState();

  const [data, setData] = useState([]);
  const [datacount, setDataCount] = useState("");
  const [datacountdownload, setDataCountDownload] = useState("");

  const [columns, setColumns] = useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [keywordX, setKeywordX] = useState("");
  const [keywordY, setKeywordY] = useState("");
  const [keywordM, setKeywordM] = useState("");
  const [keywordC, setKeywordC] = useState("");
  const [msg, setMsg] = useState("");
  const { id } = useParams();


  const [groupedSums_a, setGroupedSums_a] = useState({});
  const [groupedSums_b, setGroupedSums_b] = useState({});
  const [groupedSums_c, setGroupedSums_c] = useState({});

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");

  const currentUrl = window.location.href;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=Check%20this%20out!`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    instagram: `https://www.instagram.com/`, // hanya redirect, tidak bisa auto share
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  

  useEffect(() => {
    getSetting();
    const increaseVisitor = async () => {
      try {
        // Increment visitor di backend
        await api_url_satuadmin.post(`api/opendata_visitor/visitor`);

        // Ambil total
        const response = await api_url_satuadmin.get(`api/opendata_visitor/count`);
        setTotalVisitors(response.data);
      } catch (error) {
        console.error('Gagal ambil data pengunjung:', error);
      }
    };

    increaseVisitor();
  }, []); // Hanya dipanggil sekali di awal
  

  useEffect(() => {

    if (settings) {
      // Tunggu settings siap
      const timer = setTimeout(() => {
        getDataById();
        //getImages();
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer); // Bersihkan timeout saat komponen unmount
    }
  }, [settings/*,variabel_a,kuantitas_a,grafik_a ,variabel_b,kuantitas_b,grafik_b,variabel_c,kuantitas_c,grafik_c */]);


  const getDataById = async () => {
      try {
        const response = await api_url_satudata.get(`dataset/${id}`);
        //console.log("Dataset online:", response.data);
        //console.log("fileku : "+response.data.file[0].link);
        //const data = response.data;
        
        setId_dataset(response.data.id_dataset);
        setNama_dataset(response.data.nama_dataset);
        setsatker(response.data.opd.nama_opd);
        setkategori(response.data.sektor.nama_sektor);
        setunit_wilayah(response.data.unit_wilayah);
        setKategori_Data(response.data.kategori_dataset);
        setPeriode_dataset(response.data.periode_dataset);
        setSatuan(response.data.satuan.nama_satuan);
        setdeskripsi_dataset(response.data.deskripsi_dataset);
        setTanggalUnggah(convertDate(response.data.created_at.toString().replace(/T/, ' ').replace(/\.\w*/, '')));
        //setTanggalUpdate(response.data.updated_at.toString().replace(/T/, ':').replace(/\.\w*/, ''));
        setTanggalUpdate(convertDate(response.data.updated_at.toString().replace(/T/, ' ').replace(/\.\w*/, '')));
        /* setStatistik(response.data.kegiatan_statistik);
        setKlasifikasi(response.data.klasifikasi);
        setKonsep(response.data.konsep);
        setDefinisi(response.data.data.definisi);
        setUkuran(response.data.data.ukuran); */
        setvariabel_a(["tahun", "jumlah_anggota"]);
        setkuantitas_a("sum");
        setgrafik_a("column");
        setvariabel_b(response.data.data.variabel_b);
        setkuantitas_b(response.data.data.kuantitas_b);
        setgrafik_b(response.data.data.grafik_b);
        setvariabel_c(response.data.data.variabel_c);
        setkuantitas_c(response.data.data.kuantitas_c);
        setgrafik_c(response.data.data.grafik_c);
        //setDocument(response.data.data.presignedUrl);

        const response2 = await api_url_satuadmin.get(`api/opendata/dataset_detail_visitor_count/${id_dataset}`);
        setDataCount(response2.data.datacount);
        setDataCountDownload(response.data.datacountdownload);
        //fetchData(response.data.document);


        
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
  
  };


  useEffect(() => {
  // Jika variabel_a kosong atau null → skip
 // Cek minimal satu variabel ada
  // cek minimal satu variabel ada
  /* const isAnyVariableSet =
    (keywordX && keywordX.trim() !== "") ||
    (keywordY && keywordY.trim() !== "") ||
    (variabel_b && variabel_b.length > 0) ||
    (variabel_c && variabel_c.length > 0);

  if (!isAnyVariableSet) return; */


  const getDataById2 = async () => {
    try {
      const response = await api_url_satudata.get(`dataset/${id}`);
      //console.log("📦 Full API response:", response.data);

      const fileLink = response.data.file?.[0]?.link;
      //console.log("🎯 File link yang dipakai:", fileLink);

      if (fileLink) {
        getDocumentData(fileLink);
      } else {
        console.warn("📛 Tidak ada file link di response:", response.data.file);
      }
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        console.error(error);
      }
    }
  };

  getDataById2();

}, [keywordX,keywordY, keywordM, keywordC, variabel_b, kuantitas_b, grafik_b, variabel_c, kuantitas_c, grafik_c]);



  useEffect(() => {
    if (!id_dataset) return;                 // tunggu id siap
    if (hasSentRef.current) return;  // cegah double-fire di StrictMode
    hasSentRef.current = true;

    (async () => {
      try {
        //console.log("increaseVisitor fire, id =", id_dataset);
        await api_url_satuadmin.post(
          `api/opendata/dataset_visitor`,
          { id_dataset: id_dataset },                           // kirim JSON
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Gagal tambah visitor:", error?.response?.data || error.message);
      }
    })();

    getDataCount();
    
  }, [id_dataset]);


  const setDownloadvisitor = async () => {
    await api_url_satuadmin.post(
      `api/opendata/dataset_download`,
      { id_dataset: id_dataset },                           // kirim JSON
      { headers: { "Content-Type": "application/json" } }
    );

  }

  

  const getDataCount = async () => {
      try {
        const response = await api_url_satuadmin.get( `api/opendata/dataset_detail_visitor_count/${id_dataset}`);
        //console.log("Dataset online:", response.data);
        //const data = response.data;
        
        
        setDataCount(response.data.datacount);
        setDataCountDownload(response.data.datacountdownload);
        //fetchData(response.data.document);

        const response_image = await api_url_satuadmin.get( 'api/open-item/images_item', {
          params: {
            portal:portal
          }
        });
        const data_image = response_image.data.image_opendata_komponen;
        const data_image2 = response_image.data.image_kabupaten;
        const data_image3 = response_image.data.image_logo;
        setImage1(data_image.presignedUrl1);
        setImage2(data_image2.presignedUrl1);
        setImage3(data_image3.presignedUrl3);

        
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
  
  };




  const getDocumentData = async (documen) => {
  try {
    // Ambil ekstensi file
    const cleanName = documen.split('?')[0];
    const extension = cleanName.split('.').pop().toLowerCase();
    //console.log("📂 Ekstensi file:", extension);

    let parsedData = [];

    // --- CSV ---
    if (extension === 'csv') {
      const response = await fetch(documen);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const csvData = await response.text();
      const parsedResult = Papa.parse(csvData, { header: true, skipEmptyLines: true });
      parsedData = parsedResult.data;
    }

    // --- Excel XLSX / XLS ---
    else if (extension === 'xlsx' || extension === 'xls') {
      const response = await fetch(documen);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      if (!workbook.SheetNames.length) throw new Error("Excel kosong");

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      parsedData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    }

    // --- Format lain ---
    else {
      console.warn("📛 Format file tidak didukung:", extension);
      return;
    }

    //console.log("📊 Parsed Data:", parsedData);

    // --- Bersihkan data ---
    const cleanedData = parsedData.filter(row =>
      row && Object.keys(row).some(key => row[key] !== "")
    );
    //console.log("🧹 Cleaned Data:", cleanedData);

    // --- Tambahkan ID ---
    const rowscleanWithId = cleanedData.map((row, index) => ({
      id: index + 1,
      ...row
    }));
    setData(rowscleanWithId);
    //console.log("✅ Final Data:", rowscleanWithId);

    // --- Buat kolom dinamis ---
    const hiddenFields = ['id', '_key', 'kode_provinsi', 'kode_kabupaten', 'kemendagri_kode_kecamatan', 'bps_kode_kecamatan'];
    const keys = Object.keys(cleanedData[0] || {});
    const columnDefs = keys
      .filter((key) => !hiddenFields.includes(key.toLowerCase()))
      .map((key) => ({
        field: key,
        headerName: key.toUpperCase(),
        headerAlign: 'center',
        headerClassName: "custom-header",
        flex: (["id","no"].includes(key.toLowerCase())) ? 0 : 1,
        minWidth: (["id","no"].includes(key.toLowerCase())) ? 70 : 100,
        width: (["id","no"].includes(key.toLowerCase())) ? 50 : undefined,
        align: 'left',
        renderCell: (params) => {
          const row = params.row;
          return (
            <div className="bg-body">
                
                   <p className="textsize10 text-body">{`${row[key]}`}</p>
            </div>
            
          );
        }
      }));
    setColumns(columnDefs);
    //console.log("📑 Columns:", columnDefs);

    // --- Lowercase data untuk grouping ---
    const lowercaseData = cleanedData.map((row) => {
      const lowerRow = {};
      for (let key in row) {
        if (!row[key]) continue;
        lowerRow[key.toLowerCase()] = row[key].toString().toLowerCase();
      }
      return lowerRow;
    });

    // --- Helper split variabel ---
    //const parseVars = (v) => v ? v.toLowerCase().split(",").filter(Boolean) : [];
    const parseVars = (v) => {
      if (!v) return [];
      if (Array.isArray(v)) return v.map(s => s.toString().toLowerCase());
      if (typeof v === "string") return v.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      return [];
    };

    // Ambil variabel yang sudah di-set
    const groupX = keywordX ? keywordX.toLowerCase() : null;
    const groupY = keywordY ? keywordY.toLowerCase() : null;
    const groupM = keywordM ? keywordM.toLowerCase() : null;
    const groupC = keywordC ? keywordC.toLowerCase() : null;

    const variabelku_b = parseVars(variabel_b);
    const variabelku_c = parseVars(variabel_c);

    // Log aman
    //console.log("📑 variabelku_b:", variabelku_b);
    //console.log("📑 variabelku_c:", variabelku_c);

    if (groupX && groupY) {
      setGroupedSums_a(
        groupM === "sum"
          ? sumValuesByGroup(lowercaseData, groupX, groupY)
          : groupM === "count"
          ? countByGroup(lowercaseData, groupX, groupY)
          : averageByGroup(lowercaseData, groupX, groupY) // fallback ke average
      );
    }

    

  } catch (error) {
    console.error("🔥 Error membaca file dokumen:", error);
  }
};



  const getSetting = async () => {
    try {
      const response_setting = await api_url_satuadmin.get(`api/open-item/site_opendata_setting`);
      const data_setting = response_setting.data;
      setSetting(data_setting);
        
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  }

  

  const sumValuesByGroup = (array, groupKey, valueKey) => {
    return array.reduce((acc, item) => {
      const group = String(item[groupKey]).toLowerCase(); // aman
      const value = parseFloat(item[valueKey]) || 0.0;   // aman jika valueKey tidak ada atau bukan angka
      acc[group] = (acc[group] || 0) + value;
      return acc;
    }, {});
  };

  const countByGroup = (array, groupKey) => {
    return array.reduce((acc, item) => {
      const group = String(item[groupKey]).toLowerCase();
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {});
  };

  const averageByGroup = (array, groupKey, valueKey) => {
    // simpan total dan count per group
    const grouped = array.reduce((acc, item) => {
      const group = String(item[groupKey]).toLowerCase();
      const value = parseFloat(item[valueKey]) || 0.0;

      if (!acc[group]) {
        acc[group] = { total: 0, count: 0 };
      }

      acc[group].total += value;
      acc[group].count += 1;
      return acc;
    }, {});

    // hitung rata-rata dengan 3 angka di belakang koma
    const averages = {};
    Object.keys(grouped).forEach((key) => {
      const { total, count } = grouped[key];
      averages[key] = count > 0 ? parseFloat((total / count).toFixed(3)) : 0;
    });

    return averages;
  };



  const filteredRows = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  //console.log(datacoba);

  const data_chart_a= Object.entries(groupedSums_a).map(([group, data]) => (
  {
      name: [group],
      y: data
      
  }));

  //console.log("data_chart_a:", data_chart_a);
  

  const data_chart_b= Object.entries(groupedSums_b).map(([group, data]) => (
  {
      name: [group],
      y: data
      
  }));

  const data_chart_c= Object.entries(groupedSums_c).map(([group, data]) => (
  {
      name: [group],
      y: data
      
  }));

  function convertDate(datePicker) {
    const selectedDate = new Date(datePicker);

    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const dayName = dayNames[selectedDate.getDay()];
    const day = selectedDate.getDate();
    const monthName = monthNames[selectedDate.getMonth()];
    const year = selectedDate.getFullYear();

    const jam=selectedDate.getHours();
    const menit=selectedDate.getMinutes();
    const detik=selectedDate.getSeconds();

    const indonesianFormat = `${day} ${monthName} ${year}`;
    return indonesianFormat;
  }


const downloadxls = ()=>{
    const rowHeight = 25;
    const colWidth = 19;
    let ws = XLSX.utils.json_to_sheet(data);

    // Define a style
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "0170b5" } },
      alignment: {
        horizontal: "center", // Center text horizontally
        vertical: "center",   // Center text vertically
        wrapText: true        // Wrap text
      },
    };

    // Apply style to cells A1:M1
    for (let col = 0; col < 13; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); // r: row 0, c: col index
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = headerStyle;
    }

    
    var wscols = new Array(10).fill({ wch: colWidth });
    ws['!cols'] = wscols;

    ws['!rows'] = [
            {'hpt' : 30}]; //height for row 2*/


    let ws2 = XLSX.utils.aoa_to_sheet(
      [
        [Nama_dataset],
        [""],
        [""],
        ["Metadata Info :"],
         ["Kategori",": "+Kategori],
        ["Produsen Data",": "+satker],
        ["Unit Wilayah",": "+unit_wilayah],
        ["Kategori Data",": "+Kategori_Data],
        ["Konsep",": "+Konsep],
        ["Klasifikasi",": "+Klasifikasi],
        ["Tanggal Unggah",": "+TanggalUnggah],
        ["Tanggal Update",": "+TanggalUpdate],
        [""],
        ["Additional Info :"],
        ["Kegiatan Statistik",": "+Statistik],
        ["Definisi",": "+Definisi],
        ["Ukuran",": "+Ukuran],
        ["Satuan",": "+Satuan],
        ["Deskripsi",": "+deskripsi_dataset]
      ]
    );
    ws2["!merges"] = [
      XLSX.utils.decode_range("A1:H2"),
      XLSX.utils.decode_range("A4:C4"),
      XLSX.utils.decode_range("B6:H6"),
      XLSX.utils.decode_range("B7:H7"),
      XLSX.utils.decode_range("B8:H8"),
      XLSX.utils.decode_range("B9:H9"),
      XLSX.utils.decode_range("B10:H10"),
      XLSX.utils.decode_range("B11:H11")
    ];
    
    



    ws2["A1"].s = {
      font: {
        name: 'Arial',
        sz: 12,
        color: { rgb: '#FF000000' },
        bold: true,
        italic: false,
        underline: false,
      },
      alignment: {
        vertical: 'center',
        horizontal: 'center',
      },
    };
    ws2["A4"].s = {
      font: {
        sz: 12,
        color: { rgb: '#0099F7' },
        bold: true,
        italic: false,
        underline: false,
      }
      
    };
    ws2["A15"].s = {
      font: {
        sz: 12,
        color: { rgb: '#0099F7' },
        bold: true,
        italic: false,
        underline: false,
      }
      
    };
     
     
    var wscols2 = [
        {wch:20},
        {wch:20}
    ];
   
    ws2['!cols'] = wscols2;
    /*ws2['!rows'] = [
            {'hpt' : 30}]; //height for row 2*/
    
    /*ws2['!rows'] = [
            {'hpt' : 30}]; //height for row 2*/
    ws2['!rows'] = new Array(data.length).fill({ hpt: rowHeight });
    
    //let ws3 = XLSX.utils.json_to_sheet(metadata2);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dataset");
    XLSX.utils.book_append_sheet(wb, ws2, "Metadata");
    
    //XLSX.utils.decode_range("A1:B2,A2:H2");
    //XLSX.utils.decode_range("A8:B8");
    //let buf = XLSX.write(wb, {bookType:'xlsx', type:'buffer'}); // generate a nodejs buffer
    //let str = XLSX.write(wb, {bookType:'xlsx', type:'binary'}); // generate a binary string in web browser
    XLSX.writeFile(wb, `dataset-${Nama_dataset}-${TanggalUpdate}.xlsx`);
  }


  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const gaugeChunks = chunkArray(data_chart_a, 5);

  const ShareButtons = ({ url, title }) => {
    // Pastikan link absolut
    const fullUrl = url?.startsWith('http') ? url : `${window.location.origin}${url}`;
    const shareUrl = encodeURIComponent(fullUrl);
    const shareText = encodeURIComponent(title || 'Cek ini!');
    const [copied, setCopied] = useState(false);

    // Buka popup kecil di tengah layar
    const openPopup = (e, shareLink) => {
      e.preventDefault();
      const width = 600;
      const height = 400;
      const left = (window.innerWidth / 2) - (width / 2);
      const top = (window.innerHeight / 2) - (height / 2);

      window.open(
        shareLink,
        '_blank',
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
      );
    };

    const copyToClipboard = (e) => {
      e.preventDefault();
      const linkToCopy = url?.startsWith('http') ? url : `${window.location.origin}${url}` || window.location.href;

      navigator.clipboard.writeText(linkToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };

    


    return (
      <div className="d-flex gap-3 mt-3 justify-content-center">
        {/* Facebook */}
        <Link
          to={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          onClick={(e) =>
            openPopup(e, `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`)
          }
          className="btn btn-blue p-2 rounded-circle text-white"
          style={{height:"35px",width:"35px"}}
          data-bs-toggle="tooltip"
          title="Facebook"
        >
          <FaFacebookF size={18} style={{marginTop:"-10px",marginLeft:"-1px"}} />
        </Link>

        {/* Twitter */}
        <Link
          to={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
          onClick={(e) =>
            openPopup(e, `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`)
          }
          className="btn btn-blue-sky p-2 rounded-circle text-white"
          style={{height:"35px",width:"35px"}}
          data-bs-toggle="tooltip"
          title="Twitter"
        >
          <FaTwitter size={18} style={{marginTop:"-10px",marginLeft:"-1px"}} />
        </Link>

        {/* WhatsApp */}
        <Link
          to={`https://wa.me/?text=${shareText}%20${shareUrl}`}
          onClick={(e) =>
            openPopup(e, `https://wa.me/?text=${shareText}%20${shareUrl}`)
          }
          className="btn btn-green p-2 rounded-circle text-white"
          style={{height:"35px",width:"35px"}}
          data-bs-toggle="tooltip"
          title="WhatsApp"
        >
          <FaWhatsapp size={19} style={{marginTop:"-10px",marginLeft:"-1px"}} />
        </Link>
        <Link
          to="#"
          onClick={copyToClipboard}
          className="btn btn-dark p-2 rounded-circle text-white"
          style={{ height: "35px", width: "35px" }}
          data-bs-toggle="tooltip"
          title={copied ? "Link sudah disalin!" : "Salin tautan"}
        >
          <FaLink size={19} style={{ marginTop: "-10px", marginLeft: "-1px" }} />
        </Link>
      </div>
    );
  };
  
  const slugify2 = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[-_]+/g, ' ')   // ganti strip & underscore jadi spasi
      .replace(/\s+/g, ' ')     // rapikan spasi berlebih jadi satu spasi
      .replace(/[^\w\s]+/g, ''); // hapus karakter selain huruf, angka, spasi
  };


  return (
    <div className="App bg-body">
     
        
      <Menu bgku={settings.bg_header} />
      
      <main className='mx-1 padding-t8 '>
        <div className=''>
          <Row className='p-2  mb-0'>
            <Col md={12} className="d-flex justify-content-between align-items-center" style={{backgroundColor:"#60728b"}}>
              
              {/* Breadcrumb */}
              <div className="px-3 d-flex rad10 italicku" style={{ paddingTop:"5px", paddingBottom:"5px", width:"fit-content"}}>
                <Link to="/" className="textsize12 text-white-a d-flex"> <MdHomeFilled className='mt-1'/> <span className='px-2'> Beranda</span></Link><span className="mx-3 text-white">/</span>
                <Link to="/Dataset" className="textsize12 text-white-a d-flex"><MdOutlineFeaturedPlayList className='mt-1'/> <span className='px-2'>Koleksi Dataset</span></Link><span className="mx-3 text-white">/</span>
                <Link className="textsize12 text-white-a d-flex"><MdOutlineFeed className='mt-1'/> <span className='px-2'> {slugify2(id)}</span></Link>
              </div>
            </Col>
            {/* <Col md={3} className="d-flex" style={{backgroundColor:"#ececec"}}>
              <div className="px-3 d-flex rad10 ms-auto" 
                  style={{backgroundColor:"#ececec", paddingBottom:"10px", width:"fit-content"}}>
                <ShareButtons url={`/Dataset/${id}`} title={Nama_dataset} />
              </div>
            </Col> */}
          </Row>
          <Row className='px-5 py-2 bg-body mt-0'>
            <Col md={3} sm={12} className='d-none d-md-block float-center text-center shaddow4 rad10 px-0'>
              <div className='px-0 py-4 rad10 bg-zebra-170'>
                <Image className="img-70 mx-auto justify-center  d-block px-5" src={image2} />
              </div>
              
              <p className='mt-2 font_weight700 textsize12 bg-white px-2 py-2 rad10 uppercaseku' style={{color:settings.color_title,lineHeight:"1.5"}}>{satker}</p>
              
               <div className="d-flex flex-column justify-content-center align-items-center text-center">
                <p className="mt-2 font_weight700 textsize12 mb-0 text-body">Dilihat</p>
                <p className="text-white textsize14 text-center font_weight600 bg-orange max-width-180 rad10 px-5 mx-1">
                  <MdRemoveRedEye size={25} style={{ marginTop: "-1px" }} /> {datacount}
                </p>
                <p className="mt-2 font_weight700 textsize12 mb-0 text-body">Diunduh</p>
                <p className="text-white textsize14 text-center font_weight600 bg-orange max-width-180 rad10 px-5 mx-1">
                  <MdDownloadForOffline size={25} style={{ marginTop: "-1px" }} /> {datacountdownload}
                </p>
              </div>
              {loading ? (
                <Spinner />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Dropdown className="custom-dropdown m-5">
                    <Dropdown.Toggle id="dropdown-custom-toggle" variant="light" className="rad10 px-4 py-2 textsize14">
                      Unduh Dataset
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="custom-dropdown-menu rad10">
                      <Dropdown.Item as="div">
                        <NavLink 
                          onClick={(e) => {
                            e.preventDefault(); // cegah reload/redirect default dari <a>
                            downloadxls();
                            setDownloadvisitor();
                            //setDownloadvisitor();
                          }}  
                          className="custom-dropdown-link">
                          📄 Unduh XLSX
                        </NavLink>
                      </Dropdown.Item>
                      <Dropdown.Item as="div">
                        <CSVLink 
                          onClick={(e) => {
                           setDownloadvisitor();
                          }}  
                          data={data} 
                          filename={`dataset-${Nama_dataset || 'export'}-${new Date().toISOString().split('T')[0]}.csv`} 
                          className="custom-dropdown-link"
                        >
                          📊 Unduh CSV
                        </CSVLink>
                      </Dropdown.Item>
                      <Dropdown.Item as="div">
                        <Link 
                          onClick={(e) => {
                            e.preventDefault(); // cegah reload/redirect default dari <a>
                            downloadJSON(data, Nama_dataset);
                            setDownloadvisitor();
                          }}  
                          className="custom-dropdown-link">
                          🧾 Unduh JSON
                        </Link>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </motion.div>
              )}
              <div className="socials2 d-flex justify-content-center align-items-center text-center gap-3">
                <Link 
                  to={shareLinks.facebook}
                  target="_blank" 
                  className="justify-content-center  d-flex mt-2"
                >
                  <i className="fab fa-facebook-f" style={{ fontSize: "20px" }}></i>
                </Link>
              
                <Link 
                  to={shareLinks.twitter}
                  target="_blank" 
                  className="justify-content-center  d-flex mt-2"
                >
                  <i className="fab fa-twitter" style={{ fontSize: "20px" }}></i>
                </Link>
              
                <Link 
                  to={shareLinks.instagram}
                  target="_blank" 
                  className="justify-content-center  d-flex mt-2"
                >
                  <i className="fab fa-instagram" style={{ fontSize: "20px" }}></i>
                </Link>
              
                <Link 
                  to={shareLinks.linkedin}
                  target="_blank" 
                  className="justify-content-center  d-flex mt-2"
                >
                  <i className="fab fa-linkedin-in" style={{ fontSize: "20px" }}></i>
                </Link>
              </div>
              <div className='d-flex flex-column justify-content-center align-items-center text-center mt-5'>
                <Link href="http://www.opendefinition.org/licenses/cc-by" className='text-body italicku' rel="dc:rights">Creative Commons Attribution</Link>
                <Link href="http://opendefinition.org/okd/" title="This dataset satisfies the Open Definition.">
                    <Image className="img-header" src={image3} alt=""/>
                </Link>

              </div>
            </Col>
            <Col md={9} sm={12} className=''>
              {loading ? (
                <Spinner />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Row className='mx-2 '>
                    
                    <Col md={12} sm={12}>
                      <p className='textsize24 text-left font_weight700 py-2 text-body'>Dataset Detail</p>
                      <p 
                        className='text-white textsize16 text-left box-header-title'
                        style={{background:`linear-gradient(to right, ${settings.bg_content}, ${settings.bg_header})`}}
                      >
                        {Nama_dataset}
                      </p>
                    </Col>
                    <Col md={12} sm={12} className=''>
                      <div className="d-flex text-center">
                       
                        <p className="text-body textsize12 capitalizeku text-center font_weight600 px-2 mx-1">
                          <MdOutlineListAlt  size={25} style={{ marginTop: "-1px" }} /> {Kategori}
                        </p>
                        <p className="text-body textsize12 text-center font_weight600 px-2 mx-1">
                          <MdOutlineEditCalendar size={25} style={{ marginTop: "-1px" }} /> {TanggalUpdate}
                        </p>
                        <p className="text-body textsize12 capitalizeku text-center font_weight600 px-2 mx-1">
                          <FaRecycle size={25} style={{ marginTop: "-1px" }} /> {Periode_dataset}
                        </p>
                      </div>
                      
                    </Col>
                    <Col md={12} sm={12} className='d-sm-block d-md-none'>
                      <div className="d-flex justify-content-center align-items-center text-center">
                       
                        <p className="text-white textsize10 text-center font_weight600 bg-orange max-width-180 rad10 px-5 mx-1">
                          <MdRemoveRedEye size={25} style={{ marginTop: "-1px" }} /> {datacount}
                        </p>
                        <p className="text-white textsize10 text-center font_weight600 bg-orange max-width-180 rad10 px-5 mx-1">
                          <MdDownloadForOffline size={25} style={{ marginTop: "-1px" }} /> {datacountdownload}
                        </p>
                      </div>
                      <div className="socials2 justify-content-center">
                        <ul className="justify-content-center d-flex">
                          <li  className="justify-content-center ">
                            <Link 
                              to={shareLinks.facebook}
                              target="_blank" 
                              className="justify-content-center  d-flex"
                            >
                              <i className="fab fa-facebook-f"></i>
                            </Link>
                          </li>
                          <li className="justify-content-center">
                            <Link 
                              to={shareLinks.twitter}
                              target="_blank" 
                              className="justify-content-center  d-flex"
                            >
                              <i className="fab fa-twitter"></i>
                            </Link>
                          </li>
                          <li className="justify-content-center">
                            <Link 
                              to={shareLinks.instagram}
                              target="_blank" 
                              className="justify-content-center  d-flex"
                            >
                              <i className="fab fa-instagram"></i>
                            </Link>
                          </li>
                          <li className="justify-content-center">
                            <Link 
                              to={shareLinks.linkedin}
                              target="_blank" 
                              className="justify-content-center  d-flex"
                            >
                              <i className="fab fa-linkedin-in"></i>
                            </Link>
                          </li>
                          
                        </ul>
                      </div>
                    </Col>
                    
                    
                  </Row>

                  <Row className='p-2 margin-t5 mx-1 bg-body rad10 margin-b10'>
                    
                    <Tabs
                      defaultActiveKey="metadata"
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab eventKey="deskripsi" title="Deskripsi">
                        <Row className='p-2 mx-1'>
                          <p className='text-white textsize14 text-center btn-grad-blue-4 p-2 mb-2 rad10'>Deskripsi Dataset</p>
                          <Col md={12} sm={12} className='mt-0'>
                          {loading ? (
                              <Spinner />
                            ) : (
                              <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                viewport={{ once: true }}
                              >
                                <Row className='p-2 rad10'>
                                  <Col md={12} sm={12} className='bg-silver'>
                                    <table className="table table-borderless table-sm w-100">
                                      <tbody>
                                        {deskripsi_dataset && typeof deskripsi_dataset === 'string' ? (
                                          <div className="textsize12 mt-3">
                                            <div className='textsize11 text-body' dangerouslySetInnerHTML={{ __html: deskripsi_dataset }} />
                                          </div>
                                        ) : ("")}
                                        
                                      </tbody>
                                    </table>
                                  </Col>
                                  {/* <Col md={4} sm={4} className='bg-silver'>
                                    <p className='font_weight600 mt-2'>Kegiatan Statistik</p>
                                  </Col>
                                  <Col md={8} sm={8} className='bg-silver'>
                                    <p className='mt-2'>{Statistik}</p>
                                  </Col>
                                  <Col md={4} sm={4}>
                                    <p className='font_weight600 mt-2'>Konsep</p>
                                  </Col>
                                  <Col md={8} sm={8} className=''>
                                    <p className='mt-2'>{Konsep}</p>
                                  </Col>
                                  <Col md={4} sm={4} className='bg-silver'>
                                    <p className='font_weight600 mt-2'>Klasifikasi</p>
                                  </Col>
                                  <Col md={8} sm={8} className='bg-silver'>
                                    <p className='mt-2'>{Klasifikasi}</p>
                                  </Col>
                                  <Col md={4} sm={4}>
                                    <p className='font_weight600 mt-2'>Definisi</p>
                                  </Col>
                                  <Col md={8} sm={8}>
                                    <p className='mt-2'>{Definisi}</p>
                                  </Col>
                                  
                                  <Col md={4} sm={4} className='bg-silver'>
                                    <p className='font_weight600 mt-2'>Ukuran</p>
                                  </Col>
                                  <Col md={8} sm={8} className='bg-silver'>
                                    <p className='mt-2'>{Ukuran}</p>
                                  </Col> */}
                                  
                                  
                                </Row>
                              </motion.div>
                            )}
                          </Col>
                        </Row>
                        

                      </Tab>

                      <Tab eventKey="metadata" title="Metadata">
                        <Row className='p-2 mx-1 mt-3'>
                          <p className='text-white textsize14 text-center btn-grad-blue-4 p-2 mb-0 rad10'>Metadata Info</p>
                          <Col md={12} sm={12} className='mt-0'>
                          {loading ? (
                              <Spinner />
                            ) : (
                              <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                viewport={{ once: true }}
                              >
                                <Row className='p-2 rad10'>
                                
                                  
                                  <Col md={4} sm={4} className=''>
                                    <p className='textsize12 font_weight600 mt-2 mb-0 text-body'>Sektor / Topik</p>
                                  </Col>
                                  <Col md={8} sm={8} className=''>
                                    <p className='textsize12 font_weight600 mt-2 uppercaseku text-body'>{Kategori}</p>
                                  </Col>
                                  <Col md={4} sm={4} style={{backgroundColor:'#99999987'}}>
                                    <p className='textsize12 font_weight600 mt-2 mb-0 text-body'>Produsen Data</p>
                                  </Col>
                                  <Col md={8} sm={8} style={{backgroundColor:'#99999987'}}>
                                    <p className='textsize12 font_weight600 mt-2 uppercaseku text-body'>{satker}</p>
                                  </Col>
                                  
                                  <Col md={4} sm={4}>
                                    <p className='textsize12 font_weight600 mt-2 mb-0 text-body'>Unit Wilayah</p>
                                  </Col>
                                  <Col md={8} sm={8}>
                                    <p className='textsize12 font_weight600 mt-2 uppercaseku text-body'>{unit_wilayah}</p>
                                  </Col>
                                  
                                  <Col md={4} sm={4} style={{backgroundColor:'#99999987'}}>
                                    <p className='textsize12 font_weight600 mt-2 mb-0 text-body'>Kategori Data</p>
                                  </Col>
                                  <Col md={8} sm={8} style={{backgroundColor:'#99999987'}}>
                                    <p className='textsize12 font_weight600 mt-2 uppercaseku text-body'>{Kategori_Data}</p>
                                  </Col>

                                  <Col md={4} sm={4} className=''>
                                    <p className='textsize12 font_weight600 mt-2 mb-0 text-body'>Periode</p>
                                  </Col>
                                  <Col md={8} sm={8} className=''>
                                    <p className='textsize12 font_weight600 mt-2 uppercaseku text-body'>{Periode_dataset}</p>
                                  </Col>
                                  <Col md={4} sm={4} style={{backgroundColor:'#99999987'}}>
                                    <p className='textsize12 font_weight600 mt-2 mb-0 text-body'>Satuan</p>
                                  </Col>
                                  <Col md={8} sm={8} style={{backgroundColor:'#99999987'}}>
                                    <p className='textsize12 font_weight600 mt-2 uppercaseku text-body'>{Satuan}</p>
                                  </Col>
                                  
                                  <Col md={4} sm={4}>
                                    <p className='textsize12 font_weight600 mt-2 mb-0 text-body'>Tgl. Dibuat</p>
                                  </Col>
                                  <Col md={8} sm={8}>
                                    <p className='textsize12 font_weight600 mt-2 uppercaseku text-body'>{TanggalUnggah}</p>
                                  </Col>
                                  <Col md={4} sm={4} style={{backgroundColor:'#99999987'}}>
                                    <p className='textsize12 font_weight600 mt-2 mb-0 text-body'>Tgl. Update</p>
                                  </Col>
                                  <Col md={8} sm={8} style={{backgroundColor:'#99999987'}}>
                                    <p className='textsize12 font_weight600 mt-2 uppercaseku text-body'>{TanggalUpdate}</p>
                                  </Col>
                                </Row>
                              </motion.div>
                            )}
                          </Col>
                        </Row>
                      </Tab>
                      
                    </Tabs>
                  </Row>

                  
                 
                </motion.div>
              )}
            </Col>
          </Row>
          
        </div>
       
        
       
        {loading ? (
          <Spinner />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <Row 
              className='p-2 margin-t5 mx-1 rad10 margin-b10 justify-content-center bg-border2 mb-2'
              style={{background:`linear-gradient(to right, ${settings.bg_content}, ${settings.bg_header})`}}
            >
              <Col md={12} className='text-center'>
              <p className='textsize20 text-white text-center font_weight600 capitalizeku' style={{color:settings.color_title}}>Sesuaikan Data Series Dan Visual</p>
              </Col>
              <Col md={3} className='mb-4'>
                <Autocomplete
                  options={columns}
                  getOptionLabel={(opt) => opt?.headerName || ""}
                  value={columns.find((d) => d.field === keywordX) || null}
                  onChange={(_, v) => setKeywordX(v?.field || "")} // update keywordX saat pilih
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="X Axis"
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: 50,
                          fontSize: "120%",
                          background: "rgba(255,255,255,0.75)",
                          borderRadius: "12px"
                        },
                        "& .MuiInputLabel-root": {
                          backgroundColor: "#767777",
                          color: "#fff",
                          borderRadius: "6px",
                          padding: "0 6px",
                          transform: "translate(14px, -9px) scale(0.85)"
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          borderRadius: "6px",
                          padding: "0 6px",
                          transform: "translate(14px, -9px) scale(0.85)"
                        }
                      }}
                    />
                  )}
                  sx={{
                    width: "100%",
                    "& .MuiAutocomplete-popupIndicator": { color: "#1976d2", transition: "transform 0.3s" },
                    "& .MuiAutocomplete-popupIndicatorOpen": { transform: "rotate(180deg)" }
                  }}
                />
              </Col>
              <Col md={3} className='mb-4'>
                <Autocomplete
                  options={columns}
                  getOptionLabel={(opt) => opt?.headerName || ""}
                  value={columns.find((d) => d.field === keywordY) || null}
                  onChange={(_, v) => setKeywordY(v?.field || "")} // update keywordX saat pilih
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Y Axis"
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: 50,
                          fontSize: "120%",
                          background: "rgba(255,255,255,0.75)",
                          borderRadius: "12px"
                        },
                        "& .MuiInputLabel-root": {
                          backgroundColor: "#767777",
                          color: "#fff",
                          borderRadius: "6px",
                          padding: "0 6px",
                          transform: "translate(14px, -9px) scale(0.85)"
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          borderRadius: "6px",
                          padding: "0 6px",
                          transform: "translate(14px, -9px) scale(0.85)"
                        }
                      }}
                    />
                  )}
                  sx={{
                    width: "100%",
                    "& .MuiAutocomplete-popupIndicator": { color: "#1976d2", transition: "transform 0.3s" },
                    "& .MuiAutocomplete-popupIndicatorOpen": { transform: "rotate(180deg)" }
                  }}
                />
              </Col>
              <Col md={2} className='mb-4'>
                <Autocomplete
                  options={[
                    { label: "SUM", value: "sum" },
                    { label: "COUNT", value: "count" },
                    { label: "AVERAGE", value: "average" },
                  ]}
                  getOptionLabel={(opt) => opt.label || ""}
                  value={[
                    { label: "SUM", value: "sum" },
                    { label: "COUNT", value: "count" },
                    { label: "AVERAGE", value: "average" },
                  ].find((opt) => opt.value === keywordM) || null}
                  onChange={(_, v) => setKeywordM(v?.value || "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Rumus"
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: 50,
                          fontSize: "120%",
                          background: "rgba(255,255,255,0.75)",
                          borderRadius: "12px"
                        },
                        "& .MuiInputLabel-root": {
                          backgroundColor: "#767777",
                          color: "#fff",
                          borderRadius: "6px",
                          padding: "0 6px",
                          transform: "translate(14px, -9px) scale(0.85)"
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          borderRadius: "6px",
                          padding: "0 6px",
                          transform: "translate(14px, -9px) scale(0.85)"
                        }
                      }}
                    />
                  )}
                  sx={{
                    width: "100%",
                    "& .MuiAutocomplete-popupIndicator": { color: "#1976d2", transition: "transform 0.3s" },
                    "& .MuiAutocomplete-popupIndicatorOpen": { transform: "rotate(180deg)" }
                  }}
                />
              </Col>
              <Col md={2} className='mb-4'>
                <Autocomplete
                  options={[
                    { label: "AREA", value: "area" },
                    { label: "COLUMN", value: "column" },
                    { label: "DONUT", value: "donut" },
                    { label: "GAUGE", value: "solidgauge" },
                    { label: "LINE", value: "line" },
                    { label: "PIE", value: "pie" },
                    
                  ]}
                  getOptionLabel={(opt) => opt.label || ""}
                  value={[
                    { label: "AREA", value: "area" },
                    { label: "COLUMN", value: "column" },
                    { label: "DONUT", value: "donut" },
                    { label: "GAUGE", value: "solidgauge" },
                    { label: "LINE", value: "line" },
                    { label: "PIE", value: "pie" },
                  ].find((opt) => opt.value === keywordC) || null}
                  onChange={(_, v) => setKeywordC(v?.value || "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Gaya Grafik"
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: 50,
                          fontSize: "120%",
                          background: "rgba(255,255,255,0.75)",
                          borderRadius: "12px"
                        },
                        "& .MuiInputLabel-root": {
                          backgroundColor: "#767777",
                          color: "#fff",
                          borderRadius: "6px",
                          padding: "0 6px",
                          transform: "translate(14px, -9px) scale(0.85)"
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          borderRadius: "6px",
                          padding: "0 6px",
                          transform: "translate(14px, -9px) scale(0.85)"
                        }
                      }}
                    />
                  )}
                  sx={{
                    width: "100%",
                    "& .MuiAutocomplete-popupIndicator": { color: "#1976d2", transition: "transform 0.3s" },
                    "& .MuiAutocomplete-popupIndicatorOpen": { transform: "rotate(180deg)" }
                  }}
                />
              </Col>
            </Row>
            <Row className='p-2 margin-t2 mx-1 bg-body rad10 margin-b10 justify-content-center'>
              
              <Tabs
                defaultActiveKey="raws"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="visual" title="Visualisasi">
                  
                  {keywordC ? (
                    <div className='mt-10'>
                      {keywordC === "pie" || keywordC === "donut" || keywordC === "column" || keywordC === "line" ? ( 
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={{
                            chart: {
                              plotBackgroundColor: null,
                              plotBorderWidth: null,
                              plotShadow: false,
                              backgroundColor: null,
                              // Donut chart di Highcharts sebenarnya type "pie"
                              type: keywordC === "donut" ? "pie" : keywordC || "pie"
                            },
                            colors: ['#9654be','#f45945','#f9c907','#aad255','#00ada7','#05759a'],
                            /* title: {
                              text: 'VISUALISASI DATA ' + (keywordX ? keywordX.toUpperCase() : ""),
                              style: {
                                fontSize: '180%',
                                fontFamily: 'Poppins, sans-serif',
                                color: `${themeku2 === "dark" ? '#fff' : '#000'}`,
                                fontWeight: '800',
                              }
                            }, */
                            title: {
                              text: `<span class="text-body textsize14">VISUALISASI DATA ${keywordX ? keywordX.toUpperCase() : ""}</span>`,

                              useHTML: true, // ⬅️ WAJIB
                              style: {
                                fontSize: '120%',
                                fontFamily: 'Roboto, sans-serif',
                                fontWeight: 'bold',
                                color:`${themeku2 === "dark" ? '#fff' : '#000'}`
                              }
                            },
                            tooltip: {
                              pointFormat:
                                keywordC === "pie" || keywordC === "donut"
                                  ? '{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)'
                                  : '{series.name}: <b>{point.y}</b>',
                              shared: keywordC !== "pie" && keywordC !== "donut",
                              valueSuffix: keywordC !== "pie" && keywordC !== "donut" ? '' : undefined
                            },
                            accessibility: { enabled: false },
    
                            // ✅ Sumbu X untuk column & line
                            xAxis:
                              keywordC === "column" || keywordC === "line"
                                ? {
                                    categories: data_chart_a.map(item => item.name),
                                    title: { text: null },
                                    labels: {
                                      autoRotation: [-45, -60],
                                      style: {
                                        fontSize: '110%',
                                        fontFamily: 'Roboto, sans-serif',
                                        fontWeight: 'bold',
                                        color: '#FFA726' // 🎯 Tambahkan ini
                                      },
                                    }
                                  }
                                : undefined,
                            yAxis: {
                              title: {
                                text: `<span class="text-body textsize10">Jumlah</span>`,

                                useHTML: true, // ⬅️ WAJIB
                                style: {
                                  fontSize: '120%',
                                  fontFamily: 'Roboto, sans-serif',
                                  fontWeight: 'bold',
                                  color:`${themeku2 === "dark" ? '#fff' : '#000'}`
                                }
                              },
                              labels: {
                                autoRotation: [-45, -90],
                                style: {
                                  fontSize: '80%',
                                  fontFamily: 'Roboto, sans-serif',
                                  fontWeight: 'bold',
                                  color: '#FFA726' // 🎯 Tambahkan ini
                                },
                              }
                            },
    
                            plotOptions:
                              keywordC === "pie" || keywordC === "donut"
                                ? {
                                    pie: {
                                      allowPointSelect: true,
                                      cursor: 'pointer',
                                      innerSize: keywordC === "donut" ? "50%" : undefined, // ✅ Donut setting
                                      dataLabels: [
                                        {
                                          enabled: true,
                                          distance: 0,
                                          style: { fontSize: '100%', opacity: 0.7 }
                                        },
                                        {
                                          enabled: true,
                                          distance: -40,
                                          format: '{point.percentage:.1f}%',
                                          style: { fontSize: '100%', opacity: 0.7 }
                                        }
                                      ],
                                      showInLegend: true
                                    }
                                  }
                                : keywordC === "column"
                                ? {
                                    column: {
                                      dataLabels: { enabled: true },
                                      borderWidth: 0
                                    }
                                  }
                                : {
                                    line: {
                                      dataLabels: { enabled: true },
                                      enableMouseTracking: true
                                    }
                                  },
    
                            series:
                              keywordC === "column" || keywordC === "line"
                                ? [
                                    {
                                      name:  keywordX ? keywordX+" data" : "",
                                      colorByPoint: true, // ✅ Biar tiap kolom beda warna seperti pie
                                      data: data_chart_a.map(item => item.y) // ✅ Hanya ambil nilai y
                                    }
                                  ]
                                : [
                                    {
                                      name: keywordX ? keywordX+" data" : "",
                                      colorByPoint: true,
                                      data: data_chart_a
                                    }
                                  ],
    
                            legend: (keywordC === "pie" || keywordC === "donut") ? {
                              enabled: true,
                              itemStyle: {
                                color: '#FFA726',
                                fontFamily: 'MuseoS500',
                                fontSize: '90%'
                              }
                            } : {
                              enabled: false
                            },
                          }}
                          containerProps={{ style: { height: "80vh", width: "100%" } }}
                        />
                      ) : ("")}

                      {keywordC === "solidgauge" ? ( 
                        <Row className="g-3 justify-content-center"> {/* g-3 untuk gap antar Col */}
                          <Col xs={12} className="text-center mb-3">
                            <p className='textsize18 text-center font_weight800 uppercaseku text-body'>VISUALISASI DATA {keywordX}</p>
                          </Col>
                          {data_chart_a.map((item, idx) => (
                            <Col key={idx} xs={12} sm={6} md={4} lg={3}>
                              <GaugeChartCol item={item} keywordX={keywordX} data_chart_a={data_chart_a} />
                            </Col>
                          ))}
                        </Row>
                      ) : ("")}
                       {keywordC === "area" ? (
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={{
                            chart: { 
                              type: "area",
                              backgroundColor: null,

                             },
                            title: {
                              text: `<span class="text-body textsize14">VISUALISASI DATA ${keywordX ? keywordX.toUpperCase() : ""}</span>`,

                              useHTML: true, // ⬅️ WAJIB
                              style: {
                                fontSize: '120%',
                                fontFamily: 'Roboto, sans-serif',
                                fontWeight: 'bold',
                                color:`${themeku2 === "dark" ? '#fff' : '#000'}`
                              }
                              
                            },
                            xAxis: {
                              categories: [...new Set(data_chart_a.map(item => item.name))],
                              title: { text: null },
                              labels: {
                                autoRotation: [-45, -90],
                                style: {
                                  fontSize: '90%',
                                  fontFamily: 'Roboto, sans-serif',
                                  fontWeight: 'bold',
                                  color: '#FFA726' // 🎯 Tambahkan ini
                                },
                              }
                            },
                            yAxis: {
                              title: {
                                text: `<span class="text-body textsize10">Jumlah</span>`,

                                useHTML: true, // ⬅️ WAJIB
                                style: {
                                  fontSize: '120%',
                                  fontFamily: 'Roboto, sans-serif',
                                  fontWeight: 'bold',
                                  color:`${themeku2 === "dark" ? '#fff' : '#000'}`
                                }
                              },
                              labels: {
                                autoRotation: [-45, -90],
                                style: {
                                  fontSize: '80%',
                                  fontFamily: 'Roboto, sans-serif',
                                  fontWeight: 'bold',
                                  color: '#FFA726' // 🎯 Tambahkan ini
                                },
                              }
                            },

                            tooltip: {
                              shared: true,
                              formatter: function () {
                                const keywordLabel = (keywordX || "").replace(/_/g, " "); // ubah "_" jadi spasi
                                return `
                                  <div style="font-size:13px; line-height:1.4">
                                    ${this.points
                                      .map(
                                        p => `
                                          <span style="color:${p.color}; font-size:12px">●</span> 
                                          <span style="font-size:100%">${keywordLabel}: <b>${p.y}</b></span>
                                          <br/><i style="font-size:120%">Item: ${p.key}</i>
                                        `
                                      )
                                      .join("<br/>")}
                                  </div>
                                `;
                              }
                            },

                            plotOptions: {
                              area: {
                                marker: { enabled: true, radius: 3 },
                                fillOpacity: 0.5,
                                dataLabels: { enabled: true }
                              }
                            },

                            series: (() => {
                              const groupByKey = keywordX; 
                              const grouped = data_chart_a.reduce((acc, item) => {
                                const key = item[groupByKey] || "Unknown";
                                if (!acc[key]) acc[key] = [];
                                acc[key].push([item.name, item.y]);
                                return acc;
                              }, {});

                              return Object.keys(grouped).map((key, i) => ({
                                type: "area",
                                name: key,
                                data: grouped[key],
                                color: Highcharts.getOptions().colors[i % Highcharts.getOptions().colors.length],
                                fillOpacity: 0.5
                              }));
                            })(),

                            legend: {
                              enabled: false,
                              itemStyle: { color: "#000", fontSize: "12px" }
                            }
                          }}
                          containerProps={{ style: { height: "80vh", width: "100%" } }}
                        />
                      ) : ("")}




                    </div>
                  ) : ""}


                </Tab>

                <Tab eventKey="series" title="Data Series">
                  {keywordX && keywordY ? (
                    <div className='w-100 'style={{ overflowX: "auto" }}>
                      <table  className='w-auto table-responsive rad10'>
                        <thead className='rad10' style={{backgroundColor:settings.bg_header}}>
                          <tr className=' py-2 text-center text-white'>
                            <th rowSpan={2} style={{backgroundColor:settings.bg_header}} >Nama Dataset</th>
                            <th colSpan={100}
                            className='bg-border4' style={{backgroundColor:settings.bg_header}}>{keywordX?keywordX:"Pilih X Axis"}</th>
                          </tr>
                          <tr className=' py-2 text-center text-light'>
                            {Object.entries(groupedSums_a) ? Object.entries(groupedSums_a).map(([group, total]) => (
                              <th className='bg-border4 bg-orange' key={group}>{group}</th>
                            )) :<p>Data Kosong</p>}
                          </tr>
                        </thead>
                        <tbody>
                            <tr>
                              <td className='bg-border3 text-body' style={{minWidth:"400px"}}> {Nama_dataset}</td>
                              {Object.entries(groupedSums_a) ? Object.entries(groupedSums_a).map(([group, total]) => (
                                <td className='bg-border3 text-body' key={group}>
                                  {total}
                                </td>
                              )) :<p>Data Kosong</p>}
                            </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : ""}

                </Tab>
                <Tab eventKey="raws" title="Data Raw">
                  <div className='w-100' style={{ height: "auto" }}>
                    {data.length > 0 && 
                      <ThemeProvider theme={theme}>
                        <DataGrid
                        
                          loading={loading}
                          rows={filteredRows}
                          columns={columns}
                          pageSizeOptions={[5, 10, 50, 100]}
                          initialState={{
                            pagination: {
                              paginationModel: { pageSize: 10, page: 0 }
                            }
                          }}
                        
                          disableSelectionOnClick
                          getRowHeight={() => 'auto'}
                          
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
                                borderRadius: "6px",
                                boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)"
                                
                              },
                            "& .custom-header": {
                              backgroundColor:settings.bg_header,
                              color: "white",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                              fontSize: "80%"
                            },
                            "& .MuiDataGrid-columnHeader .MuiDataGrid-menuIcon": {
                              opacity: 1,
                              visibility: "visible",
                              width: "auto",
                              color: "#fff"
                            },
                            "& .MuiDataGrid-columnHeader:hover .MuiDataGrid-menuIcon": {
                              opacity: 1
                            },
                            "& .MuiDataGrid-columnHeader .MuiDataGrid-menuIcon button svg": {
                              fill: "#fff"
                            },
                            '& .MuiDataGrid-cell': {
                              whiteSpace: 'normal', // biar teks wrap
                              lineHeight: '1.2rem',  // lebih rapat
                              padding: '8px'
                            },
                            "& .MuiTablePagination-select option:not([value='5']):not([value='10']):not([value='20'])": {
                              display: "none" // sembunyikan opsi default MUI yang tidak diinginkan
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
                            }
                          }}
                        />
                      </ThemeProvider>} 
                  </div>
                </Tab>
              </Tabs>
            </Row>
          </motion.div>
        )}
        
      </main>
      <footer id="footer">
        <AppFooter 
          bgfooterku={settings.bg_footer}
          visitor_today={totalVisitors?.today || 0}
          visitor_month={totalVisitors?.month || 0}
          visitor_year={totalVisitors?.year || 0}
          visitor_all={totalVisitors?.allTime || 0}
        />
      </footer>
    </div>
  );
}

export default DatasetPengelolah;
