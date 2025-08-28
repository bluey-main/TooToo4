import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
// import { useNavigate } from "react-router";
import { ClipLoader } from "react-spinners";


const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading,setLoading] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      try{
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "user");
        if (error) {
          console.log(error);
        } else {
          console.log("Data",data);
          setCustomers(data);
        }
      }catch(error){
        console.log("An Unexpected error occurred")
      }finally{
        setLoading(false) 
      }
    };
    fetchCustomers();
  }, []);

  return (
    customers.length === 0 && !loading ? (
      <div className="w-full flex flex-col items-center justify-center py-5">
        <p>No Data Currently!!</p>
      </div>
    ) : (loading ? (
      <div className="w-full flex flex-col items-center justify-center py-5">
        <ClipLoader />
      </div>
    ) : (
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
            {customers.map(function (customer) {
              return (
                <tr
                  className="rounded-md bg-white border-b cursor-pointer hover:bg-gray-50 "
                  key={customer.id}
                  // onClick={() => navigate(`/admin/customer/${customer.id}`)}
                >
                  <td className="px-6 py-4">
                    {customer.first_name ? customer.first_name : "--"} {customer.last_name ? customer.last_name : "--"}
                  </td>
                  <td className="px-6 py-4">{customer.email ? customer.email : "--"}</td>
                  <td className="px-6 py-4">{customer.phone_number ? customer.phone_number : "-- -- --"}</td>
                  <td className="px-6 py-4">{customer.role}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ))
  );
};

export default Customers;