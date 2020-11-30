import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { listProducts } from "../actions/productActions";
import Rating from "../components/Rating";

function HomeScreen(props) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const category = props.match.params.id ? props.match.params.id : "";
  const productList = useSelector((state) => state.productList);
  const { products, loading, error } = productList;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listProducts(category));

    return () => {
      //
    };
  }, [category]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(listProducts(category, searchKeyword, sortOrder));
  };
  const sortHandler = (e) => {
    setSortOrder(e.target.value);
    dispatch(listProducts(category, searchKeyword, sortOrder));
  };

  return (
    <>
      {category && <h2>{category}</h2>}
      <center>
        <ul className="filter" style={{ display: "inline" }}>
          <li style={{ display: "inline" }}>
            <form onSubmit={submitHandler} style={{ display: "inline" }}>
              <input
                name="searchKeyword"
                style={{ display: "inline" }}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-warning ml-2"
                style={{ display: "inline", margin: "10px" }}
              >
                Search
              </button>
            </form>
          </li>
          <li style={{ display: "inline" }}>
            Sort By{" "}
            <select name="sortOrder" onChange={sortHandler}>
              <option value="">Newest</option>
              <option value="lowest">Lowest</option>
              <option value="highest">Highest</option>
            </select>
          </li>
        </ul>
      </center>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <ul className="products">
          {products.map((product) => (
            <li key={product._id}>
              <div className="product">
                <center>
                  <Link to={"/product/" + product._id}>
                    <img
                      className="product-image"
                      src={product.image}
                      alt="product"
                    />
                  </Link>
                  <div className="product-name">
                    <Link to={"/product/" + product._id}>{product.name}</Link>
                  </div>
                  <div className="product-brand">Brand: {product.brand}</div>
                </center>
                <div className="product-description">
                  <b>Description: </b>
                  {product.description}
                </div>

                <div className="product-price">Price: ${product.price}</div>
                <div className="product-rating">
                  <Rating
                    value={product.rating + Math.random() * 5}
                    text={
                      Number(product.numReviews + Math.random() * 100).toFixed(
                        0
                      ) + " reviews"
                    }
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
export default HomeScreen;
