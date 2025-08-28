
import { createContext, useContext, useEffect, useState } from "react";
// import { useUser } from "./UserContext";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import PropTypes from 'prop-types';
import { useAuth } from "./AuthContext";

export const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { userDetails } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCartItems = async () => {
    if (!userDetails?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("cart")
        .eq("id", userDetails.id)
        .single();
      if (error) {
        throw error;
      }
      console.log("THE CART IS", data?.cart)
      setCartItems(data.cart || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!userDetails?.id) {
      toast.error("Please login to add items to cart");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("cart")
        .eq("id", userDetails.id)
        .single();
      if (error) {
        throw error;
      }
      const currentCart = data.cart || [];
      const itemIndex = currentCart.findIndex((item) => item.id === product.id);
      if (itemIndex > -1) {
        currentCart[itemIndex].quantity += 1;
      } else {
        currentCart.push({ ...product, quantity: 1 });
      }
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ cart: currentCart })
        .eq("id", userDetails.id);
      if (updateError) {
        throw updateError;
      }
      setCartItems(currentCart);
      toast.success("Item added to cart");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  const reduceProductQuantity = async (product) => {
    if (!userDetails?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("cart")
        .eq("id", userDetails.id)
        .single();
      if (error) {
        throw error;
      }
      const currentCart = data.cart || [];
      const itemIndex = currentCart.findIndex((item) => item.id === product.id);
      if (itemIndex > -1) {
        if (currentCart[itemIndex].quantity > 1) {
          currentCart[itemIndex].quantity -= 1;
        } else {
          currentCart.splice(itemIndex, 1);
        }
      }
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ cart: currentCart })
        .eq("id", userDetails.id);
      if (updateError) {
        throw updateError;
      }
      setCartItems(currentCart);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromCart = async (product) => {
    if (!userDetails?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("cart")
        .eq("id", userDetails.id)
        .single();
      if (error) {
        throw error;
      }
      const currentCart = data.cart || [];
      const updatedCart = currentCart.filter((item) => item.id !== product.id);
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ cart: updatedCart })
        .eq("id", userDetails.id);
      if (updateError) {
        throw updateError;
      }
      setCartItems(updatedCart);
      toast.success("Item removed from cart");
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item from cart");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!userDetails?.id) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ cart: [] })
        .eq("id", userDetails.id);
      if (error) {
        throw error;
      }
      setCartItems([]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const isItemInCart = (product) => {
    return cartItems.find((item) => item.id === product.id);
  };

  useEffect(() => {
    getCartItems();
  }, [userDetails]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        reduceProductQuantity,
        removeItemFromCart,
        clearCart,
        getCartTotal,
        isItemInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node,
};
