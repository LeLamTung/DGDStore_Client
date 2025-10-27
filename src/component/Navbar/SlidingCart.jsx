import { ShoppingCart, X } from "phosphor-react";
import { Link } from "react-router-dom";
import { useCartActions } from "../../store/Store";
import { useCart } from "../../store/Store";
import toast from "react-hot-toast";
import "./SlidingCart.css";

function SlidingCart({ toggleShowCart }) {
  const cart = useCart(); // cart giờ là mảng []
  const { addProductQuantity, removeFromCart } = useCartActions();

  return (
    <div className="sliding-cart_container">
      <CartTop toggleShowCart={toggleShowCart} />
      <CartMain
        cart={cart}
        addProductQuantity={addProductQuantity}
        removeFromCart={removeFromCart}
      />
      <CartCheckOut cart={cart} toggleShowCart={toggleShowCart} />
    </div>
  );
}

function CartTop({ toggleShowCart }) {
  return (
    <div className="cart-top">
      <ShoppingCart size={22} />
      <h2>Your Shopping Cart</h2>
      <div className="close-shopping-cart" onClick={toggleShowCart}>
        <X size="22px" />
      </div>
    </div>
  );
}

function CartMain({ cart, addProductQuantity, removeFromCart }) {
  const cartItems = Array.isArray(cart)
    ? cart.map((product) => (
        <CartProducts
          product={product}
          addProductQuantity={addProductQuantity}
          removeFromCart={removeFromCart}
          key={product.productId}
        />
      ))
    : [];

  return (
    <div className="cart-main_container">
      {cartItems.length < 1 ? (
        <div style={{ textAlign: "center", fontSize: "1.6rem" }}>
          Your cart is empty :(
        </div>
      ) : (
        cartItems
      )}
    </div>
  );
}

function CartProducts({ product, addProductQuantity, removeFromCart }) {
  function inputHandler(e) {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      addProductQuantity(product.productId, value);
    }
  }

  function removeProduct() {
    removeFromCart(product.productId);
    toast.success("Removed from Cart");
  }

  return (
    <div className="cart-product">
      <img
        src={`http://localhost:5000/uploads/${product.ImageName}`}
        alt={product.ProductName}
      />
      <div className="cart-product_info">
        <h3>{product.ProductName}</h3>
        <p>Category: {product.CategoryName}</p>
        <p className="qty">
          Qty:
          <input
            type="number"
            min="1"
            max={product.Stock}
            value={product.quantity ?? 1}
            onChange={inputHandler}
            id="qty"
          />
        </p>
      </div>
      <p className="cart-product_price">
        {`${(product.SalePrice * (product.quantity ?? 1)).toLocaleString()}₫`}
      </p>
      <span className="cart-product_x" onClick={removeProduct}>
        <X size="16px" />
      </span>
    </div>
  );
}

function CartCheckOut({ cart, toggleShowCart }) {
  const totalPrice = Array.isArray(cart)
    ? cart.reduce(
        (acc, item) => acc + item.SalePrice * (item.quantity ?? 1),
        0
      )
    : 0;

  return (
    <div className="cart-checkout_container">
      <h3>Checkout</h3>
      <p>{totalPrice.toLocaleString()}₫</p>
      <Link to="/checkout" onClick={toggleShowCart}>
        Go to Checkout
      </Link>
    </div>
  );
}

export default SlidingCart;
