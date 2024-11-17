import React from "react";
import UsersTable from "components/Cards/UsersTable";

export default function Users() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <UsersTable title="Users" />
        </div>
      </div>
    </>
  );
}
