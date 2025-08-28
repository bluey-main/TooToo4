import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router";
import { ClipLoader } from "react-spinners";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true)
      try{
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "seller");
        if (error) {
          console.log(error);
        } else {
          console.log("Data",data);
          setVendors(data);
        }
      }catch(error){
        console.log("An Unexpected error occurred")
      }finally{
        setLoading(false)
      }
    };
    fetchVendors();
  }, []);

  return (
    <div className="w-full">
      {vendors.length === 0 && !loading ? (
        <div className="w-full flex flex-col items-center justify-center py-5">
          <p>No Data Currently!!</p>
        </div>
      ) : (loading? (<div className="w-full flex flex-col items-center justify-center py-5">
          <ClipLoader />
        </div>):
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
              {vendors.map((vendor, key) => (
                <tr
                  onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
                  className="bg-white border-b cursor-pointer hover:bg-gray-50 "
                  key={key}
                >
                  <td className="px-6 py-4">{`${vendor.first_name} ${vendor.last_name}`}</td>
                  <td className="px-6 py-4">{vendor.email}</td>
                  <td className="px-6 py-4">{vendor.phone_number}</td>
                  <td className="px-6 py-4">{vendor.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Vendors;