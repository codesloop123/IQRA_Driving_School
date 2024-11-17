import React from "react";
import ManagersTable from "components/Cards/ManagersTable";
export default function Managers() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <ManagersTable title="Managers" />
        </div>
      </div>
    </>
  );
}
