import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";

import App from "./App";
import { AppThemeProvider } from "./theme/AppThemeProvider";
import "./i18n";

import logo from "./assets/logo.jpg";

const link =
  document.querySelector<HTMLLinkElement>("link[rel~='icon']") ||
  document.createElement("link");
  document.title = "PawPoint";

(link as HTMLLinkElement).rel = "icon";
(link as HTMLLinkElement).href = logo;

document.head.appendChild(link);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <SnackbarProvider maxSnack={3}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SnackbarProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);