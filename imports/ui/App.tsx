import React from "react";

import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "mantine-datatable/dist/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Login } from "@pages";
import AdminLayout from "./layouts/AdminLayout";
import { Meteor } from "meteor/meteor";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";

export const App = () => (
  <Router
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <QueryParamProvider adapter={ReactRouter6Adapter}>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoutes>
              <AdminLayout />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </QueryParamProvider>
  </Router>
);

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/login" />;
  }

  return isLogged ? children : <Navigate to="/notauthorized" />;
};
