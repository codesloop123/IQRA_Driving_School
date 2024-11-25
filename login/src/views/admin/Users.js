import React from "react";
import UsersTable from "components/Cards/UsersTable";
import AdminNavbar from "../../components/Navbars/AdminNavbar";
import HeaderStats from "components/Headers/HeaderStats";
import FooterAdmin from "components/Footers/FooterAdmin";
import Example from "components/Modals/InstructorModal";
import { useState } from "react";
export default function Users({ routeName }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    console.log("inside handleOpen>>>>>>>>>>>>");
    setOpen(true);
  };
  return (
    <>
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar routeName={routeName} />
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
              <UsersTable title="Users" handleOpen={handleOpen} />
            </div>
          </div>
          <FooterAdmin />
        </div>
      </div>
      <Example open={open} setOpen={setOpen} />
    </>
  );
}
