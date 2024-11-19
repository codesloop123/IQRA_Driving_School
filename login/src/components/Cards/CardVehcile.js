import React, { useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { postVehicle } from "store/vehicle/actions";
import { Spinner } from "reactstrap";
// components

export default function CardVehicle() {
  const dispatch = useDispatch();
  const { isVehicleLoading } = useSelector((state) => state.vehicle);
  const { branches } = useSelector((state) => state.branch);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    branch: null,
    type: "",
  });
  console.log(formData, "formData>>>>>>>>>>>");
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "branch") {
      setFormData({
        ...formData,
        branch: JSON.parse(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const history = useHistory();
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(postVehicle({ formData })).then(() => {
      setFormData({
        name: "",
        number: "",
        branch: null,
        type: "",
      });
    });
  };
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="flex items-center ">
            <IoArrowBackOutline
              onClick={() => history.push("/vehicles")}
              className="w-5 h-5 font-bold text-lightBlue-600 mr-2 cursor-pointer"
            />
            <h6 className="text-blueGray-700 text-xl font-bold">Add Vehicle</h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap mt-6">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter vehicle name"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="vehicle-number"
                  >
                    Number
                  </label>
                  <input
                    id="vehicle-number"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter vehicle number"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="branch-select"
                  >
                    Branch
                  </label>
                  <select
                    id="branch-select"
                    name="branch"
                    value={JSON.stringify(formData.branch) || ""}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                  >
                    <option value="" disabled>
                      Select Branch
                    </option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={JSON.stringify(branch)}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="vehicle-select"
                  >
                    Type
                  </label>
                  <select
                    id="vehicle-select"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none  w-full ease-linear transition-all duration-150"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="Auto">Auto</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center px-4 py-3">
              <button
                disabled={isVehicleLoading}
                type="submit"
                class="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
              >
                {isVehicleLoading ? (
                  <Spinner color="lightBlue-600" size="xl" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
