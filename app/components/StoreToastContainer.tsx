"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StoreToastContainer() {
  return (
    <ToastContainer
      containerId="store"
      position="top-right"
      autoClose={3000}
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable={false}
      theme="dark"
      limit={3}
      style={{ zIndex: 10000 }}
    />
  );
}
