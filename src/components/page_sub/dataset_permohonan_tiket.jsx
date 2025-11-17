import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FcFeedback } from "react-icons/fc";
import { useNavigate,Link, NavLink, useParams } from "react-router-dom";

import Swal from 'sweetalert2';
import { MdErrorOutline, MdOutlineInfo } from "react-icons/md";
import { api_url_satudata,api_url_satuadmin,api_url_satuadmin_create } from "../../api/axiosConfig";


const portal = "Portal Open Data";

const FeedbackModal = ({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,bginputku,colortitleku,colordateku }) => {
    const [satkerku, setDatasetSatker] = useState([]);
    const [permohonanku, setPermohonan] = useState([]);
    const [permohonantiketku, setPermohonanTiket] = useState([]);
    const [nama, setNama] = useState("");
    const [judul, setJudul] = useState("");
    const [opd, setOpd] = useState("");
    const [pesan, setPesan] = useState("");
    const [status, setStatus] = useState("");
    const [pesanform, setPesanForm] = useState("");
    const [msg, setMsg] = useState("");
    
    const { id } = useParams();

    
    const [showTiketModal, setShowTiketModal] = useState(false);
    const [nomorTiket, setNomorTiket] = useState("");



    const navigate = useNavigate();

    
    
    useEffect(() => {
        getDataById();
    }, [permohonantiketku]);

    const getDataById = async () => {
        try {
        const response = await api_url_satuadmin.get(`api/opendata/dataset_permohonan/tiket/${id}`);
        //console.log("Dataset online:", response.data);
        //console.log("fileku : "+response.data.file[0].link);
        //const data = response.data;
        
        setNama(response.data.permohonan.nama_lengkap);
        setJudul(response.data.permohonan.judul);
        const res3 = await api_url_satudata.get("dataset?limit=1000");
        const allDataset = res3.data || [];
        console.log("dataset",allDataset);
        
            

        const satkerList = allDataset
            .map(item => ({
            id_opd: item.opd?.id_opd,
            nama_opd: item.opd?.nama_opd
            }))
            .filter(opd => opd.id_opd && opd.nama_opd);

        const uniqueSatker = Array.from(
            new Map(satkerList.map(opd => [opd.id_opd, opd])).values()
        );
        setOpd(response.data.permohonan.nama_opd);
        setStatus(response.data.permohonan.status);
        setPermohonanTiket(response.data.permohonan_tiket);
        
        
        } catch (error) {
        if (error.response) {
            setMsg(error.response.data.msg);
        }
        }
    
    };

    useEffect(() => {
        //getMenu();
    }, []);


    const getMenu = async () => {
        try {

        const response_image = await api_url_satuadmin.get( 'api/open-item/images_item', {
            params: {
            portal:portal
            }
        });
        const data_image = response_image.data.image_logo;
        //setImage1(data_image.presignedUrl1);
        //setImage2(data_image.presignedUrl2);
        setTitle(data_image.title);
        setContents(data_image.contents);

        } catch (error) {
        console.error("Failed to fetch data:", error);
        }
    };

    

    

    

// ====================
// 🔹 Fungsi Submit
// ====================
const handleSubmit = async (e) => {
    e.preventDefault(); // ⛔ hentikan reload form bawaan browser
  try {
    const payload = {
      from:"Pemohon", // 🔹 tiket unik
      to:"Admin", // 🔹 tiket unik
      nomor_tiket:id, pesan:pesanform,status:"Proses"
    };

    await api_url_satuadmin.post("api/opendata/dataset_permohonan/tiket", payload);
    sweetsuccess();
    //console.log("pesannya" + response.data.msg);
    
  } catch (error) {
    sweeterror(error.response?.data?.msg || "Gagal menambah data");
  }
};


    function sweetsuccess(){
        Swal.fire({
            title: "Sukses",
            html: "Sukses mengirim pesan",
            timer: 2000,
            icon: "success",
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              
            },
            willClose: () => {
                getDataById(); // misal untuk refresh daftar
            }
          }).then((result) => {
        });
    };
    function sweeterror(error){
        Swal.fire({
            title: "Gagal",
            html: error,
            timer: 1500,
            icon: "error",
            timerProgressBar: true,
            didOpen: () => {
            Swal.showLoading();
            
            },
            willClose: () => {
            }
        }).then((result) => {
        });
    };

      // Format tanggal Indonesia aman
    function convertDate(datePicker) {
        if (!datePicker) return "-";
        const selectedDate = new Date(datePicker);
        if (isNaN(selectedDate)) return "-";

        const monthNames = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        const day = selectedDate.getDate();
        const monthName = monthNames[selectedDate.getMonth()];
        const year = selectedDate.getFullYear();
        const jam = String(selectedDate.getHours()).padStart(2, "0");
        const menit = String(selectedDate.getMinutes()).padStart(2, "0");
        const detik = String(selectedDate.getSeconds()).padStart(2, "0");

        return `${day} ${monthName} ${year} Waktu : ${jam}:${menit}:${detik} WIB`;
    }
    

  return (
    <>

        <Row className="justify-content-center">
            <Col md={6} sm={12} className='align-items-center justify-content-center'>
                <div className="m-1 bg-body bg-border2 mt-3 rad10  px-2">
                    <p 
                    className='text-white textsize14 text-left box-header-title d-flex'
                    style={{background:`linear-gradient(to right, ${bgcontentku}, ${bgtitleku})`}}
                    >
                    <MdOutlineInfo className="mt-1" style={{marginRight:"10px"}} size={25} /> Info Tiket
                    </p>
                    <table className="table table-sm table-bordered mt-3">
                        <tbody className="">
                            <tr>
                                <th>Nomor Tiket</th>
                            </tr>
                            <tr>
                            <td>{id}</td>
                            </tr>
                            <tr>
                                <th>Nama Lengkap</th>
                            </tr>
                            <tr>
                            <td>{nama}</td>
                            </tr>
                            <tr>
                                <th>Judul Permohonan</th>
                            </tr>
                            <tr>
                            <td>{judul}</td>
                            </tr>
                            <tr>
                                <th>OPD</th>
                            </tr>
                            <tr>
                            <td>{opd}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                            </tr>
                            <tr>
                            <td>{status}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                

                
            </Col>
           <Col md={6} sm={12} className='align-items-center justify-content-center'>
                <div className="m-1 bg-body bg-border2 mt-3 rad10  px-2">
                     <p 
                    className='text-white textsize14 text-left box-header-title d-flex'
                    style={{background:`linear-gradient(to right, ${bgcontentku}, ${bgtitleku})`}}
                    >
                    <MdOutlineInfo className="mt-1" style={{marginRight:"10px"}} size={25} /> Percakapan
                    </p>
                    {status !== "Selesai" && (
                        <Form onSubmit={handleSubmit} className="px-2">
                            <div>
                                
                                <Form.Group controlId="formFeedbackText" className="mt-3">
                                    <Form.Label className=" textsize11 text-body">Balas Pesan</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        className="bg-border2 textsize11"
                                        rows={4}
                                        value={pesanform}
                                        onChange={(e) => setPesanForm(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                
                                
                                
                            </div>
                            
                            <div className="d-flex justify-content-end mt-5 mb-5 gap-3">
                                <Button variant="secondary">
                                    Batal
                                </Button>
                                <Button variant="primary" type="submit">
                                    Kirim
                                </Button>
                            </div>
                            
                        </Form>
                    )}
                     <div style={{ maxHeight: "71vh", }} className="py-2 px-3 overflow-scroll-auto">
                        {permohonantiketku.map((message) => (
                        
                            <div key={message.id_permohonan} className="p-1">
                                {/* Info pengirim & tanggal */}
                                <div
                                className={`d-flex ${
                                    message.from === "Pemohon" ? "justify-content-end" : "justify-content-start"
                                }`}
                                >
                                {message.from === "Pemohon" ? (
                                    <>
                                    <p className="mb-0 italicku text-silver text-end px-5">
                                        {convertDate(message.updated_at)}
                                    </p>
                                    <p className="mb-0 italicku text-body text-end">Anda</p>
                                    </>
                                ) : (
                                    <>
                                    <p className="mb-0 italicku text-body text-end">Admin</p>
                                    <p className="mb-0 italicku text-silver text-end px-5">
                                        {convertDate(message.updated_at)}
                                    </p>
                                    </>
                                )}
                                </div>

                                {/* Pesan */}
                                <div
                                className={`rad10 py-2 pb-1 px-3 font_weight600 ${
                                    message.from === "Pemohon"
                                    ? "text-right"
                                    : "text-left bg-border2"
                                } ${message.status === "read" ? "text-primary" : "text-body"}`}
                                style={{
                                    backgroundColor: message.from === "Pemohon" ? "#94da828c" : "",
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-word",
                                    overflowWrap: "anywhere",
                                    borderRadius: "10px",
                                    pointerEvents: "auto",
                                }}
                                >
                                {message.pesan.split(/((?:https?:\/\/|www\.)[^\s]+)/g).map((part, index) => {
                                    const isLink = /^(https?:\/\/|www\.)/.test(part);
                                    if (!isLink) return part;

                                    const href = part.startsWith("http") ? part : `http://${part}`;

                                    return (
                                    <a
                                        key={index}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                        textDecoration: "underline",
                                        color: "#007bff",
                                        cursor: "pointer",
                                        pointerEvents: "auto",
                                        wordBreak: "break-all",
                                        position: "relative",
                                        zIndex: 10,
                                        }}
                                    >
                                        {part}
                                    </a>
                                    );
                                })}
                                </div>
                            </div>


                        ))}
                        
                    </div>
                </div>
            </Col>
        </Row>

       
        

    </>
  );
};

export default FeedbackModal;
