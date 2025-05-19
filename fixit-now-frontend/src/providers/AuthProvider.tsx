import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";

const API_URL = import.meta.env.VITE_API_URL || "";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          dispatch(setUser(data));
        } else {
          dispatch(setUser(null));
        }
      })
      .catch(() => dispatch(setUser(null)));
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
