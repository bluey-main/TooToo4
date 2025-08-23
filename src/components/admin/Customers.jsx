import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("role", "user");
      if (error) {
        console.log(error);
      } else {
        setCustomers(data);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="relative overflow-x-auto border sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Phone
            </th>
            <th scope="col" className="px-6 py-3">
              Role
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, key) => {
            return (
              <tr
                onClick={() => navigate(`/admin/customers/${customer.id}`)}
                className="bg-white border-b cursor-pointer hover:bg-gray-50 "
                key={key}
              >
                <td className="px-6 py-4">{customer.username}</td>
                <td className="px-6 py-4">{customer.email}</td>
                <td className="px-6 py-4">{customer.phoneNumber}</td>
                <td className="px-6 py-4">{customer.role}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;