"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { I18nextProvider } from "react-i18next";
import { Provider as ReduxProvider } from "react-redux";
import i18next from "@/lib/i18n/i18n";
import { store } from "@/app/store/store";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <I18nextProvider i18n={i18next}>
        <ReduxProvider store={store}>
          {children}
          <Toaster position="top-right" />
        </ReduxProvider>
      </I18nextProvider>
    </SessionProvider>
  );
}
