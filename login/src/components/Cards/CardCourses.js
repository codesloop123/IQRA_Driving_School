import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles } from "store/vehicle/actions";
import { FaX } from "react-icons/fa6";
import { registerUser } from "store/auth/actions";
import { duration } from "moment";
// components

export default function CardCourses() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { vehicles } = useSelector((state) => state.vehicle);
  const { registerLoading } = useSelector((state) => state.auth);
  const [pricePackage, setPricePackage] = useState({ days: 0, price: 0 });
  const [formData, setFormData] = useState({
    name: "",
    vehicle: "",
    duration: "",
    pricelist: [],
  });

  const [error, setError] = useState(false);
  console.log(formData);
  const handleInputDays = (event) => {
    if (event.target.value <= 0) {
      setError(true);
      return;
    }
    setError(false);
    setPricePackage((state) => ({ ...state, days: event.target.value }));
  };

  const handleInputPrice = (event) => {
    if (event.target.value <= 0) {
      setError(true);
      return;
    }
    setError(false);
    setPricePackage((state) => ({ ...state, price: event.target.value }));
  };
  const handledelete = (index) => {
    setFormData((state) => ({
      ...state,
      pricelist: state.pricelist.filter((_, idx) => idx !== index),
    }));
  };
  const handleAddition = () => {
    setFormData((prevState) => ({
      ...prevState,
      pricelist: [...prevState.pricelist, pricePackage],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(name, value);

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // dispatch(registerUser({ formData })).then(() => {
    //   setFormData({
    //     name: "",
    //     vehicle: "",
    //     duration: "",
    //     pricelist: [],
    //   });
    // });
    console.log(formData);
  };
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="flex items-center ">
            <IoArrowBackOutline
              onClick={() => history.push("/courses")}
              className="w-5 h-5 font-bold text-lightBlue-600 mr-2 cursor-pointer"
            />
            <h6 className="text-blueGray-700 text-xl font-bold">Add Course</h6>
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
                    id="name"
                    type="text"
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                    placeholder="Enter course name"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none  w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="vehicle-select"
                  >
                    Vehicle
                  </label>
                  <select
                    id="vehicle-select"
                    name="vehicle"
                    className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150"
                    onChange={handleChange}
                    value={formData.vehicle || ""}
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.name}>
                        {vehicle.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="duration"
                  >
                    Duration
                  </label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    onChange={handleChange}
                    value={formData.duration}
                    placeholder="Enter Duration"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none  w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="price-select"
                  >
                    Price Packages
                  </label>
                  <div className="flex flex-row justify-between">
                    <input
                      style={{ width: "30%" }}
                      id="price-select"
                      type="number"
                      name="days"
                      placeholder="Enter Days"
                      onChange={handleInputDays}
                      className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none  w-full ease-linear transition-all duration-150
                      `}
                    />
                    <input
                      style={{ width: "30%" }}
                      id="price-select"
                      type="number"
                      name="price"
                      onChange={handleInputPrice}
                      placeholder="Enter Price"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none  w-full ease-linear transition-all duration-150"
                    />
                    <button
                      type="button"
                      class="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
                      onClick={handleAddition}
                      disabled={error}
                    >
                      Add
                    </button>
                  </div>
                  {error && (
                    <p
                      style={{
                        color: "#cf2b02",
                        fontSize: "12px",
                        fontStyle: "italic",
                        margin: "4px 0",
                      }}
                    >
                      Days and Price can't be less than 1
                    </p>
                  )}
                </div>
                {formData.pricelist.map((item, idx) => (
                  <span
                    style={{ borderColor: "rgb(2 132 199)", margin: "2px" }}
                    className="inline-block border border-blue-50 rounded-full py-1 px-3  bg-white"
                  >
                    <div className="flex p-0 m-0">
                      <p
                        style={{ fontStyle: "italic" }}
                        className="p-0 pb-1 m-0 inline-block italic text-sm border-solid"
                      >
                        {item.days}, {item.price}
                      </p>
                      <button
                        type="button"
                        className="self-center ml-2"
                        onClick={handledelete.bind(null, idx)}
                      >
                        <FaX style={{ color: "rgb(2 132 199)" }} />
                      </button>
                    </div>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-end items-center px-4 py-3">
              <button
                type="submit"
                disabled={registerLoading}
                class="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
                onClick={handleSubmit}
              >
                {registerLoading ? (
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray animate-spin dark:text-gray fill-white "
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
