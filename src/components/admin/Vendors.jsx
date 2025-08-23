import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendors = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("role", "seller");
      if (error) {
        console.log(error);
      } else {
        setVendors(data);
      }
    };
    fetchVendors();
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
          {vendors.map((vendor, key) => {
            return (
              <tr
                onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
                className="bg-white border-b cursor-pointer hover:bg-gray-50 "
                key={key}
              >
                <td className="px-6 py-4">{vendor.username}</td>
                <td className="px-6 py-4">{vendor.email}</td>
                <td className="px-6 py-4">{vendor.phoneNumber}</td>
                <td className="px-6 py-4">{vendor.role}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Vendors;