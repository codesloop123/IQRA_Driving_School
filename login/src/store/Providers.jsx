import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "./store";

let persistor = persistStore(store);

const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<p>Refresh Loading...</p>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
export default Providers;
