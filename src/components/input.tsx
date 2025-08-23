import React from "react";

interface InputProps {
  type?: string;
  name?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  name = "name",
  value = "john",
  onChange = () => {},
  placeholder = "john",
  required = true,
  disabled = false,
}) => {
  return (
    <div>
      <label className="block text-sm leading-6 text-start text-gray-600">
        {name}
      </label>
      <div className="mt-2">
        <input
          disabled={disabled}
          id={name}
          name={name}
          type={
            type == "Password" || type == "Confirm Password"
              ? "password"
              : type == "Email Address"
              ? "email"
              : type == "Phone Number"
              ? "tel"
              : type.toLocaleLowerCase().includes("name")
              ? "text"
              : "text"
          }
          autoComplete={
            type == "Password" || type == "Confirm Password"
              ? "password"
              : type == "Email Address"
              ? "email"
              : type == "Phone Number"
              ? "tel"
              : type.toLocaleLowerCase().includes("username")
              ? "name"
              : "text"
          }
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="block w-full text-base rounded-md border-0 py-2 px-4
   text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
    placeholder:text-gray-400 focus:ring-2 focus:ring-inset
     focus:ring-[#305C45] sm:text-sm sm:leading-6 outline-none disabled:opacity-50"
        />
      </div>
    </div>
  );
};

