import React, { useState } from "react";
import { useCartActions, useCart } from "../../store/Store";
import "./UserInfo.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserInfo() {
  const { emptyCart } = useCartActions();
  const cart = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
    payment: "0",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const nameRegex = /^.{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{9,11}$/;

    if (!nameRegex.test(form.firstName)) {
      toast.error("Họ phải có ít nhất 2 ký tự");
      return false;
    }
    if (!nameRegex.test(form.lastName)) {
      toast.error("Tên phải có ít nhất 2 ký tự");
      return false;
    }
    if (!form.email && !emailRegex.test(form.email)) {
      toast.error("Email không hợp lệ");
      return false;
    }
    if (!phoneRegex.test(form.phone)) {
      toast.error("Số điện thoại phải từ 9 đến 11 chữ số");
      return false;
    }
    if (!form.city) {
      toast.error("Vui lòng nhập thành phố");
      return false;
    }
    if (!form.address) {
      toast.error("Vui lòng nhập địa chỉ");
      return false;
    }
    if (!cart || cart.length < 1) {
      toast.error("Giỏ hàng đang trống");
      return false;
    }

    return true;
  };

  async function checkoutHandler() {
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/client/order/Checkout", {
        CustomerName: `${form.firstName} ${form.lastName}`,
        PhoneNumber: form.phone,
        Address: `${form.city} ${form.address}`,
        Notes: form.notes,
        PaymentMethod: form.payment,
      }, {
        withCredentials: true,
      });

      if (form.payment === "0" && response.status === 201) {
        emptyCart();
        toast.success("Đặt hàng thành công (COD)");
        navigate("/");
      } else if (form.payment === "1" && response.status === 200 && response.data.payUrl) {
        toast.success("Chuyển hướng đến MoMo...");
        window.location.href = response.data.payUrl;
      }
    } catch (error) {
      toast.error("Đặt hàng thất bại");
      console.error(error);
    }
  }

  return (
    <div className="user-info_container">
      <h3>Order Information</h3>
      <div className="shipping-address_wrapper">
        <input type="text" placeholder="Họ" name="firstName" value={form.firstName} onChange={handleChange} />
        <input type="text" placeholder="Tên" name="lastName" value={form.lastName} onChange={handleChange} />
        <input type="email" placeholder="Email" name="email" value={form.email} onChange={handleChange} />
        <input type="text" placeholder="Số điện thoại" name="phone" value={form.phone} onChange={handleChange} />
        <input type="text" placeholder="Thành phố" name="city" value={form.city} onChange={handleChange} />
        <input type="text" placeholder="Địa chỉ" name="address" value={form.address} onChange={handleChange} />
        <textarea placeholder="Ghi chú (tùy chọn)" name="notes" value={form.notes} onChange={handleChange} />
        <select name="payment" value={form.payment} onChange={handleChange}>
          <option value="0">COD</option>
          <option value="1">MoMo</option>
        </select>
        <button className="checkout-btn" onClick={checkoutHandler}>Checkout</button>
      </div>
    </div>
  );
}

export default UserInfo;
