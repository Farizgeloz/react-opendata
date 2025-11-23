import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation,Link } from "react-router-dom";
import {Container ,Nav,Navbar,NavDropdown, NavLink} from 'react-bootstrap';
import Toogle_Mode from "../page_web/Themes_Mode";
import '../styles/style_font.css';
import { api_url_satudata,api_url_satuadmin } from "../../api/axiosConfig";


const portal = "Portal Open Data";

function MenuItem({title,submenu,linked,bg}){
    const [menuku2, setMenu2] = useState([]);

    const [isMobile, setIsMobile] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(true);
    
    const LinkButton = ({ linked, title }) => {
      const [hover, setHover] = useState(false);

      const buttonStyle = {
        backgroundColor: bg,
        border:'2px solid rgb(255 255 255 / 60%)',
        borderRadius: '5px',
        color: '#ffffff',
        padding: '6px 16px',
        margin: '0 0.25rem',
        fontSize: '100%',
        textDecoration: 'none',
        display: 'inline-block',
        transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s',
        boxShadow: hover ? 'inset 0 0 0 1000px rgba(255, 255, 255, 0.1)' : 'none',
      };

      return (
        <Link
          to={linked}
          style={buttonStyle}
          className="uppercaseku"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {title}
        </Link>
      );
    };

    useEffect(() => {
      getMenu();
    }, []);

    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth <= 768);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const [color2,setColor2] = useState(false);
      const changeColor =() =>{
        if (window.scrollY >=90){
          setColor2(true);
        }else{
          setColor2(false);
        }
      }
      window.addEventListener('scroll', changeColor)

    
    const getMenu = async () => {
      try {
        const response = await api_url_satuadmin.get("api/open-item/menu-opendata2", {
          params: title ? { categoryku: title } : {}
        });

        setMenu2(response.data);

      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };



    const [hover1, setHover1] = useState(false);

    const semuaKosong = menuku2?.every(
          (item) => !item.sub_menu || item.sub_menu.trim() === ""
        );
    
        const linkedFinal = semuaKosong ? menuku2?.[0]?.linked : linked;
    
        if (menuku2 !== null && !semuaKosong) {
          return (
    
            <div className="nav-item dropdown">
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  if (isMobile) setIsAccordionOpen(!isAccordionOpen);
                }}
                className={
                  color2
                    ? 'dropdown-toggle nav-link text-white-a mx-0 textsize10 px-4 uppercaseku'
                    : 'dropdown-toggle nav-link text-blue-a3 mx-0 textsize10 px-4 uppercaseku'
                }
                style={{
                  backgroundColor: bg,
                  border:'2px solid rgb(255 255 255 / 60%)',
                  borderRadius: '5px',
                  color: '#ffffff',
                  padding: '6px 16px',
                  margin: '0 0.25rem',
                  fontSize: '100%',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s',
                  boxShadow: hover1 ? 'inset 0 0 0 1000px rgba(255, 255, 255, 0.1)' : 'none',
                }}
                to="#"
                onMouseEnter={() => setHover1(true)}
                onMouseLeave={() => setHover1(false)}
              >
                {title}
              </Link>
    
              {/* Desktop dropdown */}
              {!isMobile && (
                <div data-bs-popper="static" className="dropdown-menu" aria-labelledby="">
                  {menuku2.map((item) => (
                    <Link key={item.id} to={item.linked} className="nav-link" style={{ fontSize: "100%" }}>
                      {item.sub_menu}
                    </Link>
                  ))}
                </div>
              )}
    
              {/* Mobile accordion */}
              {isMobile && isAccordionOpen && (
                <div className="accordion-menu px-1 mx-2" active>
                  {menuku2.map((item) => (
                    <Link key={item.id} to={item.linked} className="d-block py-2 text-white border-bottom mx-5">
                      {item.sub_menu}
                    </Link>
                  ))}
                </div>
              )}
            </div>
    
          );
        } else {
          // Tidak ada submenu → Button biasa
          return <LinkButton linked={linkedFinal} title={title} />;
        }
}

function Menu({bgku}) {
  const [menuku, setMenu] = useState([]);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [contents, setContents] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    getMenu();
    getContent();
  }, []);

  const getMenu = async () => {
    try {
      const response = await api_url_satuadmin.get( `api/open-item/menu-opendata`);

      // Cek apakah response.data itu array atau object
      const payload = Array.isArray(response.data) ? response.data : response.data.datas;

      setMenu(payload);

      

    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const getContent = async () => {
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

  const [color,setColor] = useState(false);
  const changeColor =() =>{
    if (window.scrollY >=90){
      setColor(true);
    }else{
      setColor(false);
    }
  }
  window.addEventListener('scroll', changeColor)

  return (
    <>
     
    <header  
      className={`${color ? `header2 header-fixed w-100 text-[15px] inset-0` : 'header2 w-100'}`}
      style={{
        backgroundColor: color ? bgku : bgku
      }}
      fixed="top" 
    >
      <Navbar expand="lg" className="w-100">
      
        <Container className="px-0" style={{maxWidth:'95%'}}>
          <Navbar.Brand href="#home" className='d-flex text-blue margin-logo' style={{width:"35vh"}}>
            <img src={image2} className='img-header'  style={{width:"35vh",height:"auto"}}  />
            
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="btn-toggle text-white" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            style={{
              maxWidth: 'calc(100% - 35vh)', // lebar 100% minus 250px
              flex: '1 1 auto',
              whiteSpace: 'nowrap',
              position: 'relative',
            }}
          >
            <Nav className="ms-auto">
              {
                menuku.map((menu,index) => {
                  return (
                    <MenuItem key={index} title={menu.category} submenu={menu.sub_menu} linked={menu.linked}/>
                    
                  );
                })
              
              }
              <Toogle_Mode />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
    </>
  )
}

export default Menu
