import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdmissions } from "store/admission/actions";

export default function FinanceTable({ color, title }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { registerLoading, admissions } = useSelector((state) => state.admission);
    const [sortedData, setSortedData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        if (user?.branch?._id) {
            dispatch(fetchAdmissions(user.branch._id));
        }
    }, [user, dispatch]);

    useEffect(() => {
        // Initialize sortedData with admissions data from the store
        setSortedData(admissions || []);
    }, [admissions]);

    const sortTable = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sorted = [...sortedData].sort((a, b) => {
            if (["totalPayment", "paymentReceived", "remainingPayment"].includes(key)) {
                return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
            } else if (key === "firstName" || key === "lastName") {
                return direction === "asc"
                    ? a[key].localeCompare(b[key])
                    : b[key].localeCompare(a[key]);
            } else if (key === "startDate") {
                return direction === "asc"
                    ? new Date(a[key]) - new Date(b[key])
                    : new Date(b[key]) - new Date(a[key]);
            }
            return 0;
        });

        setSortedData(sorted);
        setSortConfig({ key, direction });
    };

    const handleDateFilter = () => {
        const filtered = (admissions || []).filter((item) => {
            const itemDate = new Date(item.startDate);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            return (!start || itemDate >= start) && (!end || itemDate <= end);
        });
        setSortedData(filtered);
    };

    const handleDownloadCSV = () => {
        const csvHeaders = "First Name,Last Name,Phone No,Start Date,Payment Method,Total Payment (Rs),Payment Received (Rs),Remaining Payment (Rs)\n";
        const csvRows = sortedData.map(
            ({ firstName, lastName, cellNumber, startDate, paymentMethod, totalPayment, paymentReceived, remainingPayment }) =>
                `${firstName},${lastName},${cellNumber},${moment(startDate).format("YYYY-MM-DD")},${paymentMethod},${totalPayment.toLocaleString("en-IN")},${paymentReceived.toLocaleString("en-IN")},${remainingPayment.toLocaleString("en-IN")}`
        );
        const csvContent = csvHeaders + csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "finance_table.csv");
    };

    // Calculate totals
    const totalAmountPaid = sortedData.reduce((acc, curr) => acc + (curr.paymentReceived || 0), 0);
    const totalAmountDue = sortedData.reduce((acc, curr) => acc + (curr.remainingPayment || 0), 0);
    const grandTotal = totalAmountPaid + totalAmountDue;

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-semibold text-lg text-blueGray-700">Finance Table</h3>
                <button
                    onClick={handleDownloadCSV}
                    className="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 rounded focus:outline-none"
                >
                    Download CSV
                </button>
            </div>
            <div className="p-4">
                <div className="flex flex-wrap justify-between mb-4">
                    <div className="w-full md:flex md:space-x-4">
                        <div className="md:w-1/2 lg:w-1/4 mb-4 md:mb-0">
                            <label className="block text-sm font-medium text-blueGray-600">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border-0 px-3 py-2 rounded w-full"
                            />
                        </div>
                        <div className="md:w-1/2 lg:w-1/4">
                            <label className="block text-sm font-medium text-blueGray-600">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border-0 px-3 py-2 rounded w-full"
                            />
                        </div>
                        <button
                            onClick={handleDateFilter}
                            className="bg-lightBlue-600 text-white text-md font-bold py-2 px-4 h-10 rounded focus:outline-none mt-2 md:mt-4"
                        >
                            Filter
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 cursor-pointer" onClick={() => sortTable("firstName")}>First Name</th>
                                <th className="px-4 py-2 cursor-pointer" onClick={() => sortTable("lastName")}>Last Name</th>
                                <th className="px-4 py-2">Reference No</th>
                                <th className="px-4 py-2 cursor-pointer" onClick={() => sortTable("startDate")}>Start Date</th>
                                <th className="px-4 py-2">Payment Method</th>
                                <th className="px-4 py-2 cursor-pointer" onClick={() => sortTable("totalPayment")}>Total Payment (Rs)</th>
                                <th className="px-4 py-2 cursor-pointer" onClick={() => sortTable("paymentReceived")}>Payment Received (Rs)</th>
                                <th className="px-4 py-2 cursor-pointer" onClick={() => sortTable("remainingPayment")}>Remaining Payment (Rs)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(sortedData || []).map((item, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2">{item.firstName}</td>
                                    <td className="px-4 py-2">{item.lastName}</td>
                                    <td className="px-4 py-2">{item.referenceNumber}</td>
                                    <td className="px-4 py-2">{moment(item.startDate).format("YYYY-MM-DD")}</td>
                                    <td className="px-4 py-2">{item.paymentMethod}</td>
                                    <td className="px-4 py-2">{item.totalPayment.toLocaleString("en-IN")}</td>
                                    <td className="px-4 py-2">{item.paymentReceived.toLocaleString("en-IN")}</td>
                                    <td className="px-4 py-2">{item.remainingPayment.toLocaleString("en-IN")}</td>
                                </tr>
                            ))}
                            <tr className="border-t font-bold">
                                <td colSpan="5" className="px-4 py-2 text-right">Total:</td>
                                <td className="px-4 py-2">{totalAmountPaid.toLocaleString("en-IN")}</td>
                                <td className="px-4 py-2">{totalAmountDue.toLocaleString("en-IN")}</td>
                                <td className="px-4 py-2">{grandTotal.toLocaleString("en-IN")}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
