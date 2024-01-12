"use client";

import Register from "../components/register";
import { OAuthProviderData } from "../models";
import { Icons } from "@/components/core/icons";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/core/ui/alert";
import { Button } from "@/components/core/ui/button";
import { API_V2_URL } from "@/config/urls";
import { authSlice, useDispatch } from "@/lib/redux";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [oAuthProviderData, setOAuthProviderData] =
    useState<OAuthProviderData | null>(null);
  const [displayRegister, setDisplayRegister] = useState(false);
  const [displayReturnToApp, setDisplayReturnToApp] = useState(false);

  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      // fetching userinfo can be done on the client or the server
      const userInfo = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then((res) => res.data);

      let oAuthProviderData = {
        email: userInfo.email,
        name: userInfo.name,
        provider: "google",
        token: tokenResponse.access_token,
      };
      setOAuthProviderData(oAuthProviderData);
      await onOAuthSuccess(oAuthProviderData);
    },
  });

  const onOAuthSuccess = async (data: OAuthProviderData) => {
    setLoading(true);
    setServerError(null);
    try {
      var loginResponse = await axios.post(
        `${API_V2_URL}/authentication/loginexternal`,
        { provider: data.provider, token: data.token },
      );
      setLoading(false);
      if (loginResponse.status === 200) {
        let webRedirectUrl = searchParams.get("redirect");
        let appRedirectUrl = searchParams.get("redirect_uri");
        dispatch(authSlice.actions.authSuccess(loginResponse.data));
        if (appRedirectUrl != null) {
          let config = {
            headers: {
              Authorization: loginResponse.data.accessToken,
            },
          };
          setLoading(true);
          await axios.post(`${appRedirectUrl}`, null, config);
          setLoading(false);
          setDisplayReturnToApp(true);
        } else if (webRedirectUrl != null) {
          router.replace(webRedirectUrl);
        } else {
          router.replace("/pitwall/home");
        }
      } else if (loginResponse.status === 202) {
        setDisplayRegister(true);
      } else {
        setServerError("Request failed, please try again.");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setServerError("Request failed, please try again.");
    }
  };

  const RenderLogin = () => {
    return (
      <div className="grid grid-flow-col grid-rows-4 justify-items-center">
        <div className="row-span-1">
          <h2 className="scroll-m-20 border-b pb-2 text-center text-3xl font-semibold tracking-tight first:mt-0">
            SIGN IN
          </h2>
        </div>
        <div className="row-span-1">
          <Button onClick={() => googleLogin()}>Sign in with Google 🚀</Button>
        </div>
        {serverError && (
          <div>
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          </div>
        )}
        <div className="row-span-1">
          <div
            id="alert-additional-content-4"
            className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-800 dark:bg-gray-800 dark:text-yellow-300"
            role="alert"
          >
            <div className="flex items-center">
              <svg
                className="me-2 h-4 w-4 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <h3 className="text-lg font-medium">
                More auth providers coming soon.
              </h3>
            </div>
            <div className="mb-4 mt-2 text-sm">
              If you don't have a Google account, it only takes a few minutes to
              create one. We expect to add more login providers in the future.
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RenderContent = () => {
    if (loading) {
      return <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />;
    } else if (displayRegister && oAuthProviderData != null) {
      return (
        <Register
          accountFormValues={{
            email: oAuthProviderData.email,
            name: oAuthProviderData.name,
            provider: oAuthProviderData.provider,
            token: oAuthProviderData.token,
            iracingCustomerId: "",
          }}
        />
      );
    } else if (displayReturnToApp) {
      return (
        <Alert variant="default" color="success">
          Authentication successful, please return to the app.
        </Alert>
      );
    } else {
      return <RenderLogin />;
    }
  };

  return <div className="m-auto">{RenderContent()}</div>;
}
