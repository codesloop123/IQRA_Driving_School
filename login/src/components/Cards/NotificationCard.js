import { useEffect} from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  mutateNotifications,
} from "store/notifications/actions";
export default function NotificationCard({ color, title }) {
  const { notifications } = useSelector(
    (state) => state.notification
  );
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleRemove = (id) => {
    toast.success("Notification Dismissed");
    dispatch(mutateNotifications(id));
  };
  useEffect(() => {
    dispatch(fetchNotifications(user.role));
  }, [dispatch,user.role]);
  const calculateDaysAgo = (date) => {
    if (!date) return 1;
    const currentDate = new Date();
    const notificationDate = new Date(date).toISOString().split("T")[0];
    const timeDiff = currentDate - notificationDate;
    const daysAgo = Math.floor(timeDiff / (1000 * 3600 * 24));
    return daysAgo > 0 ? daysAgo : 1; // Return at least 1 day ago if it's today
  };

  // Color mapping for border
  const colorMap = {
    false: "255, 0, 0", // Red
    true: "0, 255, 0", // Green
  };
  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-2 py-3 border-0">
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
          </div>
          <div className="">
            {notifications?.map((notification, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  minHeight: "50px",
                  padding: "10px",
                  borderLeft: `5px solid rgb(${colorMap[notification.status]})`,
                  borderBottom: "3px solid whitesmoke",
                }}
              >
                <div style={{ flex: 1 }}>
                  <p>{notification.message}</p>
                </div>
                <div
                  style={{
                    marginRight: "10px",
                    fontStyle: "italic",
                    fontSize: "12px",
                  }}
                >
                  <p>{calculateDaysAgo(notification.eventDate)} days ago</p>
                </div>
                <button onClick={() => handleRemove(notification._id)}>
                  {" "}
                  <span
                    style={{
                      cursor: "pointer",
                      fontSize: "32px",
                      color: "gray",
                      transition: "color 0.3s",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "black")}
                    onMouseLeave={(e) => (e.target.style.color = "gray")}
                  >
                    &times;
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

NotificationCard.defaultProps = {
  color: "light",
};

NotificationCard.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
