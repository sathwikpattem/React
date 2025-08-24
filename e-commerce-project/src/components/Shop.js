import React, { useState, useEffect } from "react";
import "./Shop.css";
import ItemService from "../services/ItemService";

const Shop = () => {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch items from database on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const fetchedItems = await ItemService.getAllItems();
        setItems(fetchedItems);
        setError(null);
      } catch (err) {
        setError('Failed to load items. Please make sure the backend server is running.');
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  function addToCart(element) {
    if (cart.some((item) => item.id === element.id)) {
      // 1. Make a shallow copy of the cart
      let temp_cart = [...cart];

      // 2. Make a shallow copy of the product you want to mutate
      let index = cart.findIndex((item) => item.id === element.id);
      let temp_product = cart[index];

      // 3. Update the quantity
      temp_product.quantity = temp_product.quantity + 1;

      // 4. Put it back into our array. We are updating the array here, but that's why we made a copy first
      cart[index] = temp_product;

      // 5. Set the state to our new copy
      setCart(temp_cart);
      setCartTotal(cartTotal + cart[index].price);
    } else {
      element.quantity = 1;
      setCart([...cart, element]);
      setCartTotal(cartTotal + element.price);
    }
  }

  function removeFromCart(element) {
    element.quantity = element.quantity - 1;
    if (element.quantity >= 1) {
      setCartTotal(cartTotal - element.price);
    } else {
      if (element.quantity === 0) {
        let hardCopy = [...cart];
        hardCopy = hardCopy.filter((cartItem) => cartItem.id !== element.id);
        setCart(hardCopy);
      }
      setCartTotal(cartTotal - element.price);
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="main">
        <div className="loading">Loading items...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="main">
        <div className="error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  const listItems = items.map((element) => (
    <div key={element.id} className="product-item">
      <div>{element.name}</div>
      <div className="product-item__price">{`$${element.price}`}</div>
      <button type="submit" onClick={() => addToCart(element)}>
        +{" "}
      </button>
    </div>
  ));
  const cartItems = cart.map((element) => (
    <div key={element.id} className="product-item">
      <div>
        {element.name} ({element.quantity})
      </div>
      <button type="submit" onClick={() => removeFromCart(element)}>
        -
      </button>
    </div>
  ));
  return (
    <div className="main">
      <div className="shop">{listItems}</div>
      <div className="cart">
        {cartItems}
        Total: ${cartTotal}/-
      </div>
    </div>
  );
};

export default Shop;
