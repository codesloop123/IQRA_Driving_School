import React from "react";
import BranchesTable from "components/Cards/BranchesTable";
export default function Branches() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <BranchesTable title="Branches" />
        </div>
      </div>
    </>
  );
}
