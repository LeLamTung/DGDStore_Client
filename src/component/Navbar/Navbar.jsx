import { useState, useEffect } from "react";
import { useCart } from "../../store/Store";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "phosphor-react";
import SlidingCart from "./SlidingCart";
import axios from "axios"; // Thêm thư viện axios để gọi API
import "./Navbar.css";

function Navbar() {
  const [showCart, setShowCart] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Biến để kiểm tra trạng thái tải dữ liệu

  // Lấy danh mục từ API khi trang được tải
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/client/category/list"); // API endpoint của bạn
        const data = response.data.data; // Lấy dữ liệu từ key 'data'

        // Kiểm tra nếu dữ liệu trả về là mảng, nếu không gán mặc định là mảng trống
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]); // Gán mảng trống nếu dữ liệu không phải là mảng
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Nếu có lỗi, gán mảng trống
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  function toggleShowCart() {
    setShowCart(!showCart);
  }

  return (
    <header className={`header ${showCart ? "visible" : ""}`}>
      <Navigations toggleShowCart={toggleShowCart} categories={categories} isLoading={isLoading} />
      <SlidingCart toggleShowCart={toggleShowCart} />
      <CartSliderOverlay />
    </header>
  );
}

function CartButton({ toggleShowCart }) {
  const cart = useCart();

  useEffect(() => {
    console.log("Cart in CartButton:", cart);
  }, [cart]);

  const totalCartQty = Array.isArray(cart)
    ? cart.reduce((totalQty, item) => totalQty + item.quantity, 0)
    : 0;

  return (
    <span onClick={toggleShowCart} className="cart-icon">
      <ShoppingCart size={22} />
      <div className="cart-counter">{totalCartQty}</div>
    </span>
  );
}

function Navigations({ toggleShowCart, categories, isLoading }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  function handleOpenNavigation() {
    setIsNavOpen(!isNavOpen);
  }

  return (
    <nav className={`nav container ${isNavOpen ? "nav-open" : ""}`}>
      <span className="brand-name">
        <Link to="/">DGD Store</Link>
      </span>
      <ul className="nav-link_container">
        <li className="nav-link">
          <NavLink to="/">Home</NavLink>
        </li>
        <li className="nav-link">
          <NavLink to="/explore/all">All Product</NavLink>
        </li>
        {/* Hiển thị danh mục hoặc loading nếu đang tải */}
        {isLoading ? (
          <li className="nav-link">Loading...</li>
        ) : (
          categories.map((category) => (
            <li key={category.idCategory} className="nav-link">
              <NavLink to={`/explore/${category.CategoryName}`}>
                {category.CategoryName}
              </NavLink>
            </li>
          ))
        )}
        
      </ul>
      <div className="nav-secondary_btn" onClick={handleOpenNavigation}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="nav-secondary">
        <CartButton toggleShowCart={toggleShowCart} />
      </div>
      <div className="nav-overlay"></div>
    </nav>
  );
}

function CartSliderOverlay() {
  return <div className="cart-slide_overlay"></div>;
}

export default Navbar;
