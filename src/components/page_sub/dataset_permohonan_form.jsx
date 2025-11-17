import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FcFeedback } from "react-icons/fc";
import { useNavigate,Link, NavLink } from "react-router-dom";

import Swal from 'sweetalert2';
import { MdErrorOutline } from "react-icons/md";
import { api_url_satudata,api_url_satuadmin,api_url_satuadmin_create } from "../../api/axiosConfig";


const portal = "Portal Open Data";

const FeedbackModal = ({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,bginputku,colortitleku,colordateku }) => {
    const [satkerku, setDatasetSatker] = useState([]);
    const [nama, setNama] = useState("");
    const [telpon, setTelpon] = useState("");
    const [email, setEmail] = useState("");
    const [pekerjaan, setPekerjaan] = useState("");
    const [namapekerjaan, setNamapekerjaan] = useState("");
    const [instansi, setInstansi] = useState("");
    const [bidangusaha, setBidangusaha] = useState("");
    const [bidangilmu, setBidangilmu] = useState("");
    const [jabatan, setJabatan] = useState("");
    const [judul, setJudul] = useState("");
    const [penghasil, setPenghasil] = useState("");
    const [opd, setOpd] = useState("");
    const [opdId, setOpdId] = useState(null);  // id opd
    const [tujuan, setTujuan] = useState("");
    const [dihubungi, setDihubungi] = useState("");
    const [deskripsi, setDeskripsi] = useState("");

    
    const [showTiketModal, setShowTiketModal] = useState(false);
    const [nomorTiket, setNomorTiket] = useState("");



    const navigate = useNavigate();

    
    
    useEffect(() => {
        getMenu();
        getDatasetUnsur();
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
        setContents(data_image.contents);

        } catch (error) {
        console.error("Failed to fetch data:", error);
        }
    };

    const getDatasetUnsur = async (dimensi = "",satker = "") => {
       
        const res3 = await api_url_satudata.get("dataset?limit=1000");
        const allDataset = res3.data || [];


        const satkerList = allDataset
            .map(item => ({
            id_opd: item.opd?.id_opd,
            nama_opd: item.opd?.nama_opd
            }))
            .filter(opd => opd.id_opd && opd.nama_opd);

        const uniqueSatker = Array.from(
            new Map(satkerList.map(opd => [opd.id_opd, opd])).values()
        );

        setDatasetSatker(uniqueSatker);
        console.log("satker:" + uniqueSatker);
        

   
    };

    // 🔹 Fungsi generate random tiket (8 digit misalnya)
    // 🔹 Fungsi generate random tiket
    const generateRandomTicket = () => {
        return "TKT-" + Math.floor(10000000 + Math.random() * 90000000);
    };

    // 🔹 Fungsi cek ke database apakah tiket sudah ada
    const checkTicketExists = async (ticket) => {
        try {
            const res = await axios.get(`/api/cek-tiket/${ticket}`);
            return res.data.exists; // true jika sudah ada
        } catch (err) {
            console.error("Error checking ticket:", err);
            return true; // anggap sudah ada kalau error
        }
    };

    // 🔹 Fungsi generate tiket unik
    const generateUniqueTicket = async () => {
        let unique = false;
        let ticket;
        while (!unique) {
            ticket = generateRandomTicket();
            const exists = await checkTicketExists(ticket);
            if (!exists) unique = true;
        }
        return ticket;
    };

    const [validasi_nama, setvalidasi_nama] = useState(false);
    const [validasi_telpon, setvalidasi_telpon] = useState(false);
    const [validasi_email, setvalidasi_email] = useState(false);
    const [validasi_pekerjaan, setvalidasi_pekerjaan] = useState(false);
    const [validasi_namapekerjaan, setvalidasi_namapekerjaan] = useState(false);
    const [validasi_instansi, setvalidasi_instansi] = useState(false);
    const [validasi_bidangusaha, setvalidasi_bidangusaha] = useState(false);
    const [validasi_bidangilmu, setvalidasi_bidangilmu] = useState(false);
    const [validasi_jabatan, setvalidasi_jabatan] = useState(false);
    const [validasi_judul, setvalidasi_judul] = useState(false);
    const [validasi_penghasil, setvalidasi_penghasil] = useState(false);
    const [validasi_opd, setvalidasi_opd] = useState(false);
    const [validasi_tujuan, setvalidasi_tujuan] = useState(false);
    const [validasi_dihubungi, setvalidasi_dihubungi] = useState(false);

    const handle_step = async () => {
        // 🔹 Generate tiket unik
        const nomor_tiket = await generateUniqueTicket();

        // 🔹 Pola validasi
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telponRegex = /^[0-9]{11,15}$/; // hanya angka, 10–15 digit

        // 🔹 Reset semua validasi
        setvalidasi_nama(false);
        setvalidasi_telpon(false);
        setvalidasi_email(false);
        setvalidasi_pekerjaan(false);
        setvalidasi_namapekerjaan(false);
        setvalidasi_instansi(false);
        setvalidasi_bidangusaha(false);
        setvalidasi_bidangilmu(false);
        setvalidasi_jabatan(false);
        setvalidasi_judul(false);
        setvalidasi_penghasil(false);
        setvalidasi_opd(false);
        setvalidasi_tujuan(false);
        setvalidasi_dihubungi(false);

        // 🔹 Validasi dasar
        let valid = true;

        const validate = (condition, setter) => {
            if (!condition) {
            setter(true);
            valid = false;
            }
        };

        validate(nama.length >= 3, setvalidasi_nama);
        validate(telponRegex.test(telpon), setvalidasi_telpon); // validasi format telepon
        validate(emailRegex.test(email), setvalidasi_email); // validasi format email
        validate(pekerjaan.length >= 3, setvalidasi_pekerjaan);
        validate(judul.length >= 3, setvalidasi_judul);
        validate(penghasil.length >= 3, setvalidasi_penghasil);
        //validate(opd.length >= 1, setvalidasi_opd);
        validate(tujuan.length >= 3, setvalidasi_tujuan);
        validate(dihubungi.length >= 3, setvalidasi_dihubungi);

        if (penghasil === "Iya") {
             validate(opd.length >= 1, setvalidasi_opd);
        }
        
        // 🔹 Validasi tambahan sesuai jenis pekerjaan
        if (pekerjaan === "Lainnya") {
            validate(namapekerjaan.length >= 3, setvalidasi_namapekerjaan);
        }

        if (["Wirausaha", "Profesional"].includes(pekerjaan)) {
            validate(instansi.length >= 3, setvalidasi_instansi);
            validate(bidangusaha.length >= 3, setvalidasi_bidangusaha);
        }

        if (pekerjaan === "Sekolah / Akademi / Mahasiswa") {
            validate(instansi.length >= 3, setvalidasi_instansi);
            validate(bidangilmu.length >= 3, setvalidasi_bidangilmu);
        }

        if (pekerjaan === "Pemerintahan") {
            validate(instansi.length >= 3, setvalidasi_instansi);
            validate(jabatan.length >= 3, setvalidasi_jabatan);
        }

        // 🔹 Jika tidak valid, tampilkan peringatan email/telpon jika perlu
        if (!telponRegex.test(telpon)) {
            Swal.fire("Nomor Telepon Tidak Valid", "Nomor hanya boleh angka dan minimal 11 digit.", "warning");
            return;
        }

        if (!emailRegex.test(email)) {
            Swal.fire("Email Tidak Valid", "Masukkan alamat email yang benar, contoh: nama@domain.com", "warning");
            return;
        }

        /* if (penghasil !== "Iya") {
             validate(opdId.length >= 1, setvalidasi_opd);
        } */

        // 🔹 Jika tidak valid, hentikan eksekusi
        if (!valid) return;

        // 🔹 Jika semua valid → tampilkan Swal tiket
        Swal.fire({
            title: "Nomor Tiket Permohonan",
            html: `
            <p class="mb-2">Simpan nomor tiket Anda untuk pengecekan status permohonan:</p>
            <div class="border border-primary rounded py-2 px-3 bg-light text-primary fw-bold" style="font-size:1.3rem;">
                ${nomor_tiket}
            </div>
            <button id="copyTiketBtn" class="btn btn-secondary mt-3" type="button">
                📋 Salin Nomor Tiket
            </button>
            `,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Lanjutkan Submit",
            cancelButtonText: "Batal",
            focusConfirm: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,

            didOpen: () => {
            const copyBtn = document.getElementById("copyTiketBtn");
            if (copyBtn) {
                copyBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                navigator.clipboard.writeText(nomor_tiket).then(() => {
                    Swal.showValidationMessage("Nomor tiket disalin ✅");
                    setTimeout(() => Swal.resetValidationMessage(), 2000);
                });
                });
            }
            },
        }).then((result) => {
            if (result.isConfirmed) {
            handleSubmit(nomor_tiket);
            }
        });
    };



    // ====================
    // 🔹 Fungsi Submit
    // ====================
    const handleSubmit = async (nomor_tiket) => {
        
    try {
        const payload = {
        nomor_tiket, // 🔹 tiket unik
        nama, telpon, email, pekerjaan, instansi,
        bidangusaha, bidangilmu, jabatan, judul,
        penghasil, opd: opdId, deskripsi, tujuan, dihubungi,
        };

        await api_url_satuadmin.post("api/opendata/dataset_permohonan", payload);
        sweetsuccess();
    } catch (error) {
        sweeterror(error.response?.data?.msg || "Gagal menambah data");
    }
    };


    function sweetsuccess(){
        Swal.fire({
            title: "Sukses",
            html: "Permohonan Berhasil Dikirim",
            timer: 2000,
            icon: "success",
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              
            },
            willClose: () => {
                navigate("/Dataset");
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

        <Row className="align-items-center justify-content-center">
            <Col md={8} sm={12} className='align-items-center justify-content-center bg-body bg-border2 mt-3 rad10'>
                <Form /* onSubmit={handleSubmit} */ className="px-2">
                    <p className="text-center textsize14 font_weight600 text-body py-3">Buat Permohonan Baru Dibawah Ini.</p>
                    <div>
                        <p className="textsize11 text-white rad5 px-2" style={{backgroundColor:bgtitleku}}>Identitas Pemohon</p>
                        <Form.Group controlId="formPurpose" className="mt-3">
                            <Form.Label className=" textsize11 text-body">Nama Lengkap <span className="text-red">*</span></Form.Label>
                            <Form.Control
                                className="bg-border2 textsize11"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder="Nama Lengkap"
                                required
                            />
                            {validasi_nama && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Data Tidak Valid.</p>}
                        </Form.Group>
                        <Form.Group controlId="formPurpose" className="mt-3">
                            <Form.Label className=" textsize11 text-body">Nomor Telpon <span className="text-red">*</span></Form.Label>
                            <Form.Control
                                className="bg-border2 textsize11"
                                value={telpon}
                                onChange={(e) => setTelpon(e.target.value)}
                                placeholder="Nomor Telpon"
                                required
                            />
                            {validasi_telpon && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Data Tidak Valid.</p>}
                        </Form.Group>
                        <Form.Group controlId="formPurpose" className="mt-3">
                            <Form.Label className=" textsize11 text-body">Email <span className="text-red">*</span></Form.Label>
                            <Form.Control
                                className="bg-border2 textsize11"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                            />
                            {validasi_email && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Data Tidak Valid.</p>}
                        </Form.Group>
                        <p className="textsize11 text-white rad5 px-2 mt-5" style={{backgroundColor:bgtitleku}}>Informasi Pekerjaan</p>
                        <Form.Group controlId="formPurpose" className="mt-3">
                            <Form.Label className=" textsize11 text-body">Pekerjaan? <span className="text-red">*</span></Form.Label>
                            <Form.Control
                                list="pekerjaanOptions"
                                className="bg-border2 textsize11"
                                value={pekerjaan}
                                onChange={(e) => setPekerjaan(e.target.value)}
                                placeholder="Pekerjaan Anda"
                                required
                            />
                            <datalist id="pekerjaanOptions">
                                <option value="Pelajar / Mahasiswa / Akademi" />
                                <option value="Profesional" />
                                <option value="Wirausaha" />
                                <option value="Pemerintahan" />
                                <option value="Lainnya" />
                            </datalist>
                            {validasi_pekerjaan && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Data Tidak Valid.</p>}
                        </Form.Group>
                       
                            <Form.Group controlId="formPurpose" className="mt-3">
                                <Form.Label className=" textsize11 text-body">Nama Sekolah / Universitas / Instansi? <span className="text-red">*</span></Form.Label>
                                <Form.Control
                                    className="bg-border2 textsize11"
                                    value={instansi}
                                    onChange={(e) => setInstansi(e.target.value)}
                                    placeholder="Sekolah / Instansi Anda"
                                    required
                                />
                            
                                {validasi_instansi && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Data Tidak Valid.</p>}
                            </Form.Group>
                        {/* 🔽 Hanya tampil jika pekerjaan BUKAN Pelajar / Mahasiswa */}
                        {pekerjaan === "Lainnya" && (
                        <>
                            <Form.Group controlId="formPurpose" className="mt-3">
                                <Form.Label className=" textsize11 text-body">Nama Pekerjaan? <span className="text-red">*</span></Form.Label>
                                <Form.Control
                                    className="bg-border2 textsize11"
                                    value={nama_pekerjaan}
                                    onChange={(e) => setNamapekerjaan(e.target.value)}
                                    placeholder="Nama Pekerjaan"
                                    required
                                />
                            
                                {validasi_namapekerjaan && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Data Tidak Valid.</p>}
                            </Form.Group>
                        </>
                        )}
                        {(pekerjaan === "Profesional" || pekerjaan === "Wirausaha") && (
                        <>
                        <Form.Group controlId="formPurpose" className="mt-3">
                            <Form.Label className=" textsize11 text-body">Bidang Usaha? <span className="text-red">*</span></Form.Label>
                            <Form.Control
                                list="bidangusahaOptions"
                                className="bg-border2 textsize11"
                                value={bidangusaha}
                                onChange={(e) => setBidangusaha(e.target.value)}
                                placeholder="Bidang Usaha"
                                required
                            />
                            <datalist id="bidangusahaOptions">
                                <option value="Pertanian (Agrikultur)" />
                                <option value="Pertambangan" />
                                <option value="Pabrikasi (Manufaktur)" />
                                <option value="Kontruksi" />
                                <option value="Perdagangan" />
                                <option value="Jasak Keuangan" />
                                <option value="Jasa Perorangan" />
                                <option value="Jasa Umum" />
                                <option value="Jasa Wisata" />
                            </datalist>
                            {validasi_bidangusaha && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Data Tidak Valid.</p>}
                        </Form.Group>
                        </>
                        )}
                        {pekerjaan === "Pemerintahan" && (
                        <>
                        <Form.Group controlId="formPurpose" className="mt-3">
                            <Form.Label className=" textsize11 text-body">Jabatan? <span className="text-red">*</span></Form.Label>
                            <Form.Control
                                className="bg-border2 textsize11"
                                value={jabatan}
                                onChange={(e) => setJabatan(e.target.value)}
                                placeholder="Jabatan"
                                required
                            />
                           
                            {validasi_jabatan && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Data Tidak Valid.</p>}
                        </Form.Group>
                        </>
                        )}
                        {pekerjaan === "Pelajar / Mahasiswa / Akademi" && (
                        <>
                        <Form.Group controlId="formPurpose" className="mt-3">
                            <Form.Label className=" textsize11 text-body">Bidang Ilmu? <span className="text-red">*</span></Form.Label>
                            <Form.Control
                                list="bidangilmuOptions"
                                className="bg-border2 textsize11"
                                value={bidangilmu}
                                onChange={(e) => setBidangilmu(e.target.value)}
                                placeholder="Bidang Usaha"
                                required
                            />
                            <datalist id="bidangilmuOptions">
                                <option value="Agama & Filsafat" />
                                <option value="Bahasa Sosial & Humaniora" />
                                <option value="Ekonomi" />
                                <option value="Hewani" />
                                <option value="Kedokteran & Kesehatan" />
                                <option value="Matematika & Pengetahuan Alam" />
                                <option value="Pendidikan" />
                                <option value="Seni Design & Media" />
                                <option value="Tanaman" />
                                <option value="Teknik" />
                            </datalist>
                            {validasi_bidangilmu && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Data Tidak Valid.</p>}
                        </Form.Group>
                        </>
                        )}
                        <p className="textsize11 text-white rad5 px-2 mt-5" style={{backgroundColor:bgtitleku}}>Kebutuhan Dataset</p>
                        <Form.Group controlId="formPurpose" className="mt-3">
                            <Form.Label className=" textsize11 text-body">Judul Dataset <span className="text-red">*</span></Form.Label>
                            <Form.Control
                                className="bg-border2 textsize11"
                                value={judul}
                                onChange={(e) => setJudul(e.target.value)}
                                placeholder="Judul Dataset yang Dicari"
                                required
                            />
                            {validasi_judul && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Data Tidak Valid.</p>}
                        </Form.Group>
                        <Form.Group controlId="formPurpose" className="mt-3">
                            <Form.Label className=" textsize11 text-body">Apakah Anda mengetahui organisasi penghasil sumber dataset yang dicari? <span className="text-red">*</span></Form.Label>
                            <Form.Control
                                list="penghasilOptions"
                                className="bg-border2 textsize11"
                                value={penghasil}
                                onChange={(e) => setPenghasil(e.target.value)}
                                placeholder="Contoh: Iya"
                                required
                            />
                            <datalist id="penghasilOptions">
                                <option value="Iya" />
                                <option value="Tidak" />
                            </datalist>
                            {validasi_penghasil && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Data Tidak Valid.</p>}
                        </Form.Group>
                        <Form.Group controlId="formPurpose" className="mt-3">
                            <Form.Label className=" textsize11 text-body">OPD {penghasil === "Iya" && (<span className="text-red">*</span>)}</Form.Label>
                            <Form.Control
                                list="opdOptions"
                                className="bg-border2 textsize11"
                                value={opd}
                                onChange={(e) => {
                                    const namaDipilih = e.target.value;
                                    setOpd(namaDipilih);

                                    // cari id berdasarkan nama
                                    const selected = satkerku.find(s => s.nama_opd === namaDipilih);
                                    setOpdId(selected ? selected.id_opd : null);
                                }}
                                placeholder="OPD"
                                required
                            />
                            <datalist id="opdOptions">
                                {
                                    satkerku.map((satker) => (
                                        <option key={satker.id_opd} value={satker.nama_opd} />
                                    ))
                                }
                                
                            </datalist>
                            {validasi_opd && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Harus Dipilih.</p>}
                        </Form.Group>
                        <Form.Group controlId="formFeedbackText" className="mt-3">
                            <Form.Label className=" textsize11 text-body">Deskripsi Kebutuhan</Form.Label>
                            <Form.Control
                                as="textarea"
                                className="bg-border2 textsize11"
                                rows={4}
                                value={deskripsi}
                                onChange={(e) => setDeskripsi(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPurpose" className="mt-3">
                            <Form.Label className=" textsize11 text-body">Tujuan penggunaan dataset? <span className="text-red">*</span></Form.Label>
                            <Form.Control
                                list="tujuanOptions"
                                className="bg-border2 textsize11"
                                value={tujuan}
                                onChange={(e) => setTujuan(e.target.value)}
                                placeholder="Tujuan penggunaan dataset"
                                required
                            />
                            <datalist id="tujuanOptions">
                                <option value="Referensi Kajian Bisnis" />
                                <option value="Referensi Pembuatan Kebijakan" />
                                <option value="Referensi Pembuatan Kurikulum atau bahan ajar" />
                                <option value="Referensi Tugas atau Karya Ilmiah" />
                                <option value="Referensi Pribadi" />
                                <option value="Lainnya" />
                            </datalist>
                            {validasi_tujuan && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Harus Diisi</p>}
                        </Form.Group>
                        <p className="textsize11 text-white rad5 px-2 mt-5" style={{backgroundColor:bgtitleku}}>Konfirmasi Ketersediaan</p>
                        <Form.Group controlId="formPurpose" className="mt-3">
                            <Form.Label className=" textsize11 text-body">Apakah Anda bersedia dihubungi oleh tim kami untuk berdiskusi lebih lanjut mengenai pengembangan fitur dan layanan Open Data Kabupaten Probolinggo?<span className="text-red">*</span></Form.Label>
                            <Form.Control
                                list="dihubungiOptions"
                                className="bg-border2 textsize11"
                                value={dihubungi}
                                onChange={(e) => setDihubungi(e.target.value)}
                                placeholder="Ketersediaan Dihubungi."
                                required
                            />
                            <datalist id="dihubungiOptions">
                                <option value="Iya" />
                                <option value="Tidak" />
                            </datalist>
                            {validasi_dihubungi && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Harus Diisi</p>}
                        </Form.Group>
                        
                        
                    </div>

                    <div className="d-flex justify-content-end mt-5 mb-5 gap-3">
                        <Button variant="secondary" href="/Dataset">
                        Batal
                        </Button>
                        <Button variant="primary" type="button" onClick={handle_step}>
                        Kirim Permohonan
                        </Button>
                    </div>
                </Form>
            </Col>
        </Row>

       
        

    </>
  );
};

export default FeedbackModal;
