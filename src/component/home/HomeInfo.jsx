import React from "react";
import "./HomeInfo.css";
import { Link } from "react-router-dom";

function HomeInfo() {
  return (
    <article className="home-info">
      <div className="info-txt">
        <h2>
        DGD Store – Điện máy chất lượng, cuộc sống dễ dàng.
        </h2>
        <p>
        Chào mừng đến với DGD Store – thế giới của thiết bị điện gia dụng hiện đại!
        Chúng tôi mang đến cho bạn những sản phẩm chất lượng cao, từ nhà bếp đến phòng khách, 
        giúp tối ưu hóa mọi trải nghiệm sống. Với DGD, tiện nghi không chỉ là lựa chọn – 
        mà là tiêu chuẩn.
        </p>
      </div>
      <button className="explore-clothing_btn">
        <Link to="explore/all">Discover Our Products</Link>
      </button>
    </article>
  );
}

export default HomeInfo;
