import React from "react";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
export default function Admin(props) {
  const { uid } = useSelector((state) => state.auth);
  const history = useHistory();
  useEffect(() => {
    if (uid==='') {
      history.push("/login");
    }
  }, [uid]);
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar routeName={props.routeName} />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          {props.children}
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
