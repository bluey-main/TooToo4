import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import { useUser } from "../../../context/UserContext";
import toast from "react-hot-toast";
import { supabase } from "../../../lib/supabase";
import { ClipLoader } from "react-spinners";
import { useAuth } from "@/context/AuthContext";

function EditProfile() {
  const navigate = useNavigate();
  const { userDetails } = useAuth();
  const [loadingProfileUpdate, setLoadingProfileUpdate] = useState(false);
  const [editProfileDetails, setEditProfileDetails] = useState({
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
  });

  // Populate form with user details on component mount
  useEffect(() => {
    if (userDetails) {
      setEditProfileDetails({
        username: userDetails.username || "",
        first_name: userDetails.first_name || "",
        last_name: userDetails.last_name || "",
        phone_number: userDetails.phone_number || "",
        email: userDetails.email || "",
      });
    }
  }, [userDetails]); // Ensure it updates if userDetails changes

  // Function to update profile details in Firebase
  const updateProfile = async () => {
    try {
      setLoadingProfileUpdate(true);
      const { error } = await supabase
        .from("profiles")
        .update(editProfileDetails)
        .eq("id", userDetails.id);

      if (error) {
        throw error;
      }

      const { data: userData, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userDetails.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      localStorage.setItem("userDetails", JSON.stringify(userData));
      toast.success("Profile Updated");
      navigate("/seller/profile");
      window.location.reload();
    } catch (error) {
      toast.error("Error updating profile: " + error.message);
    } finally {
      setLoadingProfileUpdate(false);
    }
  };

  const handleInputChange = (id, event) => {
    const { value } = event.target; // Get the value from the input
    setEditProfileDetails((prevValues) => ({
      ...prevValues,
      [id]: value, // Update the specific field
    }));
  };
  return (
    <>
      {loadingProfileUpdate ? (
        <div className="bg-white flex justify-center items-center h-screen w-full">
          <ClipLoader color="#166134" />
        </div>
      ) : (
        <form
          className=" bg-white px-3 py-2 md:px-10 md:py-8 rounded-md"
          onSubmit={updateProfile}
        >
          <div action="" className=" py-2 flex flex-col gap-3 ">
            <label htmlFor="" className=" space-y-2">
              <p className=" text-sm font-light">UserName</p>
              <input
                id="userName"
                type="text"
                className=" w-full outline-none border-gray-300 border-[1px] rounded-md bg-white p-1"
                placeholder="James"
                value={editProfileDetails.username}
                onChange={(e) => handleInputChange("username", e)}
              />
            </label>
            <section className=" md:col-span-3 sm:grid sm:grid-cols-2 md:gap-6 flex flex-col w-full gap-3">
              <label htmlFor="" className=" space-y-2">
                <p className=" text-sm font-light">First name</p>
                <input
                  type="text"
                  className=" w-full outline-none border-gray-300 border-[1px] rounded-md bg-white p-1"
                  placeholder="James"
                  value={editProfileDetails.first_name}
                  onChange={(e) => handleInputChange("first_name", e)}
                />
              </label>
              <label htmlFor="" className=" space-y-2">
                <p className=" text-sm font-light">Last name</p>
                <input
                  className=" w-full px-2 py-2 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1"
                  type="text"
                  placeholder="Jacobs"
                  value={editProfileDetails.last_name}
                  onChange={(e) => handleInputChange("last_name", e)}
                />
              </label>
            </section>
            <section className=" md:col-span-3 sm:grid sm:grid-cols-2 md:gap-6 flex flex-col w-full gap-3">
              <label htmlFor="" className=" space-y-2">
                <p className=" text-sm font-light">Phone number</p>
                <input
                  className=" w-full px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1"
                  type="text"
                  placeholder="08000000000"
                  value={editProfileDetails.phone_number}
                />
              </label>
              <label htmlFor="" className=" space-y-2">
                <p className=" text-sm font-light">Email address</p>
                <input
                  className=" w-full px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1"
                  type="text"
                  placeholder="myemail@gmail.com"
                  value={editProfileDetails?.email}
                  readOnly
                  disabled
                />
              </label>
            </section>
          </div>
          {/* <section className=' space-y-3 md:grid-cols-2 grid-cols-1 grid pb-5  justify-between md:items-center'>
                        <label htmlFor="" className=' space-y-2'>
                            <p className=' text-sm font-light'>City </p>
                            <input className='sm:w-64 md:w-52 lg:w-72 w-full px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1' type="text" placeholder='Enter city'/>
                        </label>
                        <label htmlFor="" className=' space-y-2'>
                            <p className=' text-sm font-light'>State</p>
                            <select name="" id="" className='w-full px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1'>
                                <option value="">Select State</option>
                            </select>
                        </label>
                    </section><br /> */}
          {/* <section className=' pb-5  md:grid md:grid-cols-2 space-y-4 flex flex-col justify-between md:items-center'>
                        <label htmlFor="" className=' space-y-2'>
                            <p className=' text-sm font-light'>Password </p>
                            <input className='sm:w-64 md:w-52 lg:w-72 w-full px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1' type="text" placeholder='Enter city'/>
                        </label>
                        <label htmlFor="" className=' space-y-2'>
                            <p className=' text-sm font-light'>Confirm password</p>
                            <input className='sm:w-64 md:w-52 lg:w-72 w-full px-2 py-1 border-[1px] border-gray-300 rounded-md  outline-none bg-white p-1' type="text" placeholder='Confirm password'/>
                        </label>
                    </section> */}
          <section className=" py-5 flex justify-between">
            <button
              onClick={() => {
                navigate("/seller/profile");
              }}
              className=" rounded-md border-[1px] border-green-800 text-green-800 px-3 py-1"
            >
              Cancel
            </button>
            <button
              className=" rounded-md bg-green-800 text-white px-3 py-1"
              type="submit"
            >
              Save Changes
            </button>
          </section>
        </form>
      )}
    </>
  );
}

export default EditProfile;