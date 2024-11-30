import React from "react";
import AdminNavbar from "../../components/Navbars/AdminNavbar";
import HeaderStats from "components/Headers/HeaderStats";
import FooterAdmin from "components/Footers/FooterAdmin";
import AdmissionCard from "components/Cards/AdmissionCard";
export default function Admissions({ routeName }) {
  return (
    <>
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar routeName={routeName} />
        {/* <HeaderStats /> */}
        <div className="relative bg-lightBlue-600 md:pt-10 pb-32 pt-12"></div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
              <AdmissionCard />
            </div>
          </div>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
