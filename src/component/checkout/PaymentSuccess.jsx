import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";
import axios from "axios";
import { useCartActions } from "../../store/Store";
const API_URL = import.meta.env.VITE_APP_API_URL;
function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { emptyCart } = useCartActions();
  const [orderInfo, setOrderInfo] = useState(null);

  // 🔹 Lấy orderId từ URL
  const getOrderIdFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get("orderId");
  };

  useEffect(() => {
    const checkOrderStatus = async () => {
      const orderId = getOrderIdFromURL();
      if (!orderId) return;

      try {
          const localRes = await axios.get(
          `${API_URL}/api/client/momo-status`,
          { params: { orderId } } // ✅ gửi ?orderId=MOMOxxxx
        );

        if (localRes.data?.success && localRes.data.status) {
          // Đơn hàng đã có trong DB → hiển thị thông tin
          setOrderInfo({
            source: "local",
            orderId,
            amount: localRes.data.total,
            status: localRes.data.status,
            customer: localRes.data.customer,
            paymentMethod: localRes.data.paymentMethod,
          });
          emptyCart();
          return;
        }

        // 🧩 2️⃣ Nếu chưa có đơn hàng trong DB → kiểm tra trực tiếp MoMo
        const momoRes = await axios.post(
          `${API_URL}/api/client/transaction-status`,
          { orderId }
        );

        if (momoRes.data.resultCode === 0) {
          // Thanh toán MoMo thành công, nhưng DB chưa ghi → thông báo chờ xử lý
          setOrderInfo({
            source: "momo",
            orderId: momoRes.data.orderId,
            transId: momoRes.data.transId,
            amount: momoRes.data.amount,
            message:
              "Thanh toán thành công qua MoMo, hệ thống đang xử lý đơn hàng.",
          });
          emptyCart();
        } else {
          // Giao dịch thất bại
          setOrderInfo({
            error: "Giao dịch thất bại hoặc bị hủy.",
          });
        }
      } catch (err) {
        console.error("❌ Lỗi khi kiểm tra trạng thái thanh toán:", err);
        setOrderInfo({
          error: "Đã xảy ra lỗi khi xác minh thanh toán.",
        });
      }
    };

    checkOrderStatus();
  }, []);

  // 🔹 Giao diện hiển thị
  return (
    <div className="payment-success-container">
      <h2>Thông báo thanh toán</h2>

      {orderInfo === null ? (
        <p>Đang xử lý thanh toán...</p>
      ) : orderInfo.error ? (
        <p className="error">{orderInfo.error}</p>
      ) : (
        <div className="payment-info">
          <p><strong>Mã đơn hàng:</strong> {orderInfo.orderId}</p>
          {orderInfo.transId && (
            <p><strong>Mã giao dịch:</strong> {orderInfo.transId}</p>
          )}
          <p>
            <strong>Số tiền:</strong>{" "}
            {orderInfo.amount
              ? orderInfo.amount.toLocaleString("vi-VN") + " VND"
              : "Không xác định"}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            {orderInfo.status === 1 ? "Thành công ✅" : "Đang xử lý... ⏳"}
          </p>
          {orderInfo.message && (
            <p className="info-note">{orderInfo.message}</p>
          )}
        </div>
      )}

      <button className="back-home-btn" onClick={() => navigate("/")}>
        Quay về trang chủ
      </button>
    </div>
  );
}

export default PaymentSuccess;
