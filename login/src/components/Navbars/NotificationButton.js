import { Menu } from "@headlessui/react";
const NotificationButton = ({ notifications }) => {
  const getColorClass = (color) => {
    switch (color) {
      case "danger":
        return "bg-red-100 text-red-700";
      case "success":
        return "bg-green-100 text-green-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="relative content-center px-2">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button className="text-white text-sm lg:inline-block font-semibold">
              Notifications
            </Menu.Button>

            <Menu.Items
              className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg"
              style={{ width: "400px" }}
            >
              {notifications.length === 0 ? (
                <div className="p-4 text-gray-500">No notifications</div>
              ) : (
                <ul>
                  {notifications.map((notification, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <li
                          className={`p-4 border-b last:border-none ${getColorClass(
                            notification.color
                          )} ${active ? "bg-gray-100" : ""}`}
                        >
                          <div className="font-semibold">
                            {notification.message}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(notification.date).toLocaleDateString()}
                          </div>
                        </li>
                      )}
                    </Menu.Item>
                  ))}
                </ul>
              )}
            </Menu.Items>
          </>
        )}
      </Menu>
    </div>
  );
};
export default NotificationButton;
