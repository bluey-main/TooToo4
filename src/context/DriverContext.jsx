import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import PropTypes from 'prop-types';

export const DriverContext = createContext();
export const useDriver = () => {
    return useContext(DriverContext)
}

const DriverContextProvider = ({children}) => {
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avaliableRides, setAvaliableRides] = useState([]);
    const [allOrders, setAllOrders] = useState([]);

    const fetchAllOrders = useCallback(async () => {
        try {
            const { data, error } = await supabase.from('orders').select();
            if (error) throw error;
            setAllOrders(data);
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        const fetchDriver = async () => {
            const driverData = await JSON.parse(localStorage.getItem("driver"));
            if (driverData) {
                setDriver(driverData);
            }
            setLoading(false);
        }
        fetchDriver();
    }, [])

    useEffect(() => {
        const avaliable = allOrders.filter((order) => {
            return order.isDelivered === false
        })
        setAvaliableRides(avaliable)
    }, [allOrders])

    useEffect(() => {
        fetchAllOrders();
    }, [fetchAllOrders])

    return (
        <DriverContext.Provider value={{driver, loading, avaliableRides, allOrders, fetchAllOrders}}>
            {children}
        </DriverContext.Provider>
    )
}

DriverContextProvider.propTypes = {
  children: PropTypes.node,
};

export default DriverContextProvider;