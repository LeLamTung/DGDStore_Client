import { useCartActions } from "../../store/Store";
import "./ProductView.css";
import toast from "react-hot-toast";
import { useState } from "react";

function ProductView({ productData }) {
  const { addToCart } = useCartActions();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  async function handleAddToCart() {
  if (!productData || !productData.idProduct) {
    toast.error("Invalid product data");
    return;
  }

  try {
    await addToCart({
      idProduct: productData.idProduct,
      quantity: 1,
      Stock: productData.Stock,
    });
    toast.success("Added to Cart");
  } catch (error) {
    const backendMessage =
      error.response?.data?.message || // lấy message từ backend nếu có
      (error.response?.status === 401
        ? "Please log in to add items to cart"
        : "Failed to add to cart");

    toast.error(backendMessage); // hiển thị thông báo backend gửi về
    console.error("Add to cart error:", error);
  }
}


  const { ProductName, ImageName, Description, SalePrice, OriginalPrice, Images = [] } = productData;

  const sortedImages = [...Images].sort((a, b) => (b.MainImage ? 1 : 0) - (a.MainImage ? 1 : 0));

  const salePercent =
    OriginalPrice > SalePrice
      ? Math.round(((OriginalPrice - SalePrice) / OriginalPrice) * 100)
      : 0;

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + sortedImages.length) % sortedImages.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sortedImages.length);
  };

  return (
    <div className="product-container">
      <div className="product-img_wrapper">
        {sortedImages.length > 0 ? (
          <>
            <img
              src={`${sortedImages[currentImageIndex].ImageLink}`}
              alt={ProductName}
            />
            {sortedImages.length > 1 && (
              <div className="image-controls">
                <button onClick={handlePrevImage}>&lt;</button>
                <button onClick={handleNextImage}>&gt;</button>
              </div>
            )}
          </>
        ) : (
          <img
            src={`${ImageName}`}
            alt={ProductName}
          />
        )}
      </div>

      <div className="product-info">
        <h2 className="product-name">{ProductName}</h2>

        {OriginalPrice > SalePrice ? (
          <>
            <p className="product-price">
              <span className="original-price">
                {OriginalPrice.toLocaleString()}₫
              </span>{" "}
              <span className="sale-percent">-{salePercent}%</span>
            </p>
            <p className="sale-price">{SalePrice.toLocaleString()}₫</p>
          </>
        ) : (
          <p className="product-price">{SalePrice.toLocaleString()}₫</p>
        )}

        <p className="product-description">{Description}</p>
        <button className="product-cart_btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductView;
