import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';


export const useUserName = (addressId) => {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const { data, error } = await supabase
          .from("addresses")
          .select("first_name")
          .eq("id", addressId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setUserName(data.first_name);
        } else {
          toast.error("No user found with the provided ID");
        }
      } catch (error) {
        toast.error("An error occurred while fetching user details");
      }
    };

    if (addressId) {
      fetchUserName();
    }
  }, [addressId]);

  return userName;
};
