import React, { useState, useEffect, useRef } from "react";
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
    const [deskripsi, setDeskripsi] = useState("");
    const [dihubungi, setDihubungi] = useState("");
    const [tgldibuat, setTgldibuat] = useState("");
    const [pekerjaan, setPekerjaan] = useState("");
    const [instansi, setInstansi] = useState("");
    const [pesan, setPesan] = useState("");
    const [status, setStatus] = useState("");
    const [pesanform, setPesanForm] = useState("");
    const [msg, setMsg] = useState("");
    
    const { id } = useParams();

    
    const [showTiketModal, setShowTiketModal] = useState(false);
    const [nomorTiket, setNomorTiket] = useState("");



    const navigate = useNavigate();

    const chatEndRef = useRef(null);

    useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [permohonantiketku]);

    const InfoRow = ({ label, value }) => (
        <div className="d-flex justify-content-between border-bottom py-2">
            <span className="text-muted">{label}</span>
            <span className="font_weight600 text-end">{value || "-"}</span>
        </div>
    );

    
    useEffect(() => {
        getDataById();
    }, [permohonantiketku]);

    const getDataById = async () => {
        try {
        const response = await api_url_satuadmin.get(`opendata/dataset_permohonan/tiket/${id}`);
        //console.log("Dataset online:", response.data);
        //console.log("fileku : "+response.data.file[0].link);
        //const data = response.data;
        
        
        setNama(response.data.permohonan.nama_lengkap);
        setJudul(response.data.permohonan.judul);
        /* const res3 = await api_url_satudata.get("dataset?limit=1000");
        const allDataset = res3.data || [];
        
            

        const satkerList = allDataset
            .map(item => ({
            id_opd: item.opd?.id_opd,
            nama_opd: item.opd?.nama_opd
            }))
            .filter(opd => opd.id_opd && opd.nama_opd);

        const uniqueSatker = Array.from(
            new Map(satkerList.map(opd => [opd.id_opd, opd])).values()
        ); */
        setOpd(response.data.permohonan.nama_opd);
        setStatus(response.data.permohonan.status);
        setPermohonanTiket(response.data.permohonan_tiket);
        setDeskripsi(response.data.permohonan.deskripsi);
        setDihubungi(response.data.permohonan.dihubungi);
        setTgldibuat(convertDate(response.data.permohonan.created_at.toString().replace(/T/, ' ').replace(/\.\w*/, '')));
        setInstansi(response.data.permohonan.instansi);
        
        
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

        const response_image = await api_url_satuadmin.get( 'openitem/images_item', {
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
            {/* ================= INFO TIKET ================= */}
            <Col md={6} sm={12}>
                <div className="m-1 bg-body bg-border2 mt-3 rad12 p-3 shadow-sm">

                <div
                    className="text-white textsize14 d-flex align-items-center px-3 py-2 rad10 mb-3"
                    style={{ background: `linear-gradient(to right, ${bgcontentku}, ${bgtitleku})` }}
                >
                    <MdOutlineInfo size={22} className="me-2" />
                    Detail Tiket
                </div>

                <div className="d-flex flex-column gap-2 textsize13">
                    <div className="d-flex justify-content-between border-bottom pb-2">
                    <span className="fw-semibold text-start" style={{color:bgtitleku}}>{judul}</span>
                    </div>
                    <div className="d-flex justify-content-between border-bottom pb-2">
                    <span className="text-muted w-30">Nomor Tiket</span>
                    <span className="fw-semibold">{id}</span>
                    </div>
                     <div className="d-flex justify-content-between border-bottom pb-2">
                    <span className="text-muted w-30">Tanggal Dibuat</span>
                    <span className="fw-semibold">{tgldibuat}</span>
                    </div>

                    <div className="d-flex justify-content-between border-bottom pb-2">
                    <span className="text-muted w-30">Nama Pemohon</span>
                    <span className="fw-semibold">{nama}</span>
                    </div>

                    <div className="d-flex justify-content-between border-bottom pb-2">
                    <span className="text-muted w-30">Instansi</span>
                    <span className="fw-semibold">{instansi}</span>
                    </div>


                    <div className="d-flex justify-content-between border-bottom pb-2">
                    <span className="text-muted w-30">OPD Terkait</span>
                    <span className="fw-semibold">{opd}</span>
                    </div>


                    <div className="d-flex justify-content-between border-bottom pb-2">
                    <span className="text-muted w-30">Dapat Dihubungi</span>
                    <span className="fw-semibold">{dihubungi}</span>
                    </div>

                   

                   
                    
                    <div className="d-flex justify-content-between border-bottom pb-2">
                    <span className="text-muted w-30">Deskripsi</span>
                    <span className="fw-semibold">{deskripsi}</span>
                    </div>


                    <div className="d-flex justify-content-between align-items-center pt-2">
                    <span className="text-muted w-50">Status</span>
                    <span
                        className={`badge px-3 py-1 ${
                        status === "Selesai"
                            ? "bg-success"
                            : status === "Proses"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                    >
                        {status}
                    </span>
                    </div>
                </div>
                </div>
            </Col>

            {/* ================= PERCAPAKAN ================= */}
            <Col md={6} sm={12}>
                <div className="m-1 bg-body bg-border2 mt-3 rad12 p-3 shadow-sm">

                    <div
                        className="text-white textsize14 d-flex align-items-center px-3 py-2 rad10 mb-3"
                        style={{ background: `linear-gradient(to right, ${bgcontentku}, ${bgtitleku})` }}
                    >
                        <MdOutlineInfo size={22} className="me-2" />
                        Percakapan
                    </div>

                    {status !== "Selesai" && (
                        <Form onSubmit={handleSubmit} className="mb-4">
                        <Form.Group>
                            <Form.Label className="textsize11 text-muted">
                            Balas Pesan
                            </Form.Label>
                            <Form.Control
                            as="textarea"
                            rows={3}
                            className="textsize12"
                            value={pesanform}
                            onChange={(e) => setPesanForm(e.target.value)}
                            placeholder="Tulis balasan Anda..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                                }
                            }}
                            required
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end mt-3 gap-2">
                            <Button variant="outline-secondary" size="sm">
                            Batal
                            </Button>
                            <Button variant="primary" size="sm" type="submit">
                            Kirim
                            </Button>
                        </div>
                        </Form>
                    )}

                    <div style={{ maxHeight: "65vh" }} className="overflow-auto pe-2">

                        {permohonantiketku.map((message) => {
                            const isPemohon = message.from === "Pemohon";

                            return (
                                <div
                                key={message.id_permohonan}
                                className={`d-flex mb-3 ${
                                    isPemohon ? "justify-content-end" : "justify-content-start"
                                }`}
                                >
                                {/* Avatar Admin */}
                                {!isPemohon && (
                                    <div className="me-2">
                                    <div className="avatar-circle bg-primary text-white">A</div>
                                    </div>
                                )}

                                {/* Bubble */}
                                <div
                                    className="p-3 rad12"
                                    style={{
                                    maxWidth: "75%",
                                    backgroundColor: isPemohon ? "#d1f0c4" : "#f1f1f1",
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-word",
                                    }}
                                >
                                    <div className="d-flex justify-content-between textsize10 font_weight600 mb-1">
                                    <span className=" font_weight800">{isPemohon ? "Anda:" : "Admin:"}</span>
                                    <span className="px-2 italicku text-silver">{convertDate(message.updated_at)}</span>
                                    </div>

                                    <div className="textsize12">
                                    {message.pesan
                                        .split(/((?:https?:\/\/|www\.)[^\s]+)/g)
                                        .map((part, idx) => {
                                        if (!/^(https?:\/\/|www\.)/.test(part)) return part;
                                        const href = part.startsWith("http") ? part : `http://${part}`;
                                        return (
                                            <a
                                            key={idx}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary text-decoration-underline"
                                            >
                                            {part}
                                            </a>
                                        );
                                        })}
                                    </div>
                                </div>

                                {/* Avatar Anda */}
                                {isPemohon && (
                                    <div className="ms-2">
                                        <div className="avatar-circle bg-success text-white">U</div>
                                    </div>
                                )}
                                </div>
                            );
                        })}

                        

                    </div>
                </div>
            </Col>
            </Row>


       
        

    </>
  );
};

export default FeedbackModal;
