// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   GoogleAuthProvider,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   // sendEmailVerification,
//   signInWithPopup,
// } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   getDoc,
//   setDoc,
//   collection,
//   query,
//   getDocs,
//   updateDoc,
//   arrayUnion,
//   where
// } from "firebase/firestore";
// // import axios from "axios";
// import {
//   getDatabase
// } from "firebase/database";
// import { getStorage } from "firebase/storage";
// // import { useUser } from "../../context/UserContext";

// const firebaseConfig = {
//   apiKey: "AIzaSyB1K_aoUSUHsnAc5JUKE_e1hEB7_CBp8Zg",
//   authDomain: "jamazan-test.firebaseapp.com",
//   projectId: "jamazan-test",
//   storageBucket: "jamazan-test.firebasestorage.app",
//   messagingSenderId: "58813147562",
//   appId: "1:58813147562:web:45c158af8e15827aa763d3"
// };

// const firebaseApp = initializeApp(firebaseConfig);

// const googleProvider = new GoogleAuthProvider();

// googleProvider.setCustomParameters({
//   prompt: "select_account",
// });

// export const auth = getAuth();

// export const db = getFirestore();
// export const storage = getStorage(firebaseApp);
// export const rdb = getDatabase(firebaseApp);



// export const createAuthUserWithEmailAndPassword = async (email, password) => {
//   if (!email || !password) return;

//   return await createUserWithEmailAndPassword(auth, email, password);
// };

// export const signInAuthUserWithEmailAndPassword = async (email, password) => {
//   if (!email || !password) return;

//   return await signInWithEmailAndPassword(auth, email, password);
// };

// export const signOutUser = async () => {
//   await signOut(auth);
//   localStorage.removeItem("authUser");
//   localStorage.removeItem("userDetails");
//   localStorage.removeItem("stripe_account_info");
//   localStorage.removeItem("stripe_connected_account");
//   window.location.reload();
// };

// export const onAuthStateChangedListener = (callback) =>
//   onAuthStateChanged(auth, callback);

// // create user details
// export const createUserDocumentFromAuth = async (userAuth, username, firstName, lastName) => {
//   if (!userAuth) return;

//   const userDocRef = doc(db, "users", userAuth.uid);

//   const userSnapshot = await getDoc(userDocRef);

//   if (!userSnapshot.exists()) {
//     const { email } = userAuth;
//     const createdAt = new Date();
//     try {
//       await setDoc(userDocRef, {
//         email,
//         createdAt,
//         username,
//         firstName,
//         lastName,
//         transactions: [],
//         uid: userAuth.uid,
//         userRole: "user",
//       });
//       return {
//         email,
//         createdAt,
//         username,
//         firstName,
//         lastName,
//         transactions: [],
//         uid: userAuth.uid,
//         userRole: "user",
//       };
//     } catch (error) {
//       throw new Error("Failed to create details: " + error);
//     }
//   }
// };


// export const getAllProductsNames = async () => {
//   try {
//     const q = doc(db, "options", "allProductNames");
//     // const theQuery = query(q, limit(20))
//     const querySnapshot = await getDoc(q);
   
//     return querySnapshot.data().productNames || [];
//   } catch (e) {
//     console.log(e);
//   }

//   return [];
// };

// //User with Google
// export const signUserWithGoogle = async () => {
//   try {
//     const result = await signInWithPopup(auth, googleProvider);
//     const user = result.user;
//     await createUserDocumentFromAuth(user, user.displayName, user.displayName, user.displayName);
//     return user;
//   } catch (error) {
//     console.log("An error occurred", error.message);
//     return null;
//   }
// };

// // create user details
// export const createSellerDocumentFromAuth = async (
//   userAuth,
//   username,
//   firstName,
//   lastName,
//   business_name,
//   phone_number
// ) => {
//   if (!userAuth) return;

//   const userDocRef = doc(db, "users", userAuth.uid);

//   const userSnapshot = await getDoc(userDocRef);

