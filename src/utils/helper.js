
import axios from "axios";

export const getName = (str) =>
  str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export const register = async () => {
  const res = await axios.post("http://localhost:3000/auth/register", {
    name: "John Doe",
    email_address: "",
    password: "",
  });

  console.log(res.data);
};

export function timeAgo(timestamp) {
  // Ensure we have a Date object
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const now = new Date();

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return seconds < 5 ? "just now" : `${seconds} seconds ago`;
  }
}

export function numberWithCommas(x) {
  if(!x){
    return null
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function validateEmail(email) {
  return emailRegex.test(email);
}

export function capitalizeSentence(sentence) {
  let words = sentence.split(" ");

  let capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  let capitalizedSentence = capitalizedWords.join(" ");

  return capitalizedSentence;
}

export function iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}
export function formatDateToDDMMYYYY(timestamp) {
  // If it's a string (from Supabase), convert it to Date
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;

  // Extract the day, month, and year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  // Format as dd/mm/yyyy
  return `${day}/${month}/${year}`;
}

export function orderStatus(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return "text-yellow-500 bg-yellow-100"; // 🟡
    case "processing":
      return "text-blue-500 bg-blue-100"; // 🔵
    case "shipped":
      return "text-indigo-500 bg-indigo-100"; // 🟣
    case "delivered":
      return "text-green-500 bg-green-100"; // 🟢
    case "cancelled":
      return "text-red-500 bg-red-100"; // 🔴
    default:
      return "text-gray-500 bg-gray-100"; // ⚪ fallback
  }
}

