import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';

export const AdminContext = createContext();
export const useAdmin = () => {
    return useContext(AdminContext)
}

const AdminContextProvider = ({children}) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdmin = async () => {
            const adminData = await JSON.parse(localStorage.getItem("admin"));
            if (adminData) {
                setAdmin(adminData);
            }
            setLoading(false);
        }
        fetchAdmin();
    }, [])

    return (
        <AdminContext.Provider value={{admin, loading}}>
            {children}
        </AdminContext.Provider>
    )
}

AdminContextProvider.propTypes = {
  children: PropTypes.node,
};

export default AdminContextProvider;