import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaX } from "react-icons/fa6";
import { postCourse } from "store/courses/actions";
// components

export default function CardCourses() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { vehicles } = useSelector((state) => state.vehicle);

  const [pricePackage, setPricePackage] = useState({ days: null, price: null });
  const [formData, setFormData] = useState({
    name: "",
    vehicle: "",
    duration: "",
    pricelist: [],
  });

  const handledelete = (index) => {
    setFormData((state) => ({
      ...state,
      pricelist: state.pricelist.filter((_, idx) => idx !== index),
    }));
  };
  const handleAddition = () => {
    if (!pricePackage.days || !pricePackage.price) return;
    setFormData((prevState) => ({
      ...prevState,
      pricelist: [...prevState.pricelist, pricePackage],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(postCourse(formData)).then(() => {
      setFormData({
        name: "",
        vehicle: "",
        duration: "",
        pricelist: [],
      });
      setPricePackage({ days: "", price: "" });
    });
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
                    type="number"
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
                      value={pricePackage.days}
                      onChange={(e) =>
                        setPricePackage((pricePackage) => ({
                          ...pricePackage,
                          days: e.target.value,
                        }))
                      }
                      className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none  w-full ease-linear transition-all duration-150
                      `}
                    />
                    <input
                      style={{ width: "30%" }}
                      id="price-select"
                      type="number"
                      name="price"
                      placeholder="Enter Price"
                      value={pricePackage.price}
                      onChange={(e) =>
                        setPricePackage((pricePackage) => ({
                          ...pricePackage,
                          price: e.target.value,
                        }))
                      }
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none  w-full ease-linear transition-all duration-150"
                    />
                    <button
                      type="button"
                      class="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
                      onClick={handleAddition}
                    >
                      Add
                    </button>
                  </div>
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
                class="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
