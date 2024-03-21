"use client";

import { reduxStore } from "@/lib/redux";
import { Provider } from "react-redux";

export const Providers = (props: React.PropsWithChildren) => {
  return <Provider store={reduxStore}>{props.children}</Provider>;
};
