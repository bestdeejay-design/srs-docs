"use client";

import { AppDispatch } from "@/redux/store";
import { setUserData } from "@/redux/UserSlice";
import axios from "axios";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const useGetMe = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const { userData } = useSelector((state: RootState) => state.user);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const publicRoutes = ["/login", "/register", "/unauthorized"];
    if (publicRoutes.includes(pathname)) {
      return;
    }

    if (userData || hasFetchedRef.current) {
      return;
    }

    hasFetchedRef.current = true;

    const getMe = async () => {
      try {
        const res = await axios.get("/api/me");
        dispatch(setUserData(res.data.user));
      } catch (err) {
        if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 404)) {
          dispatch(setUserData(null));
          hasFetchedRef.current = false;
          return;
        }

        hasFetchedRef.current = false;
        console.error("Failed to load current user:", err);
      }
    };

    getMe();
  }, [dispatch, pathname, userData]);

  return null;
};

export default useGetMe;