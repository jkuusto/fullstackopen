const Notification = ({ message, type = "success" }) => {
  const baseStyle = {
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const successStyle = {
    ...baseStyle,
    color: "green",
    borderColor: "green",
  };

  const errorStyle = {
    ...baseStyle,
    color: "red",
    borderColor: "red",
  };

  const notificationStyle = type === "error" ? errorStyle : successStyle;

  if (!message) {
    return null;
  }

  return (
    <section style={notificationStyle} className={`notification ${type}`}>
      {message}
    </section>
  );
};

export default Notification;
