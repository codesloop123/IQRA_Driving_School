import React from "react";
import CarsTable from "components/Cards/CarsTable";
export default function Cars() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CarsTable title="Vehicles" />
        </div>
      </div>
    </>
  );
}
