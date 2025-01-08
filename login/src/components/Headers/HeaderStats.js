import React from "react";
import CardStats from "components/Cards/CardStats.js";
import { useSelector } from "react-redux";
export default function HeaderStats() {
  const { users, user } = useSelector((state) => state.auth);
  const { instructors } = useSelector((state) => state.instructor);
  const { vehicles } = useSelector((state) => state.vehicle);
  const { branches } = useSelector((state) => state.branch);
  const branchvehicle =
    vehicles?.filter((vehicle) => vehicle?.branch?._id === user?.branch?._id) ||
    [];
  const branchInstructors =
    instructors?.filter(
      (instructor) => instructor?.branch?._id === user?.branch?._id
    ) || [];
  return (
    <>
      <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            <div className="flex flex-wrap">
              {user?.role === "admin" && (
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                  <CardStats
                    statSubtitle="Branches"
                    statTitle={`${branches?.length || 0}`}
                    statArrow="up"
                    statPercent="3.48"
                    statPercentColor="text-emerald-500"
                    statDescripiron="Since last month"
                    statIconName="fas fa-network-wired"
                    statIconColor="bg-red-500"
                  />
                </div>
              )}
              <div
                className={`${
                  user?.role === "admin"
                    ? "w-full lg:w-6/12 xl:w-3/12 px-4"
                    : "w-full lg:w-6/12 xl:w-6/12 px-4"
                }`}
              >
                <CardStats
                  statSubtitle="Instructors"
                  statTitle={
                    user?.role === "manager"
                      ? `${branchInstructors?.length || 0}`
                      : `${instructors?.length || 0 }`
                  }
                  statArrow="down"
                  statPercent="3.48"
                  statPercentColor="text-red-500"
                  statDescripiron="Since last week"
                  statIconName="fas fa-users"
                  statIconColor="bg-orange-500"
                />
              </div>
              {user?.role === "admin" && (
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                  <CardStats
                    statSubtitle="Managers"
                    statTitle={`${users?.length || 0}`}
                    statArrow="down"
                    statPercent="1.10"
                    statPercentColor="text-orange-500"
                    statDescripiron="Since yesterday"
                    statIconName="fas fa-users"
                    statIconColor="bg-pink-500"
                  />
                </div>
              )}

              <div
                className={`${
                  user?.role === "admin"
                    ? "w-full lg:w-6/12 xl:w-3/12 px-4"
                    : "w-full lg:w-6/12 xl:w-6/12 px-4"
                }`}
              >
                <CardStats
                  statSubtitle="Cars"
                  statTitle={
                    user?.role === "manager"
                      ? `${branchvehicle?.length || 0}`
                      : `${vehicles?.length || 0}`
                  }
                  statArrow="down"
                  statPercent="1.10"
                  statPercentColor="text-orange-500"
                  statDescripiron="Since yesterday"
                  statIconName="fas fa-car"
                  statIconColor="bg-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
