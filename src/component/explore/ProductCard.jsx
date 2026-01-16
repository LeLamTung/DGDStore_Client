import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCartActions } from "../../store/Store";
import "./ProductCard.css";
const API_URL = import.meta.env.VITE_APP_API_URL;
function ProductCard({ product: productData }) {
  const { addToCart } = useCartActions();

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
    // toast.success("Added to Cart"); 
  } catch (error) {
    // const backendMessage =
    //   error.response?.data?.message || // lấy message từ backend nếu có
    //   (error.response?.status === 401
    //     ? "Please log in to add items to cart"
    //     : "Failed to add to cart");

    // toast.error(backendMessage); // hiển thị thông báo backend gửi về
    console.error("Add to cart error:", error);
  }
}

  const {
    ProductName,
    Stock,
    Description,
    ImageName,
    SalePrice,
    OriginalPrice,
    idProduct,
  } = productData;

  const salePercent =
    OriginalPrice > SalePrice
      ? Math.round(((OriginalPrice - SalePrice) / OriginalPrice) * 100)
      : 0;

  return (
    <div className="product-card_wrapper">
      <Link to={`/product/${idProduct}`}>
        <div className="product-card_img">
          <img
            src={`${ImageName}`}
            alt={ProductName}
          />
        </div>
      </Link>
      <div className="product-card_description">
        <h3>{ProductName}</h3>
        <p>
          {Description && Description.length > 50
            ? Description.slice(0, 50) + "..."
            : Description}
        </p>

        <span className="product-card_bottom">
          <button className="add-cart_btn" onClick={handleAddToCart}>
            Add to Cart
          </button>

          <div className="product-card_price">
            {OriginalPrice > SalePrice ? (
              <>
                <span className="original-price">
                  {OriginalPrice.toLocaleString()}₫
                </span>
                <span className="sale-percent">-{salePercent}%</span>
                <div className="sale-price">
                  {SalePrice.toLocaleString()}₫
                </div>
              </>
            ) : (
              <b>{SalePrice.toLocaleString()}₫</b>
            )}
          </div>
        </span>
      </div>
    </div>
  );
}

export default ProductCard;
