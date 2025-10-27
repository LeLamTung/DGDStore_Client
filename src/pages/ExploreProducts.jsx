import { useEffect, useState } from "react";
import ProductCard from "../component/explore/ProductCard";
import SelectCategory from "../component/explore/SelectCategory";
import PriceFilter from "../component/explore/PriceFilter";
import "./ExploreProducts.css";
import { useParams } from "react-router-dom";
import Shimmer from "../component/shimmer/Shimmer";
import axios from "axios";
import { Pagination } from "antd"; // 👈 thêm dòng này

function ExploreProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceFlter, setPriceFilter] = useState("default");
  const [checkBoxState, setCheckBoxState] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const { category } = useParams();

  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/client/product/list"
        );
        if (res.data.cod === 200) {
          const allProducts = res.data.data;
          const categoryNames = Array.from(
            new Set(
              allProducts.map((p) => p.Category?.CategoryName).filter(Boolean)
            )
          );

          setCategories(categoryNames);

          const initialCheckState = {};
          categoryNames.forEach((name) => (initialCheckState[name] = false));

          if (category === "all") {
            setCheckBoxState(initialCheckState);
          } else {
            setCheckBoxState({
              ...initialCheckState,
              [category]: true,
            });
          }

          setProducts(allProducts);
        }
      } catch (err) {
        console.error("Lỗi khi load sản phẩm:", err);
      }
    }

    fetchData();
  }, [category]);

  function handleCategoryCheckBox(e) {
    const { name, checked } = e.target;
    setCheckBoxState({ ...checkBoxState, [name]: checked });
    setCurrentPage(1); // Reset về trang đầu khi đổi danh mục
  }

  function handlePriceFilter(e) {
    const filter = e.target.value;
    setPriceFilter(filter);
    setCurrentPage(1); // Reset về trang đầu khi đổi lọc giá
  }

  const filteredProducts = products.filter((product) => {
    const catName = product.Category?.CategoryName || "";
    const nameMatch = product.ProductName.toLowerCase().includes(
      searchKeyword.toLowerCase()
    );

    const isAnyChecked = Object.values(checkBoxState).some((v) => v);
    const categoryMatch = !isAnyChecked || checkBoxState[catName];

    return nameMatch && categoryMatch;
  });

  const sortedProducts = [...filteredProducts];
  if (priceFlter === "low-to-high") {
    sortedProducts.sort((a, b) => a.SalePrice - b.SalePrice);
  } else if (priceFlter === "high-to-low") {
    sortedProducts.sort((a, b) => b.SalePrice - a.SalePrice);
  }

  // Phân trang phía client
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <main className="product-main">
      <div className="search-container">
        <h1 className="product-title">Tìm kiếm</h1>
        <input
          type="text"
          placeholder="Tên sản phẩm"
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
      </div>

      <PriceFilter
        priceFlter={priceFlter}
        handlePriceFilter={handlePriceFilter}
      />

      <div className="explore-products_container">
        <SelectCategory
          categories={categories}
          checkBoxState={checkBoxState}
          handleCheckBox={handleCategoryCheckBox}
        />

        <div className="products-container">
          <AllProducts products={paginatedProducts} />

          {/* Phân trang */}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={sortedProducts.length}
              onChange={(page, newPageSize) => {
                setCurrentPage(page);
                setPageSize(newPageSize); // cập nhật số sản phẩm mỗi trang
              }}
              showSizeChanger
              pageSizeOptions={[4, 8, 12, 16]}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function AllProducts({ products }) {
  return products.length ? (
    products.map((product) => (
      <ProductCard product={product} key={product.idProduct} />
    ))
  ) : (
    <Skeleton />
  );
}

function Skeleton() {
  return Array.from({ length: 4 }, (_, i) => <Shimmer key={i} />);
}

export default ExploreProduct;
