"use client";

import { Icons } from "@/components/core/icons";
import {
  authSlice,
  selectIsAuthenticated,
  selectOAuthToken,
  useDispatch,
  useSelector,
} from "@/lib/redux";
import { OAuthToken } from "@/lib/redux/slices/authSlice/models";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isSet, setIsSet] = useState(false);

  const isAuthenticated = useSelector<boolean>(selectIsAuthenticated);
  const oAuthToken = useSelector<OAuthToken | null>(selectOAuthToken);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, pathname, router]);

  useEffect(() => {
    axios.interceptors.request.clear();
    if (oAuthToken != null) {
      axios.interceptors.request.use(async (config) => {
        let expiration = new Date(0).setUTCSeconds(oAuthToken.expires);
        if (
          Date.now() <
          expiration -
            10 /*10 is slight buffer to ensure request won't expire in transit*/
        ) {
          config.headers.Authorization = `Bearer ${oAuthToken.accessToken}`;
        } else {
          dispatch(authSlice.actions.logoff());
        }
        return config;
      });
      setIsSet(true);
    }
    return () => {
      axios.interceptors.request.clear();
    };
  }, [oAuthToken, dispatch]);

  return (
    <>
      {!isAuthenticated || !isSet ? (
        <div className="m-auto">
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div>{children}</div>
      )}
    </>
  );
}
