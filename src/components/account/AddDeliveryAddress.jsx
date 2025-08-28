import { useState } from "react";
import { AccountButtonOutline } from "../Buttons/AccountButtons";
import Dropdown from "../Dropdown/dropdown";
import { getName } from "../../utils/helper";
import { Select, SelectItem } from "@nextui-org/react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { AccountHeader } from "./AccountHeader";
import { Input } from "../input";

const defaultValue2 = {
  first_name: "",
  last_name: "",
  phone_number: "",
  state: "",
  // city: "",
  address_line_1: "",
  address_line_2: "",
  zip_code: "",
};

const cities = [
  "Kingston",
  "Montego Bay",
  "Spanish Town",
  "Portmore",
  "Ocho Rios",
  "Mandeville",
  "May Pen",
  "Half Way Tree",
  "Savanna-la-Mar",
  "Port Antonio",
  "Linstead",
  "St. Ann's Bay",
  "Spanish Town",
  "Morant Bay",
];

export const AddDeliveryAddress = () => {
  const { userDetails, fetchAddresses } = useAuth();
  const [formField, setFormField] = useState(defaultValue2);
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);
  // const [street, setStreet] = useState("");
  const navigate = useNavigate();
  // const {
  //   ready,
  //   value,
  //   setValue,
  //   suggestions: { status, data },
  //   clearSuggestions,

  const clearFields = () => {
    setFormField(defaultValue2);
    setCity("");
  };

  const saveAddress = async () => {
    if (
      formField.first_name == "" ||
      formField.last_name == "" ||
      formField.phone_number == "" ||
      formField.street == "" ||
      city == ""
    ) {
      toast.error("Please fill in all fields");
    } else {
      try {
        setSaving(true);
        const { error } = await supabase.from("delivery_addresses").insert({
          ...formField,
          city: cities[city],
          user_id: userDetails.id,
          is_default: false,
        });
        if (error) throw error;
        setSaving(false);
        toast.success("Address saved successfully");
        fetchAddresses();
        clearFields();
        navigate(-1);
      } catch (error) {
        setSaving(false);
        console.log(error);
        toast.error("An error occured");
      }
    }
  };

  return (
    <div className="md-p-[3rem] p-4 text-[#313638] w-full gap-5 flex flex-col">
      <div className="flex md:items-center justify-between flex-col md:flex-row gap-3">
        <AccountHeader
          hasBack
          heading="Add delivery address"
          text=""
          className="border-b border-b-[#313638] pb-5 w-full"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {Object.keys(formField).map((key) => {
          return (
            <Input
              key={key}
              name={
                getName(key) == "Street" ? "Street Description" : getName(key)
              }
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

        {/* <div className="relative">
          <label className="block text-sm leading-6 text-start text-gray-600">
            Street Description
          </label>
          <div className="mt-2">
            <input
              disabled={saving}
              id={"street"}
              name={"street"}
              type={"text"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required={true}
              placeholder={"Street"}
              className="block w-full text-base rounded-md border-0 py-2 px-4
   text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
    placeholder:text-gray-400 focus:ring-2 focus:ring-inset
     focus:ring-[#305C45] sm:text-sm sm:leading-6 outline-none disabled:opacity-50"
            />
          </div>
          {status}
          <div>
            {status === "OK" &&
              data.map(({ place_id, description }) => {
                return (
                  <div key={place_id}>
                    <p onClick={() => handleSelect1(description)}>
                      {description}
                    </p>
                  </div>
                );
              })}
          </div>
        </div> */}

        <div className="">
          <Select
            onChange={(e) => setCity(e.target.value)}
            selectedKeys={[city]}
            label="Select a City"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Kingston"
            className="max-w-xs bg-white rounded-md"
          >
            {cities.map((city, index) => (
              <SelectItem key={index} value={city}>
                {city}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex justify-end py-5 mt-5 border-t border-[#31363895] ">
        <AccountButtonOutline
          isLoading={saving}
          text="Save Address"
          onClick={() => {
            saveAddress();
          }}
          className="px-5"
        />
      </div>
    </div>
  );
};
