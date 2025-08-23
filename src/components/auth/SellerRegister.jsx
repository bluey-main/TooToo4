import { useState } from "react";
import AuthButton from "../Buttons/auth_button";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import { getName } from "../../utils/helper";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../input";

const defaultValue = {
  first_name: "",
  last_name: "",
  email_address: "",
  business_name: "",
  password: "",
  confirm_password: "",
};
const SellerRegister = () => {
  const { signUpWithEmail } = useAuth();
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
    const {
      email_address,
      password,
      confirm_password,
      business_name,
      first_name,
      last_name,
    } = formField;

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
          businessName: business_name,
          firstName: first_name,
          lastName: last_name,
          role: "seller",
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

  return (
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
          to={
            "/auth/login?return_url=https%3A%2F%2Fjamazan.vercel.app%2Fseller%2Fdashboard"
          }
          className="font-semibold leading-6  hover:opacity-90"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SellerRegister;