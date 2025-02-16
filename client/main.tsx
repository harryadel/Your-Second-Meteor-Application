import React from "react";
import { createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import { App } from "/imports/ui/App";
import { colorsTuple, createTheme } from "@mantine/core";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import '/imports/api/methods/products';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, //No retries if errors
      refetchOnWindowFocus: false, // default: true
    },
  },
});

const theme = createTheme({
  /** Put your mantine theme override here */
  colors: {
    disabledGrey: colorsTuple("#f7f8f9"),
    red: colorsTuple("#d80000"),
    green: colorsTuple("#34D399"),
    customYellow: colorsTuple("#f59e0b"),
    lightGray: colorsTuple("#f7f8f9"),
    customDimmed: colorsTuple("#64748B"),
    badge: colorsTuple("#f1f3f5"),
    badgeInnerText: colorsTuple("#212529"),
    checkboxLabel: colorsTuple("#4b5768"),
    selectPlaceholder: colorsTuple("#acb5bd"),
    ghostWhite: colorsTuple("#e7eaee"),
  },
});

Meteor.startup(() => {
  const container = document.getElementById("react-target");
  const root = createRoot(container!);
  root.render(
    <MantineProvider theme={theme} defaultColorScheme="light">
      <QueryClientProvider client={queryClient}>
        <Notifications />
        <App />
      </QueryClientProvider>
    </MantineProvider>
  );
});
