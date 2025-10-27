import { useCart } from "../../store/Store";
import "./OrderSummary.css";

function OrderSummary() {
  const cart = useCart();
  const cartItems = Array.isArray(cart) ? cart : [];

  const allSoloProducts = cartItems.map((product) => (
    <SoloBill product={product} key={product.productId} />
  ));

  const totalPrice = cartItems.reduce(
    (acc, cur) => acc + (cur.quantity ?? 1) * cur.SalePrice,
    0
  );

  return (
    <div className="order-summary_container">
      <h3>Order Summary</h3>
      <div className="order-summary">{allSoloProducts}</div>
      <div className="order-total solo-bill">
        <p>Total</p>
        <span>{totalPrice.toLocaleString()}₫</span>
      </div>
    </div>
  );
}

function SoloBill({ product }) {
  return (
    <div className="solo-bill">
      <p>
        <b>{product.quantity ?? 1}</b> x <b>{product.ProductName}</b>
      </p>
      <span>{(product.SalePrice * (product.quantity ?? 1)).toLocaleString()}₫</span>
    </div>
  );
}

export default OrderSummary;