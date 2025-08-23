/* eslint-disable react/prop-types */
import logo from "../../assets/newlogo_resized.png";
import { Link } from "react-router-dom";

const AuthHeading = ({ text = "Sign in to your account" }) => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <Link to={"/"}>
          <img className="mx-auto w-auto size-20" src={logo} alt="Your Company" />
      </Link>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        {text}
      </h2>
    </div>
  );
};

export default AuthHeading;
