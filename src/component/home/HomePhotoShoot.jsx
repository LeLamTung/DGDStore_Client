import React from "react";
import photo1 from "../../assets/images/home-photo-1.webp";
import photo2 from "../..//assets/images/home-photo-2.webp";
import photo3 from "../../assets/images/home-photo-3.webp";
import photo4 from "../../assets/images/dhc_homepage.webp";
import photo5 from "../../assets/images/DeWatermark.ai_1744233051762.png";
import photo6 from "../../assets/images/lg_homepage.png";
import "./HomePhotoShoot.css";

function HomePhotoShoot() {
  return (
    <div className="photoshoot-container">
      <span className="model-photo_wrapper boy">
        <img src={photo4} className="model-photo" alt="model photograph" />
      </span>
      <span className="model-photo_wrapper boy">
        <img src={photo6} className="model-photo" alt="model photograph" />
      </span>
      <span className="model-photo_wrapper female">
        <img src={photo5} className="model-photo" alt="model photograph" />
      </span>
    </div>
  );
}

export default HomePhotoShoot;
