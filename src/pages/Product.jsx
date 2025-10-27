import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductView from "../component/product/ProductView";
import "./Product.css";

function Product() {
  const [productData, setProductData] = useState(null); // Đổi thành null thay vì array
  const { productId } = useParams(); // Lấy productId từ URL
  console.log(productId); // Kiểm tra giá trị có đúng không
  useEffect(() => {
    async function getData() {
      if (!productId) {
        console.error("productId is undefined"); // Kiểm tra xem productId có hợp lệ không
        return;
      }
      try {
        // Gọi API lấy dữ liệu sản phẩm dựa trên productId
        const data = await axios.get(`http://localhost:5000/api/client/product/list/${productId}`);
        setProductData(data.data.data); // Giả sử API trả về dữ liệu trong key 'data'
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm", error);
      }
    }
    getData();
  }, [productId]);

  return (
    <main className="product-view_main container">
      {productData ? (
        <ProductView productData={productData} />
      ) : (
        <div>Đang tải...</div> // Hiển thị khi đang tải dữ liệu
      )}
    </main>
  );
}

export default Product;
