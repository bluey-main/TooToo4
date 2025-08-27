import { useState, useEffect } from "react";
import AuthButton from "../../components/Buttons/auth_button";
import AuthHeading from "../../components/auth/auth_heading";
import { getName } from "../../utils/helper";
import { FcGoogle } from 'react-icons/fc';
// import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Input } from "@/components/input";

const defaultValue = {
  email_address: "",
  password: "",
};

export const Login = () => {
  // const { signInWithEmail, signInWithGoogle } = useAuth();
    const { signInWithEmail, signInWithGoogle } = useAuth()

  const [formField, setFormField] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const resetFormFields = () => {
    setFormField(defaultValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { email_address, password } = formField;

    try {
      setIsLoading(true);
      const { error } = await signInWithEmail(email_address, password);
      setIsLoading(false);
      if (error) {
        throw error;
      }
      resetFormFields();
      navigate("/");
    } catch (e) {
      setIsLoading(false);
      toast.error(e.message);
    }
  };

  const handleGoogleSignUp = async()=>{
    try{
      const { error } = await signInWithGoogle();
      if(error){
        throw error;
      }
      toast.success("User Signed successfully");
      navigate("/account/profile");
    }catch(error){
      console.error('Error signing up:', error);
      toast.error(error.message);
    }
  }

  
    // const handleEmailAuth = async (e: React.FormEvent) => {
    //   e.preventDefault()
    //   setLoading(true)
    //   setError(null)
  
    //   try {
    //     const { error } = isSignUp 
    //       ? await signUpWithEmail(email, password)
    //       : await signInWithEmail(email, password)
  
    //     if (error) {
    //       setError(error.message)
    //     }
    //   } catch (err) {
    //     setError('An unexpected error occurred')
    //   } finally {
    //     setLoading(false)
    //   }
    // }
  
    // const handleGoogleAuth = async () => {
    //   const { error } = await signInWithGoogle()
    //   if (error) {
    //     setError(error.message)
    //   }
    // }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-6">
        <AuthHeading />

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
            <p className="text-right text-sm text-gray-500">
              <Link
                to={"/auth/forgot-password"}
                className="font-semibold text-p hover:opacity-90"
              >
                Forgot Password?
              </Link>
            </p>
            <AuthButton isLoading={isLoading} title={"Sign In"} />
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not registered?{" "}
            <Link
              to={"/auth/register"}
              className="font-semibold leading-6 hover:opacity-90"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <div className=" px-5">
        <button onClick={handleGoogleSignUp}
            className="w-full flex gap-5 items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-100"
        >
          <FcGoogle className=' text-2xl'/>
          <span className="">Login with Google</span>
        </button>                 
      </div>
    </>
  );
};