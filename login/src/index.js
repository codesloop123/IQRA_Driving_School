import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import routes from "routes/index";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";
import { Switch } from "react-router-dom/cjs/react-router-dom";
import Providers from "store/Providers";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Providers>
    <BrowserRouter>
      <ToastContainer />
      <Switch>
        {routes.map((route, index) => {
          switch (route.layout) {
            case "admin":
              return (
                <Route
                  exact
                  path={route.path}
                  key={index}
                  render={() => (
                    <Admin routeName={route.name}>
                      <route.component />
                    </Admin>
                  )}
                />
              );
            case "auth":
              return (
                <Route
                  exact
                  path={route.path}
                  key={index}
                  render={() => (
                    <Auth>
                      <route.component />
                    </Auth>
                  )}
                />
              );
            default:
              return null;
          }
        })}
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  </Providers>
);
