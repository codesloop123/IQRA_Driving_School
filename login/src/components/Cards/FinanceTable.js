import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { fetchFinances } from "store/admission/actions";
import { useEffect, useState } from "react";
import { fetchBranches } from "store/branch/actions";
import { setFinancesByDate } from "store/admission/admissionSlice";
import { toast } from "react-toastify";

export default function FinanceTable({ color, title }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { registerLoading, finances, financesByDate } = useSelector((state) => state.finance);
  const { branches } = useSelector((state) => state.branch);
  const [sortByProperty, setSortByProperty] = useState({
    key: null,
    direction: null
  });

  const [totalPayment,SetTotalPayment] = useState({ paymentReceived: 0, totalPayment: 0,remainingPayment:0 });
  useEffect(()=>{
    if (finances)
    {
      const totalPayments = finances.reduce(
        (acc, curr) => {
          console.log("Here is ",curr)
          acc.paymentReceived += curr.paymentDetails.paymentReceived || 0; // Add receivedPayment
          acc.remainingPayment += curr.paymentDetails.remainingPayment || 0; // Add receivedPayment
          acc.totalPayment += curr.paymentDetails.totalPayment || 0; // Add receivedPayment
          return acc;
        },
        { paymentReceived: 0, totalPayment: 0,remainingPayment:0 } // Initial accumulator values
      );
      SetTotalPayment(totalPayments);
    }
    },[finances])
    console.log(totalPayment)

  useEffect(() => {
    if (!financesByDate) {
      dispatch(fetchFinances({}));
    }
    dispatch(fetchBranches());
  }, []);
  const handleSortByBranch = async (e) => {
    dispatch(fetchFinances({ id: e.target.value }));
  }
  // updates the sortByProperty 
  const handleSort = (column) => {
    if (sortByProperty.key === column) {
      setSortByProperty({
        key: column,
        direction: sortByProperty.direction === 'ascending' ? 'descending' : 'ascending',
      })
    }
    else {
      setSortByProperty({
        key: column,
        direction: 'descending'
      })
    }
  }
  const sortedFinances = [...finances].sort((a, b) => {
    if (sortByProperty.key === null) return 0;

    const aValue = a.paymentDetails[sortByProperty.key];
    const bValue = b.paymentDetails[sortByProperty.key];

    if (sortByProperty.direction === 'ascending') {
      return aValue - bValue;
    }
    else if (sortByProperty.direction === 'descending') {
      return bValue - aValue;
    }
    return 0;
  })
  //function to handle sort by date button
  const handleSortByDateButton = () => {
    dispatch(setFinancesByDate(false)); // if user after sorting one time, again tries to click sortbydate btn
    history.push("/sort-finances-by-date");
  }







  const downloadCSV = () => {
    if (!sortedFinances || sortedFinances.length === 0) {
      toast.error("Internet Error");
      return;
    }
    const headers = [
      "First Name",
      "Father Name",
      "Date Registered",
      "Payment Received",
      "Remaining Payment",
      "Total Payment",
      "Payment Method",
    ];

    const rows = sortedFinances.map((finance) => [
      finance?.firstName || "",
      finance?.fatherName || "",
      finance?.dateRegistered || "",
      finance?.paymentDetails?.paymentReceived || "",
      finance?.paymentDetails?.remainingPayment || "",
      finance?.paymentDetails?.totalPayment || "",
      finance?.paymentDetails?.paymentMethod || "",
    ]);


    const csvContent = [
      headers.join(","), 
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "finance_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };








  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 py-3 px-2 border-0">
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

            <div className="p-3">
              <button
                onClick={() => {downloadCSV()}}
                className="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
              >Download CSV</button>
            </div>


            <div className="mr-3">
              <select onChange={(e) => handleSortByBranch(e)}>
                <option disabled selected>Select branch</option>
                <option value={'All'}>All</option>
                {branches.map((ele, ind) => {
                  return (
                    <option key={ind} value={ele._id}>{ele.name}</option>
                  );
                })}
              </select>
            </div>
            <div className="mr-3">
              <button
                onClick={() => handleSortByDateButton()}
                className="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
              >Sort by date</button>
            </div>
          </div>
        </div>
        {registerLoading ? (
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
            {/* Finances table */}
            <table className="items-center w-full bg-transparent border-collapse">
              <thead>
                <tr>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    First Name
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Father Name
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Date Registered
                  </th>
                  <th
                    className={
                      "flex items-center px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Payment Received
                    <i onClick={() => handleSort("paymentReceived")}
                      className="fas fa-solid fa-caret-down ml-1 cursor-pointer"
                    ></i>
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Remaining Payment
                    <i onClick={() => handleSort("remainingPayment")}
                      className="fas fa-solid fa-caret-down ml-1 cursor-pointer text-green-500"
                    ></i>
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Total Payment
                    <i onClick={() => handleSort("totalPayment")}
                      className="fas fa-solid fa-caret-down ml-1 cursor-pointer text-green-500"
                    ></i>
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Payment Method
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedFinances?.length > 0 &&
                  sortedFinances.map((finance, index) => (
                    <tr key={index}>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {finance?.firstName}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {finance?.fatherName}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {finance?.dateRegistered}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {finance?.paymentDetails.paymentReceived}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {finance?.paymentDetails.remainingPayment}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {finance?.paymentDetails.totalPayment}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {finance?.paymentDetails.paymentMethod}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="relative w-full p-4 max-w-full">
              <h3
                className={
                  "font-semibold" +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                Received Payment: {totalPayment.paymentReceived}
              </h3>
            </div>

            
            {/* <br/> */}
            <div className="relative w-full p-4 max-w-full ">
              <h3
                className={
                  "font-semibold" +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                Total Payment: {totalPayment.totalPayment}
              </h3>
            </div>

            
            {/* <br/> */}
            <div className="relative w-full p-4 max-w-full">
              <h3
                className={
                  "font-semibold" +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                Remaining Payment: {totalPayment.remainingPayment}
              </h3>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

FinanceTable.defaultProps = {
  color: "light",
};

FinanceTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
