import { useState, useEffect } from "react";
import { AccountButtonOutline } from "../Buttons/AccountButtons";
import { getName } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { useProfile } from "../../context/ProfileContext";
import { AccountHeader } from "./AccountHeader";
import { Input } from "../input";

const defaultValue = {
  first_name: "",
  last_name: "",
  email_address: "",
  phone_number: "",
};

export const AddAccountInfo = () => {
  const { userDetails } = useAuth();
  const { refreshProfile } = useProfile();
  const [formField, setFormField] = useState(defaultValue);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails) {
      if (Object.keys(userDetails).length > 0) {
        setFormField({
          first_name: userDetails.first_name || "",
          last_name: userDetails.last_name || "",
          email_address: userDetails.email || "",
          phone_number: userDetails.phone_number || "",
        });
      }
    }
  }, [userDetails]);

  // Check if any required fields are empty
  const hasEmptyFields = () => {
    return (
      formField.first_name.trim() === "" ||
      formField.last_name.trim() === "" ||
      formField.phone_number.trim() === ""
      // Note: email is not included in empty check since it should always be populated
    );
  };

  const updateProfile = async () => {
    // Validate required fields (excluding email since it's read-only)
    if (
      formField.first_name.trim() === "" ||
      formField.last_name.trim() === "" ||
      formField.phone_number.trim() === ""
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newData = {
      first_name: formField.first_name.trim(),
      last_name: formField.last_name.trim(),
      email: formField.email_address.trim(),
      phone_number: formField.phone_number.trim(),
    };

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from("profiles")
        .update(newData)
        .eq("id", userDetails.id);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      // Refresh profile data
      await refreshProfile();

      toast.success("Account information saved successfully");
      
      // Navigate back instead of reloading the page
      navigate("/account/profile/add-new-address");
      // window.location.reload();

    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating account information");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="md-p-[3rem] p-4 text-[#313638] w-full gap-5 flex flex-col">
      <div className="flex md:items-center justify-between flex-col md:flex-row gap-3">
        <AccountHeader
          hasBack
          heading="Account information"
          text=""
          className="border-b border-b-[#313638] pb-5 w-full"
        />
      </div>

      {/* Show heading if any required fields are empty */}
      {hasEmptyFields() && (
        <h1 className="text-2xl font-bold text-center text-red-600 my-4">
          Please complete your profile
        </h1>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {Object.keys(formField).map((key) => {
          const isEmailField = key === "email_address";

          return (
            <Input
              key={key}
              name={getName(key)}
              type={"text"}
              value={formField[key] || ""}
              placeholder={getName(key)}
              readOnly={isEmailField}
              disabled={isEmailField}
              className={
                isEmailField ? "bg-gray-100 cursor-not-allowed opacity-70" : ""
              }
              onChange={(e) => {
                if (!isEmailField) {
                  setFormField((prev) => ({
                    ...prev,
                    [key]: e.target.value,
                  }));
                }
              }}
            />
          );
        })}
      </div>

      <div className="flex justify-end py-5 mt-5 border-t border-[#31363895] ">
        <AccountButtonOutline
          text="Save"
          isLoading={saving}
          onClick={() => updateProfile()}
          className="px-5"
        />
      </div>
    </div>
  );
};