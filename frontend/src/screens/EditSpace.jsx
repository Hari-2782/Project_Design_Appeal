import { Global, css } from "@emotion/react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import ApparelSelector from "../components/ApparelSelector/ApparelSelector";
import DesignNavBar from "../components/DesignNavBar/DesignNavBar";
import ItemsBar from "../components/ItemsBar/ItemsBar";
import Workstage from "../components/Workstage/Workstage";
import "./EditSpace.css";
import { red } from "@mui/material/colors";
import { grey } from '@mui/material/colors';
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: "center",
  color: theme.palette.text.primary,
  boxShadow: "none",
}));

const EditSpace = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [imageDataURL, setImageDataURL] = useState(null);
  const [cartItem, setCartItem] = useState(null);
  const [selectedApparel, setSelectedApparel] = useState({
    type: "Tshirt", 
    size: "",
  });
  const [color, setColor] = useState("#ffffff");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [materialPrice, setMaterialPrice] = useState(0);
  const [materialName, setMaterialName] = useState(""); 

  const navbarRef = useRef(null);

  const toggleSidebar = (isOpen) => {
    setIsSidebarOpen(isOpen);
  };

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, [navbarRef]);

  const handleApparelSelect = (apparel) => {
    setSelectedApparel(apparel);
  };

  const handleMaterialSelect = (material) => {
    setMaterialPrice(material.price);
    setMaterialName(material.name);
  };

  const handleFinalImageReady = (dataUrl) => {
    setImageDataURL(dataUrl);
    const newItem = {
      selectedApparel,
      color,
      text,
      image,
      materialPrice,
      materialName, 
    };
    setCartItem(newItem);
  };

  return (
    <>
      <div className="editspace">
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0}>
            <Grid item xs={12} ref={navbarRef}>
              <Item>
                <DesignNavBar />
              </Item>
            </Grid>
            <Grid item xs={isSidebarOpen ? 4 : 1} >
              <Item>
                <ItemsBar
                  onToggleSidebar={toggleSidebar}
                  onColorChange={setColor}
                  onTextChange={setText}
                  onImageUpload={setImage}
                  onMaterialSelect={handleMaterialSelect} 
                />
              </Item>
            </Grid>
            <Grid item xs={isSidebarOpen ? 6 : 11}>
              <Item>
                <Workstage
                  selectedApparel={selectedApparel}
                  color={color}
                  text={text}
                  image={image}
                  materialPrice={materialPrice}
                  materialName={materialName} 
                  onFinalImageReady={handleFinalImageReady}
                />
              </Item>
            </Grid>
          </Grid>
        </Box>
      </div>
      <ApparelSelector
        onApparelSelect={handleApparelSelect}
        selectedOptions={selectedApparel}
        setSelectedOptions={setSelectedApparel}
        handleConfirm={handleApparelSelect}
      />
      <Global
        styles={css`
          .sidebar {
            height: calc(100vh - ${navbarHeight}px);
            overflow-y: auto;
          background-color: ${grey[300]};  
             
          }
        `}
      />
    </>
  );
};

export default EditSpace;