//   if (!userSnapshot.exists()) {
//     const { email } = userAuth;
//     const createdAt = new Date();

//     try {
//       await setDoc(userDocRef, {
//         email,
//         createdAt,
//         username,
//         firstName,
//         lastName,
//         businessName: business_name,
//         phoneNumber: phone_number,
//         transactions: [],
//         uid: userAuth.uid,
//         userRole: "seller",
//       });
//       return {
//         email,
//         createdAt,
//         username,
//         firstName,
//         lastName,
//         businessName: business_name,
//         phoneNumber: phone_number,
//         transactions: [],
//         uid: userAuth.uid,
//         userRole: "seller",
//       };
//     } catch (error) {
//       throw new Error("Failed to create details: " + error);
//     }
//   }
// };

// // get all users in  collection
// export const totalUsers = async () => {
//   const data = [];
//   try {
//     const usersCollection = collection(db, "users");
//     const eachUser = await getDocs(usersCollection);
//     eachUser.forEach(function (user) {
//       data.push(user.data());
//     });
//     console.log(data);
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// // get user details
// export const getUserDetails = async (userAuth) => {
//   if (!userAuth) return null;

//   try {
//     const userDocRef = doc(db, "users", userAuth.uid);
//     const userSnapshot = await getDoc(userDocRef);
//     if (userSnapshot.exists()) {
//       return userSnapshot.data();
//     } else {
//       return null;
//     }
//   } catch (error) {
//     throw new Error("Failed to fetch user details: " + error);
//   }
// };

// // get user details
// export const getUserDetailsWithUid = async (uid) => {
//   if (!uid) return null;

//   try {
//     const userDocRef = doc(db, "users", uid);
//     const userSnapshot = await getDoc(userDocRef);

//     if (userSnapshot.exists()) {
//       return userSnapshot.data();
//     } else {
//       return null;
//     }
//   } catch (error) {
//     throw new Error("Failed to fetch user details: " + error);
//   }
// };


// // get screen collection
// export const getScreenCollections = async function () {
//   const data = [];
//   const screenCollection = collection(db, "piechart");
//   try {
//     const screenSnap = await getDocs(screenCollection);
//     screenSnap.forEach(function (eachData) {
//       data.push(eachData.data());
//     });
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };


