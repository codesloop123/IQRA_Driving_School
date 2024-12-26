import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Dialog,
} from "@headlessui/react";

import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import Table from "components/Utils/Table";
// import { fetchBranches } from "store/branch/actions";
// import { fetchCourses } from "store/courses/actions";

export default function CourseTable({ color, title }) {
  //   const dispatch = useDispatch();
  const history = useHistory();

  const iscourseLoading = false;
  const courses = [
    {
      name: "Beginner Driving Course",
      duration: "2 weeks",
      vehicle: "Car",
      status: true,
    },
    {
      name: "Intermediate Driving Course",
      duration: "1 month",
      vehicle: "Car",
      status: false,
    },
    {
      name: "Advanced Driving Course",
      duration: "6 weeks",
      vehicle: "Car",
      status: true,
    },
    {
      name: "Motorcycle Basics",
      duration: "1 week",
      vehicle: "Motorcycle",
      status: true,
    },
    {
      name: "Heavy Vehicle Training",
      duration: "3 months",
      vehicle: "Truck",
      status: false,
    },
    {
      name: "Bus Driving Course",
      duration: "2 months",
      vehicle: "Bus",
      status: true,
    },
  ];

  //   const { iscourseLoading, courses } = useSelector((state) => state.course);
  //   useEffect(() => {
  //     dispatch(fetchCourses());
  //   }, []);
  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-2  py-3 border-0">
          <div className="flex flex-wrap justify-between items-center">
            <div className="relative w-full pl-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                {title}
              </h3>
            </div>
            <div className="mr-3">
              <button
                onClick={() => history.push("/add-course")}
                class="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
              >
                Add
              </button>
            </div>
            {/* <Menu as="div" className="relative inline-block text-left pr-4">
              <div>
                <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-lightBlue-600">
                  {branches[idx]?.name}
                  <IoIosArrowDown aria-hidden="true" className="mt-1 ml-1" />
                </MenuButton>
              </div>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 mr-4 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <div className="py-1">
                  {branches.map((branch, idx) => (
                    <MenuItem key={idx}>
                      <button
                        onClick={handleClick.bind(null, idx)}
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        {branch?.name}
                      </button>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu> */}
          </div>
        </div>

        {/* <Dialog open={isModalOpen} onClose={closeModal}>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <Dialog.Panel
              style={{ width: "30vw", minWidth: "250px" }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Update Price</h2>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="pricePaid"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price Paid
                  </label>
                  <input
                    type="number"
                    id="pricePaid"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="mt-2 block w-full border border-gray-300 rounded-md p-2 "
                    required
                  />
                  {(0 > inputValue ||
                    courses[selectedRow]?.remainingPayment < inputValue) && (
                    <p style={{ color: "#cf2b02" }}>
                      Price can not be greater than
                      {` ${courses[selectedRow]?.remainingPayment} `}
                      or less than 0
                    </p>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
                    disabled={
                      0 > inputValue ||
                      courses[selectedRow]?.remainingPayment < inputValue
                    }
                  >
                    Submit
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog> */}
        {iscourseLoading ? (
          <div className="flex justify-center items-center py-10">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray animate-spin dark:text-gray fill-lightBlue-600 "
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : (
          <div className="block w-full overflow-x-auto">
            {courses?.length > 0 && (
              <Table
                headings={["NAME", "DURATION", "VEHICLE", "ACTION"]}
                color={color}
              >
                {courses.map((course, index) => (
                  <tr key={index}>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {course?.name}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {course?.duration}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {course?.vehicle}
                    </td>

                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <button
                        className={`py-2 px-4 rounded text-white font-bold mr-1
                      bg-red-400  
                      `}
                      >
                        Delete
                      </button>
                      {course.status ? (
                        <button
                          className={`py-2 px-4 rounded text-white font-bold
                      bg-red-400  
                      `}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className={`py-2 px-4 rounded text-white font-bold
                    bg-emerald-400  
                    `}
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </Table>
            )}
            {courses?.length === 0 && (
              <p
                style={{ fontStyle: "italic" }}
                className="text-gray-400 text-center py-4"
              >
                No courses Available
              </p>
            )}
          </div>
        )}
      </div>
      {/* <div className="flex justify-between items-center">
        <div className={idx > 0 ? "block" : "w-[100px]"}>
          {idx > 0 && (
            <button
              onClick={navigateButtonHandler.bind(null, "DECREMENT")}
              class="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
            >
              Prev Branch
            </button>
          )}
        </div>
        {idx < branches?.length - 1 && (
          <button
            onClick={navigateButtonHandler.bind(null, "INCREMENT")}
            className="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
          >
            Next Branch
          </button>
        )}
      </div> */}
    </>
  );
}

CourseTable.defaultProps = {
  color: "light",
};

CourseTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
