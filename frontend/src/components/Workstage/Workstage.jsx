import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Text, Image, Transformer } from "react-konva";
import useImage from "use-image";
import Konva from "konva";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Typography from "../Homepage/Typography";
import { Button } from "@mui/material";

const Workstage = ({
  selectedApparel,
  color,
  text,
  image,
  materialPrice,
  colorPrice = 50,
  imagePrice = 100,
  textPrice = 50,
  onFinalImageReady,
  materialName = "",
}) => {
  const navigate = useNavigate();
  const stageWidth = 850;
  const stageHeight = 550;

  const [stageDimensions, setStageDimensions] = useState({
    width: stageWidth,
    height: stageHeight,
    scale: 1,
  });

  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const apparelImageRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const transformerRef = useRef(null);

  const [apparelImageSrc, setApparelImageSrc] = useState(null);
  const [imageDataURL, setImageDataURL] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (selectedApparel) {
      import(`./${selectedApparel.type}.png`)
        .then((image) => setApparelImageSrc(image.default))
        .catch((error) => console.error(`Error loading image: ${error}`));
    }
  }, [selectedApparel]);

  const [apparelImage] = useImage(apparelImageSrc);
  const [additionalImage] = useImage(image);

  const handleResize = () => {
    if (containerRef.current) {
      let containerWidth = containerRef.current.clientWidth;
      let scale = containerWidth / stageWidth;
      if (scale > 1) scale = 1;
      setStageDimensions({
        width: stageWidth * scale,
        height: stageHeight * scale,
        scale: scale,
      });
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const stage = apparelImageRef.current?.getStage();
    if (stage && apparelImageRef.current) {
      apparelImageRef.current.cache();
      stage.batchDraw();
    }
  }, [color]);

  const scaleImage = (image, maxWidth, maxHeight) => {
    if (!image) return image;
    const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
    return { ...image, scaleX: scale, scaleY: scale };
  };

  const handleColorChange = (image) => {
    if (!image) return null;

    const colorRGB =
      typeof color === "string" ? Konva.Util.getRGB(color) : color;

    if (!colorRGB) return null;

    const scaledImage = scaleImage(
      image,
      stageDimensions.width * 0.8,
      stageDimensions.height * 0.8
    );

    return (
      <Image
        image={image}
        ref={apparelImageRef}
        x={stageDimensions.width / 2}
        y={stageDimensions.height / 2}
        offsetX={image.width / 2}
        offsetY={image.height / 2}
        scaleX={scaledImage.scaleX}
        scaleY={scaledImage.scaleY}
        draggable
        filters={[Konva.Filters.RGB]}
        red={colorRGB.r}
        green={colorRGB.g}
        blue={colorRGB.b}
        onClick={() => {
          transformerRef.current.nodes([apparelImageRef.current]);
          transformerRef.current.getLayer().batchDraw();
        }}
        onLoad={() => {
          apparelImageRef.current.cache();
          apparelImageRef.current.getStage()?.batchDraw();
        }}
      />
    );
  };

  const handleAdditionalImage = (image) => {
    if (!image) return null;
    const scaledImage = scaleImage(
      image,
      stageDimensions.width * 0.6,
      stageDimensions.height * 0.6
    );
    return (
      <Image
        image={image}
        ref={imageRef}
        x={stageDimensions.width / 2}
        y={stageDimensions.height / 2 + 100}
        offsetX={image.width / 2}
        offsetY={image.height / 2}
        scaleX={scaledImage.scaleX}
        scaleY={scaledImage.scaleY}
        draggable
        onClick={() => {
          transformerRef.current.nodes([imageRef.current]);
          transformerRef.current.getLayer().batchDraw();
        }}
      />
    );
  };

  const handleText = () => {
    return (
      <Text
        ref={textRef}
        text={text}
        x={stageDimensions.width / 2}
        y={stageDimensions.height / 2}
        fontSize={24}
        fontFamily="Arial"
        draggable
        fill="black"
        onClick={() => {
          transformerRef.current.nodes([textRef.current]);
          transformerRef.current.getLayer().batchDraw();
        }}
      />
    );
  };

  useEffect(() => {
    if (stageRef.current) {
      const stage = stageRef.current;
      const transformer = transformerRef.current;
      if (transformer) {
        stage.on("click", (e) => {
          if (e.target === stage) {
            transformer.nodes([]);
            transformer.getLayer().batchDraw();
            return;
          }
        });
      }
    }
  }, [stageRef, transformerRef]);

  const totalPrice =
    (color ? colorPrice : 0) +
    (image ? imagePrice : 0) +
    (text ? textPrice : 0) +
    materialPrice +
    (selectedApparel && selectedApparel.price ? +selectedApparel.price : 0);

  const handleSaveImage = () => {
    const stage = stageRef.current;
    if (stage) {
      stage.toDataURL({
        callback(dataUrl) {
          setImageDataURL(dataUrl);
          onFinalImageReady(dataUrl);
          setIsModalOpen(true);
        },
        mimeType: "image/png",
        quality: 1,
      });
    }
  };
  
  const handleAddToCart = async () => {
    if (!materialName) {
      alert("Please select material first");
      return;
    }
    const userInfo = localStorage.getItem("userInfo");
    const parsedUserInfo = JSON.parse(userInfo);

    if (!parsedUserInfo || !parsedUserInfo._id) {
      alert("User not logged in");
      return;
    }

    try {
      const newItem = {
        userId: parsedUserInfo._id,
        imageDataURL,
        color,
        materialName,
        materialPrice,
        colorPrice,
        imagePrice,
        textPrice,
        text,
        selectedApparel,
        totalPrice,
      };

      console.log("Adding to cart:", newItem);

      await axios.post("/api/cart", newItem);

      setIsModalOpen(false);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <Stage
        width={stageDimensions.width}
        height={stageDimensions.height}
        scaleX={stageDimensions.scale}
        scaleY={stageDimensions.scale}
        ref={stageRef}
      >
        <Layer>
          {handleColorChange(apparelImage)}
          {handleAdditionalImage(additionalImage)}
          {handleText()}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
      <div>
        <Typography>Total Price: ${totalPrice}</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSaveImage}
        >
          Save Design{" "}
        </Button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        ariaHideApp={false}
        style={{
          content: {
            width: "60%",
            height: "60%",
            margin: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
        }}
      >
        <div>
          <img
            src={imageDataURL}
            alt="Final Design"
            style={{ maxWidth: "90%", maxHeight: "80%" }}
          />
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button  variant="contained" color="error" sx={{ mt: 2 }} onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button  variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAddToCart}>Add to Cart</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Workstage;
