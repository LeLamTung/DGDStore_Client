import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_APP_API_URL;
const useCartStore = create((set) => ({
  cart: [],
  action: {
    // Lấy giỏ hàng từ backend
    fetchCart: async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/client/cart/ListItem`,
          { withCredentials: true }
        );
        const cart = response.data.data|| []; // Đảm bảo data trả về đúng định dạng
        console.log("Cart fetched from server:", cart); // Kiểm tra cart từ backend

        set({ cart });
      } catch (error) {

        console.error("Error fetching cart:", error);
      }
    },

    // Thêm vào giỏ hàng
    addToCart: async (product) => {
      try {
        console.log("Adding product to cart:", product);
        await axios.post(
          `${API_URL}/api/client/cart/addtoCart`,
          {
            productId: product.idProduct, // Đảm bảo rằng productId là đúng
            quantity: 1,
          },
          { withCredentials: true }
        );

        // Sau khi thêm xong thì refetch lại cart
        useCartStore.getState().action.fetchCart();
      } catch (error) {
        const msg = error.response?.data?.message||"Lỗi khi thêm hoặc cập nhật số lượng";
        toast.error(msg); // Ném lỗi để component gọi có thể xử lý
      }
    },

    removeFromCart: async (productId) => {
      try {
        // Giả sử có API để xóa sản phẩm khỏi giỏ
        await axios.delete(
          `${API_URL}/api/client/cart/remove/${productId}`,
          { withCredentials: true }
        );
        // Sau khi xóa thì refetch lại cart
        useCartStore.getState().action.fetchCart();
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    },

    addProductQuantity: async (productId, quantity) => {
      try {
        // Giả sử có API để cập nhật số lượng sản phẩm
        await axios.put(
          `${API_URL}/api/client/cart/updateQuantity`,
          { productId, quantity },
          { withCredentials: true }
        );
        // // Sau khi cập nhật thì refetch lại cart
        // toast.success(
        //   "Cập nhật số lượng thành công"
        // )
        useCartStore.getState().action.fetchCart();
      } catch (error) {
        const msg = error.response?.data?.message || "Lỗi khi cập nhật số lượng";
        toast.error(msg);
      }
    },

    emptyCart: () => {
      set({ cart: [] });
    },
  },
}));

export const useCart = () => useCartStore((store) => store.cart);
export const useCartActions = () => useCartStore((store) => store.action);
