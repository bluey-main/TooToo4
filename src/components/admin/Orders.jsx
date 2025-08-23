
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router";
import PropTypes from 'prop-types';

const Orders = ({ slice }) => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*");
    if (error) {
      console.log(error);
    } else {
      if (slice) {
        setOrders(data.slice(0, slice));
      } else {
        setOrders(data);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="relative overflow-x-auto border sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Items
            </th>
            <th scope="col" className="px-6 py-3">
              Price ( $ )
            </th>
            <th scope="col" className="px-6 py-3">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3">
              Amount ($ )
            </th>
            <th scope="col" className="px-6 py-3">
              Category
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, key) => {
            return (
              <tr
                onClick={() => navigate(`/admin/orders/${order.id}`)}
                className="bg-white border-b cursor-pointer hover:bg-gray-50 "
                key={key}
              >
                <td className="px-6 py-4">{order.product.name}</td>
                <td className="px-6 py-4">{order.product.price}</td>
                <td className="px-6 py-4">x{order.product.quantity}</td>
                <td className="px-6 py-4">
                  {order.product.price * order.product.quantity}
                </td>
                <td className="px-6 py-4">{order.product.category}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

Orders.propTypes = {
  slice: PropTypes.number,
};

export default Orders;
