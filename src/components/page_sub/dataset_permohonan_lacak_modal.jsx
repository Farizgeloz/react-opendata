import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { FcFeedback } from "react-icons/fc";
import { useNavigate,Link, NavLink } from "react-router-dom";

import Swal from 'sweetalert2';
import { MdErrorOutline } from "react-icons/md";
import { api_url_satudata,api_url_satuadmin } from "../../api/axiosConfig";


const portal = "Portal Open Data";

const PermohonanLacakModal = ({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,bginputku,colortitleku,colordateku }) => {
    const [show, setShow] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [nomor_tiket, setNomorTiket] = useState("");
    const [email, setEmail] = useState("");
    const [judul, setJudul] = useState("");

    const [title, setTitle] = useState("");
    const [image1, setImage1] = useState("");
    const [image2, setImage2] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate();

    
    
    useEffect(() => {
        getMenu();
    }, []);

    const getMenu = async () => {
        try {

        const response_image = await api_url_satuadmin.get( 'api/open-item/images_item', {
            params: {
            portal:portal
            }
        });
        const data_image = response_image.data.image_logo;
        setImage1(data_image.presignedUrl1);
        setImage2(data_image.presignedUrl2);
        setTitle(data_image.title);

        } catch (error) {
        console.error("Failed to fetch data:", error);
        }
    };

    const getDataByTiket = async () => {
        try {

        const response = await api_url_satuadmin.get( 'api/opendata/dataset_permohonan/tiket', {
            params: {
            nomor_tiket:nomor_tiket,
            email:email
            }
        });
        const data = response.data;
        if (!data.exists) {
            setJudul("");
        } else {
            setJudul(data.data.judul);
        }

        } catch (error) {
        console.error("Failed to fetch data:", error);
        }
    };

    const [validasi_nomortiket, setvalidasi_nomortiket] = useState(false);
    const [validasi_email, setvalidasi_email] = useState(false);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handle_step = (event) => {
        setJudul(null);
    if (nomor_tiket.length<12) {setvalidasi_nomortiket(true);}else{setvalidasi_nomortiket(false);}
    if (!emailRegex.test(email)) {setvalidasi_email(true);}else{setvalidasi_email(false);}

    if(nomor_tiket.length>=12 && emailRegex.test(email)){
        getDataByTiket();
    }
    };

    const handleSubmit = async () => {
        //e.preventDefault();
        const formData = new FormData();
        sweetsuccess();
        formData.append("nomor_tiket", nomor_tiket); // pastikan file diset dengan setFile()
        formData.append("email", email);
        try {
            await axios.post(apiurl + 'api/open-item/opendata_feedback', formData);

            setShow(false);
            sweetsuccess();
        } catch (error) {
            sweeterror(error.response?.data?.msg || "Gagal menambah data");
        }
         handleClose();
    };

    function sweetsuccess(){
        Swal.fire({
            title: "Sukses",
            html: "Feedback Berhasil Dikirim",
            timer: 2000,
            icon: "success",
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              
            },
            willClose: () => {
                navigate(0);
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

  return (
    <>
        {/* FAB Rotated */}
         <a href='#' 
            className='px-5 py-2 btn btn-blueorange text-white-a font_weight600 bg-border2 mt-2 d-flex '
            onClick={handleShow}
        ><FcFeedback size={20} /> Lacak Permohonan Dataset</a>
       

      {/* Modal */}
      <Modal show={show} onHide={handleClose} size="l" centered>
        
        <Modal.Header closeButton>
            <div className="d-flex justify-content-center mr-10">
                <img 
                    src={image2} 
                    className='img-header'
                    style={{ width: "auto", height: "35px" }}  
                />
                
            </div>
           

        </Modal.Header>
        <Form onSubmit={handleSubmit} className="px-2">
            <p className="text-center text-body textsize12 font_weight600 mt-3">Cari kiriman tiket anda disini</p>
            <Modal.Body>
                <Form.Group controlId="formPurpose" className="mt-3">
                    <Form.Label className="font_weight600">Nomor Tiket <span className="text-red">*</span></Form.Label>
                    <Form.Control
                        className="bg-input"
                        value={nomor_tiket}
                        onChange={(e) => setNomorTiket(e.target.value)}
                        placeholder="Contoh:  TKT-281xxxxx"
                        required
                    />
                    {validasi_nomortiket && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Nomor Tiket Tidak Valid.</p>}
                </Form.Group>
                 <Form.Group controlId="formPurpose" className="mt-3">
                    <Form.Label className="font_weight600">Email <span className="text-red">*</span></Form.Label>
                    <Form.Control
                        className="bg-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Contoh: netizen@gmail.com..."
                        required
                    />
                    {validasi_email && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Email Tidak Valid.</p>}
                </Form.Group>
                <div>
                    {judul ? (
                        <div className="mt-3 p-3 border-radius-10 bg-lightgrey text-center">
                            <p className="font_weight600 mb-1">Data Ditemukan:</p>
                            <p className="font_weight600 mb-1 textsize12">" {judul} "</p>
                            <Link to={`/Dataset/Permohonan/Tiket/${nomor_tiket}`} className="btn btn-primary btn-sm mt-2">
                                Lihat Permohonan
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-3 p-3 border-radius-10 bg-lightgrey text-center">
                            <p className="font_weight600 mb-1">Data tidak ditemukan</p>
                        </div>
                    )}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Batal
                </Button>
                <Button variant="primary" type="button" onClick={handle_step}>
                Cari Tiket
                </Button>
            </Modal.Footer>
            </Form>

      </Modal>
    </>
  );
};

export default PermohonanLacakModal;
