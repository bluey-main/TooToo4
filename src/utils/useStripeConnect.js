import {useState,useEffect} from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";

export const useStripeConnect = (connectedAccountId)=>{
    const [stripeConnectInstance, setStripeConnectInstance] = useState();
     const host =
    import.meta.env.VITE_NODE_ENV === "PRODUCTION"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:7000";

    useEffect(()=>{
        if(!connectedAccountId) return;

        const fetchClientSecret = async()=>{
            try{
                const response = await fetch(`${host}/account_session`,{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({account:connectedAccountId})
                });

                const data = await response.json();
                console.log("DATA FROM ACCOUNT SESSION USESTRIPE CONNECT HOOK",data);

                if(!response.ok){
                    throw new Error(`Failed to fetch account session: ${data.error}`);
                }
                return data.client_secret

            }catch(error){
                console.log("AN ERROR OCCURRED",error);
            }
        }

        const initializeStripe = async()=>{
           const instance = loadConnectAndInitialize({
               publishableKey: "pk_test_51P81xGRsmFh9wreMAPKsFUb4rxicJJyWp347tq7y0qgksvvXJC2EVepIwk2SkzENu8InXzOUSHyAYFV1j0w3BG0q00Gk8PmyRr",
               fetchClientSecret,
               appearance: {
                   overlays: "dialog",
                   variables: {
                       colorPrimary: "#086047",
                   }
               },
           });
        setStripeConnectInstance(instance);
    };

        initializeStripe();
},[connectedAccountId]);

    return stripeConnectInstance;
}

export default useStripeConnect