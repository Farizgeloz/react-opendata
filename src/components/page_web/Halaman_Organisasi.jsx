import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import '../../components/styles/style_font.css';
import '../../components/styles/style_bg.css';
import '../../components/styles/style_button.css';
import '../../components/styles/style_design.css';

//const portal = "Portal Open Data";

function Dashboard() {
  const [totalVisitors, setTotalVisitors] = useState(null);
  const [settings, setSetting] = useState("");
  //const [isMobile, setIsMobile] = useState(false);
  //const [image1, setImage1] = useState("");
  //const [image2, setImage2] = useState("");

  useEffect(() => {
    setTimeout(() => {
      getImage();
    }, 500);  

    const increaseVisitor = async () => {
      try {
        // Increment visitor di backend
        await axios.post(`${apiurl}api/opendata_visitor/visitor`);

        // Ambil total
        const response = await axios.get(`${apiurl}api/opendata_visitor/count`);
        setTotalVisitors(response.data);
      } catch (error) {
        console.error('Gagal ambil data pengunjung:', error);
      }
    };

    increaseVisitor();
  }, []);

  const getImage = async () => {
    try {

      /*const response_image = await api_url_satuadmin.get( 'api/open-item/images_item', {
        params: {
          portal:portal
        }
      });
      const data_image = response_image.data.image_opendata_dataset;
      setImage1(data_image.presignedUrl1);
      setImage2(data_image.presignedUrl2);*/

      const response_setting = await axios.get(`${apiurl}api/open-item/site_opendata_setting`);
      const data_setting = response_setting.data;
      setSetting(data_setting);

    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  return (
    <div className="App" style={{background:`linear-gradient(170deg, ${settings.bg_body}4D, #fff 40%, #fff 50%, #fff 65%, ${settings.bg_body})`}}>
     
        
       <Menu/>
      
      <main className='bg-white'>
        
        <AppSatker />
        
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

export default Dashboard;
