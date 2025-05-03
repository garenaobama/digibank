"use client";
import React, { useEffect } from "react";
import LoginForm from "../components/LoginForm";
import { login } from "../models/UserModel";

export default function LoginScreen({
  onLoginSuccess,
}: {
  onLoginSuccess: () => void;
}) {
  const handleLogin = (username: string, password: string) => {
    const user = login(username, password);
    if (user) {
      onLoginSuccess();
    } else {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  useEffect(() => {
    console.log("LoginScreen");
  }, []);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%)",
      }}
    >
      {/* Left Side: Illustration */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #ff6a00 0%, #ffb347 100%)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 32,
            marginBottom: 24,
          }}
        >
          MỞ HÀNG THÀNH CÔNG
          <br />
          XUÂN PHONG NHƯ Ý
        </div>
        <img
          src="images/lucky-god.png"
          alt="Lucky God"
          style={{ width: 220, marginBottom: 24 }}
        />
        <div style={{ fontSize: 48, color: "#fff", fontWeight: "bold" }}>
          2025
        </div>
      </div>
      {/* Right Side: Login Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
        }}
      >
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
}
