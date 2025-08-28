import  { useState } from "react";
import AuthButton from "../Buttons/auth_button";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import { getName } from "../../utils/helper";
import { useAuth } from "../../context/AuthContext";
import { FcGoogle } from 'react-icons/fc';
import { Input } from "../input";

const defaultValue = {
  // first_name: "",
  // last_name: "",
  email_address: "",
  // username: "",
  password: "",
  confirm_password: "",
};
const UserRegister = () => {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [state, setstate] = useState("unloaded");
  const [formField, setFormField] = useState(defaultValue);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const resetFormFields = () => {
    setFormField(defaultValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setstate("loading");
    // const { email_address, password, confirm_password,  first_name, last_name } = formField;

    const { email_address, password, confirm_password, } = formField;


    if (password !== confirm_password) {
      toast.error("passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Please input a longer password (8+)");
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await signUpWithEmail(email_address, password);
      if (error) throw error;

      const { error: profileError } = await supabase
        .from("users")
        .update({
          // username,
          // firstName: first_name,
          // lastName: last_name,
        })
        .eq("email", email_address);

      if (profileError) throw profileError;

      setIsLoading(false);
      toast.success("Welcome to JAMAZAN");
      navigate("/");
      resetFormFields();
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }

    setstate("loaded");
  };


  const handleGoogleSignUp = async()=>{
    try{
      const { error } = await signInWithGoogle() || {};
      if (error) throw error;
      toast.success("User Signed successfully");
      navigate("/account/profile");
    }catch(error){
      console.error('Error signing up:', error);
    }
  }

  return (
    <>
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {Object.keys(formField).map((key) => {
          return (
            <Input
              key={key}
              name={getName(key)}
              type={getName(key)}
              value={formField[key]}
              placeholder={getName(key)}
              onChange={(e) => {
                setFormField((prev) => ({
                  ...prev,
                  [key]: e.target.value,
                }));
              }}
            />
          );
        })}

        <AuthButton title="Sign Up" isLoading={isLoading} />
      </form>

      <p className="mt-10 text-center text-sm text-gray-500">
        Have an account?{" "}
        <Link
          to={"/auth/login"}
          className="font-semibold leading-6  hover:opacity-90"
        >
          Sign In
        </Link>
      </p>
    </div>
    <div className=" px-5 pt-5">
      <button onClick={handleGoogleSignUp}
        className="w-full flex gap-5 items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-100"
      >
        <FcGoogle className=' text-2xl'/>
        <span className="">Sign Up with Google</span>
      </button>                 
    </div>
    </>
  );
};

export default UserRegister;
