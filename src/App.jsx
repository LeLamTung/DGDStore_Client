// react router
import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// layout
import RootLayout from "./layout/RootLayout";
// pages
import Home from "./pages/Home";
import ExploreProduct from "./pages/ExploreProducts";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./component/checkout/PaymentSuccess";

import { useEffect } from "react";
import { useCartActions,useCart } from "./store/Store";
// react toast
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="/explore/:category" element={<ExploreProduct />}></Route>
      <Route path="/product/:productId" element={<Product />}></Route>
      <Route path="/checkout" element={<Checkout />}></Route>
      <Route path="/payment-success" element={<PaymentSuccess />}></Route>
    </Route>
  )
);

function App() {
  const cart = useCart(); // lấy cart hiện tại
  const { fetchCart } = useCartActions();
  useEffect(() => {
    fetchCart(); // lấy cart từ session
  }, []);
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          style: {
            padding: "16px",
            fontSize: "1.6rem",
          },
        }}
      />
    </>
  );
}

export default App;
