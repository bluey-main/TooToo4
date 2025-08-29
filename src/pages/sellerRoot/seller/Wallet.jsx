import React, { useEffect, useState } from 'react';
import { useStripeConnect } from "../../../utils/useStripeConnect";
import { ConnectAccountOnboarding, ConnectComponentsProvider } from '@stripe/react-connect-js';
// import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import {CiWarning} from "react-icons/ci"
import { useAuth } from '@/context/AuthContext';

const Wallet = () => {
    const { userDetails } = useAuth();
    const [accountCreatePending, setAccountCreatePending] = useState(false);
    const [onboardingExited, setOnboardingExited] = useState(false);
    const [error, setError] = useState(false);
    const [connectedAccountId, setConnectedAccountId] = useState();
    const [verified, setVerified] = useState(false);
    const [disable,setDisable] = useState(false);
    const [checkingVerification, setCheckingVerification] = useState(false);
    const stripeConnectInstance = useStripeConnect(connectedAccountId);
        const host = import.meta.env.VITE_NODE_ENV === 'production' 
      ? "https://jamazan-backend-1zzk.onrender.com"
      : "http://localhost:7000";

    const accountStatus = async () => {
        if (!connectedAccountId) return;

        setCheckingVerification(true);
        try {
            const request = await axios.post(`${host}/account_status`, {
                accountId: connectedAccountId,
                userId: userDetails?.id,
            });
            const { verified } = request.data;
            if (verified) {
                localStorage.setItem("stripe_account_info", JSON.stringify({ verified, connectedAccountId }));
                setVerified(true);
            } else {
                setVerified(false);
            }
            console.log(request.data);
        } catch (error) {
            console.log("ERROR", error);
        } finally {
            setCheckingVerification(false);
        }
    };

    const createConnectedAccount = async () => {
        setAccountCreatePending(true);
        setError(false);

        // Avoid creating a new account if user already has a Stripe account
        if (userDetails?.stripe_account_id || connectedAccountId) {
            setError("Stripe account already exists.");
            setAccountCreatePending(false);
            return;
        }

        try {
            const response = await fetch(`${host}/account`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userDetails }),
            });
            const json = await response.json();
            const { account, error } = json;

            if (account) {
                setConnectedAccountId(account);
                console.log("Account Created", account);
            }
            if (error) {
                setError(error);
                console.log("Error Creating Account", error);
            }
        } catch (err) {
            setError("An error occurred while creating the Stripe account.");
        } finally {
            setAccountCreatePending(false);
        }
    };

    useEffect(() => {
        const storedInfo = JSON.parse(localStorage.getItem("stripe_account_info"));
        if (storedInfo?.connected_account_id) {
            setConnectedAccountId(storedInfo.connected_account_id);
            setVerified(storedInfo.verified);
        } else if (userDetails?.stripe_account_id) {
            setConnectedAccountId(userDetails.stripe_account_id);
        }
    }, [userDetails]);

    useEffect(() => {
        if (connectedAccountId) {
            localStorage.setItem("stripe_connected_account", connectedAccountId);
            accountStatus();
        }
    }, [connectedAccountId]);

    useEffect(() => {
        if (onboardingExited) {
            console.log("Onboarding exited");
            accountStatus();
        }
    }, [onboardingExited]);

    useEffect(() => {
        if (!stripeConnectInstance) {
            console.log("Stripe Connect is NOT ready yet");
        } else {
            console.log("Stripe Connect loaded:");
        }
    }, [stripeConnectInstance]);

    useEffect(()=>{
        console.log(userDetails)
    },[]);

    const withDraw = async () => {
        setDisable(true);
        try {
            const request = await axios.post(`${host}/withdraw`, {
                stripeId: connectedAccountId
            });
            
            console.log(request);
            
            if (request.data.success && request.data.url) {
                // Open in new tab instead of redirecting current page
                window.open(request.data.url, '_blank');
                
            } 
            
            setDisable(false);
        } catch (error) {
            toast.error("An Unexpected Error Occurred");
            
        }
    }

    return (
        <React.Fragment>
            <div className="min-h-screen gap-5 bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">JAMAZAN</h2>
                    </div>
                    {userDetails && !userDetails?.stripeVerified && <div className=" bg-yellow-100 border-[1px] border-yellow-400 rounded-md p-4 text-center">
                        <p className=" font-semibold flex gap-2 items-center justify-center">WARNING <CiWarning className=" text-xl"/></p><br/>
                        <p>
                            Your Stripe Account has not been verified please provide your details below in order to start your stripe onboarding 
                        </p>
                    </div>}
                    <div>
                        {error && (
                            <div className="border rounded-md p-4 bg-red-100 text-red-700">
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        {verified ? (
                            <div className="text-center flex flex-col gap-5">
                                <div className="text-center border rounded-md p-4 bg-green-100 text-green-800">
                                <p className="text-sm font-medium">✅ Your Stripe account has been verified. You’ve already submitted your information.</p>
                                </div>
                                <button onClick={withDraw} disabled={disable} className={` mb-5 ${disable?"bg-green-500":"bg-green-700"} py-2 rounded-md text-white font-semibold`}>Withdraw from Stripe</button>
                            </div>
                        ) : (
                            <>
                                {!connectedAccountId && !accountCreatePending && (
                                    <div className="text-center">
                                        <p className="mb-4 text-sm text-gray-700">No Stripe account found</p>
                                        <button
                                            onClick={createConnectedAccount}
                                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#086047] hover:bg-[#075239] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            disabled={accountCreatePending}
                                        >
                                            {accountCreatePending ? "Creating Account..." : "Sign Up with Stripe"}
                                        </button>
                                    </div>
                                )}

                                {connectedAccountId && !verified && (
                                    <div className="text-center">
                                        {checkingVerification && (
                                            <p className="text-sm text-gray-500 mb-2">Checking verification status...</p>
                                        )}

                                        {!stripeConnectInstance ? (
                                            <p className="text-sm text-gray-600">Loading Onboarding...</p>
                                        ) : (
                                            <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                                                <ConnectAccountOnboarding onExit={() => setOnboardingExited(true)} />
                                            </ConnectComponentsProvider>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {(connectedAccountId || accountCreatePending || onboardingExited) && (
                            <div className="border rounded-md p-4 bg-gray-50">
                                {connectedAccountId && (
                                    <p className="text-sm text-gray-700">
                                        Your Stripe Connected account ID is:{" "}
                                        <code className="font-semibold text-gray-900">{connectedAccountId}</code>
                                    </p>
                                )}
                                {accountCreatePending && <p className="text-sm text-gray-700">Creating a connected account...</p>}
                                {onboardingExited && <p className="text-sm text-gray-700">The Account Onboarding component has exited</p>}
                            </div>
                        )}

                        
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Wallet;
