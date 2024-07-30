import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const colorToString = (color) => {
  if (color) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  }
  return 'transparent';
};

const AddToCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("/api/cart");
        setCartItems(response.data.map(item => ({ ...item, selected: false })));
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchCartItems();
  }, []);

  const handleRemove = async (id) => {
    try {
      const item = cartItems.find(item => item._id === id);
      if (item) {
        const materialResponse = await axios.get(`/api/materials/name/${item.materialName}`);
        const material = materialResponse.data;
        if (!material) {
          console.error("Material not found.");
          return;
        }
        await axios.put(`/api/materials/name/${item.materialName}`, {
          quantity: material.quantity + item.quantity
        });

        await axios.delete(`/api/cart/${id}`);
        setCartItems(cartItems.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleQuantityChange = async (id, newQuantity) => {
    try {
      const item = cartItems.find(item => item._id === id);
      if (item) {
        const materialResponse = await axios.get(`/api/materials/name/${item.materialName}`);
        const material = materialResponse.data;
        if (!material) {
          console.error("Material not found.");
          return;
        }
        const quantityDifference = newQuantity - item.quantity;
        if (quantityDifference > 0 && material.quantity < quantityDifference) {
          alert('Requested quantity exceeds available material quantity.');
          return;
        }
        const updatedQuantity = material.quantity - quantityDifference;
        await axios.put(`/api/materials/name/${item.materialName}`, {
          quantity: updatedQuantity
        });
        setCartItems(cartItems.map(cartItem =>
          cartItem._id === id ? { ...cartItem, quantity: newQuantity, availableQuantity: updatedQuantity } : cartItem
        ));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleSelect = (id) => {
    setCartItems(cartItems.map(item =>
      item._id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleCheckout = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    try {
      const selectedItems = cartItems.filter(item => item.selected);
      if (selectedItems.length === 0) {
        alert('No items selected for checkout.');
        return;
      }

      const cartDetails = selectedItems.map(item => ({
        materialName: item.materialName,
        apparelType: item.selectedApparel.type,
        quantity: item.quantity,
        totalPrice: item.totalPrice
      }));
      const total = selectedItems.reduce((total, item) => total + (item.totalPrice * item.quantity), 0);

      const orderDetails = cartDetails.map(item => `${item.materialName} - ${item.apparelType} - ${item.quantity}`).join(', ');

      const response = await axios.post("/api/orders", {
        customerName: userInfo.name,
        orderDetails,
        userId: userInfo._id,
        total
      });

      // Clear cart items after successful order placement
      await Promise.all(selectedItems.map(item => axios.delete(`/api/cart/${item._id}`)));
      setCartItems(cartItems.filter(item => !item.selected));
      
      // Redirect to payment page
      navigate(`/payment?total=${total}&orderId=${response.data._id}`);
    } catch (error) {
      console.error("Error processing order:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h1>Cart</h1>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <div>
          {cartItems.map((item) => {
            const materialPrice = item.materialPrice > 0 ? item.materialPrice : 50;

            return (
              <div key={item._id} style={{ marginBottom: "20px" }}>
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => handleSelect(item._id)}
                />
                <img src={item.imageDataURL} alt="Apparel Design" style={{ maxWidth: "10%" }} />
                
                <p>Material Price: ${materialPrice}</p>
                <p>Color Price: ${item.colorPrice}</p>
                {item.imageDataURL && <p>Image Price: ${item.imagePrice}</p>}
                {item.text && (
                  <>
                    <p>Text Price: ${item.textPrice}</p>
                    <p>Text: {item.text}</p>
                  </>
                )}
                <p>Apparel: {item.selectedApparel.type}</p>
                <p>Total Price per Item: ${item.totalPrice}</p>
                <p>Quantity: 
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    disabled={item.quantity < 1}
                  >
                    -
                  </button>
                  {item.quantity}
                  <button
                    onClick={() => handleQuantityChange(item._id, (item.quantity + 1))}
                    disabled={item.quantity >= item.availableQuantity}
                  >
                    +
                  </button>
                </p>
                <button onClick={() => handleRemove(item._id)}>Remove</button>
              </div>
            );
          })}
          <h2>Final Cart Total: ${cartItems.reduce((total, item) => item.selected ? total + (item.totalPrice * item.quantity) : total, 0)}</h2>
          <button onClick={handleCheckout} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Checkout"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