// export const getOrders = async function () {
//   const ordersCollection = collection(db, "orders");
//   const data = [];
//   try {
//     const orderSnapshot = await getDocs(ordersCollection);
//     orderSnapshot.forEach(function (eachData) {
//       data.push({...eachData.data(), collectionId:eachData.id});
//     });
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const getOrder = async (documentId)=>{
//   const orderRef = doc(db,"orders", documentId);
//   try{
//     const orderDocument = await getDoc(orderRef);
//     return orderDocument.data();
//   }catch(error){
//     console.log(error);
//   }
// }

// // get user delivery address

// export const getUserDeliveryAddress = async (userId) => {
//   try {
//     const q = query(collection(db, "addresses"), where("userId", "==", userId));
//     let temp = [];
//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//       temp.push(doc.data());
//     });
//     return temp;
//   } catch (e) {
//     console.log(e);
//   }

//   return {};
// };

// export const getUsersAddress = async(id)=>{
//   const addressRef = doc(db,"addresses", id);
//   try{
//     const address = await getDoc(addressRef);
//     return address.data()
//   }catch(error){
//     console.log(error);
//   } 
// }

// export const getUserOrders = async (userId) => {
//   try {
//     const q = query(collection(db, "orders"), where("userId", "==", userId));
//     let temp = [];
//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//       temp.push({ id: doc.id, ...doc.data() });
//     });
//     return temp;
//   } catch (e) {
//     console.log(e);
//   }

//   return {};
// };
// // Gets products
// export const getAllProducts = async () => {
//   try {
//     const q = collection(db, "products");
//     let temp = [];
//     const querySnapshot = await getDocs(q);

//     for (const productDoc of querySnapshot.docs) {
//       const productData = { id: productDoc.id, ...productDoc.data() };

//       // Fetch vendor details
//       const vendorRef = doc(db, "users", productData?.sellerId); // or sellerId
//       const vendorSnap = await getDoc(vendorRef);

//       if (vendorSnap.exists()) {
//         const vendorData = vendorSnap.data();
//         if (vendorData?.stripeAccountId && vendorData?.stripeVerified) {
//           temp.push(productData);
//         }
//       }
//     }

//     console.log("Filtered products:", temp);
//     return temp;
//   } catch (e) {
//     console.error("Error fetching filtered products:", e);
//     return [];
//   }
// };



// export const addRestriction = async (id)=>{
//   const vendorRef = doc(db,"users", id);
//   try{
//     await updateDoc(vendorRef,{isRestricted:true});
//     const snapshot = await getDoc(vendorRef);
//     const data = snapshot.data()
//     return data;
//   }catch(error){
//     console.log(error);
//   }
// }
// export const removeRestriction = async (id)=>{
//   const vendorRef = doc(db,"users", id);
//   try{
//     await updateDoc(vendorRef,{isRestricted:false})
//   }catch(error){
//     console.log(error);
//   }
// }


// export const createReview = async (id)=>{
//   const productRef = doc(db,"products",id);
//   try{
//     await updateDoc(productRef,{reviews:[]})
//   }catch(error){
//     console.log(error);
//   }
// }

// export const addReview = async(id,reviewObj)=>{
//   const productRef = doc(db,"products",id);
//   try{
//     await updateDoc(productRef,{
//       reviews:arrayUnion(reviewObj)
//     })
//   }catch(error){
//     console.log(error);
//   }
// }


// //FUNCTION USED TO SET LIKED ITEMS
// export const createLikedItem = async()=>{
//   const userRef = doc(db,"users",auth.currentUser.uid);
//   try{
//     await updateDoc(userRef,{likedItems:[]})
//     }catch(error){
//       console.log(error)
//     }
// }
// export const addToLikeditem = async(likedItem)=>{
//   const userRef = doc(db,"users",auth.currentUser.uid);
//   try{
//     await updateDoc(userRef,{likedItems:arrayUnion(likedItem)})
//     }catch(error){
//       console.log(error)
//     }

// }
// export const removeLikedItem = async(data)=>{
//   if (!data) return;
//   const userRef = doc(db,"users",auth.currentUser.uid);
//   try{
//     await updateDoc(userRef,{likedItems:data});
//   }catch(error){
//     console.log(error)
//   }
// }


// // PIECHART CODE 
// export const getPieChartCollection = async ()=>{
//   const pichart = collection(db, "piechart");
//   try{
//     const querySnapshot = await getDocs(pichart);
//     const data = querySnapshot.docs.map(doc => doc.data());
//     return data;
//   }catch(error){
//     console.log(error)
//   }
// }

// export const updateMobile = async (addedData)=>{
//   const mobileRef = doc(db,"piechart", "BAFUsuWGoYvABmPTE8ti");
//   try{
//     await updateDoc(mobileRef,{visitors: addedData})
//   }catch(error){
//     console.log(error)
//   }
// }
// export const updateDesktop = async (addedData)=>{
//   const desktopRef = doc(db,"piechart", "FtFLxdJBDaKNA64us0Zw");
//   try{
//     await updateDoc(desktopRef,{visitors: addedData})
//   }catch(error){
//     console.log(error)
//   }
// }
// export const updateTablet = async (addedData)=>{
//   const tabletRef = doc(db,"piechart", "iDgIWalHtWApuL9nhh95");
//   try{
//     await updateDoc(tabletRef,{visitors: addedData})
//   }catch(error){
//     console.log(error)
//   }
// }
// export const updateUnknown = async (addedData)=>{
//   const unknownRef = doc(db,"piechart", "PLDHxovPDazSV0DRYSdH");
//   try{
//     await updateDoc(unknownRef,{visitors: addedData})
//   }catch(error){
//     console.log(error)
//   }
// }