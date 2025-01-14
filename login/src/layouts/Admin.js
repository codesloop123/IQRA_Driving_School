import React from "react";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { fetchBranches } from "store/branch/actions";
import { fetchAllInstructors } from "store/instructor/action";
import { fetchVehicles } from "store/vehicle/actions";
import { fetchUsers } from "store/auth/actions";
import { fetchNotifications } from "store/notifications/actions";
import { fetchInstructors } from "store/instructor/action";
export default function Admin(props) {
  const { uid } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    if (!uid) {
      history.push("/login");
    }
  }, []);
  console.log(props);
  useEffect(() => {
    dispatch(fetchBranches());
    if (!user?.branch) dispatch(fetchAllInstructors());
    else {
      dispatch(fetchInstructors(user?.branch?._id));
    }
    dispatch(fetchVehicles());
    dispatch(fetchUsers());
  }, []);
  return (
    <>
      <Sidebar />
      {/* {props.children} */}
      {React.Children.map(props.children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { routeName: props.routeName })
          : child
      )}
      {/* <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar routeName={props.routeName} />
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          {props.children}
          <FooterAdmin />
        </div>
      </div>  */}
    </>
  );
}
