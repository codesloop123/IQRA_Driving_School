import React from "react";
import InstructorsTable from "components/Cards/InstructorsTable";
export default function Instructors() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <InstructorsTable title="Instructors"  />
        </div>
      </div>
    </>
  );
}
