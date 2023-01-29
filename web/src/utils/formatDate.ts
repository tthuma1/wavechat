export const formatDate = (inDate: Date) => {
  const fulldays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dt = new Date(inDate),
    date = dt.getDate(),
    month = months[dt.getMonth()],
    timeDiff = inDate.valueOf() - Date.now(),
    diffDays = new Date().getDate() - date,
    diffMonths = new Date().getMonth() - dt.getMonth(),
    diffYears = new Date().getFullYear() - dt.getFullYear(),
    hours = inDate.getHours().toString().padStart(2, "0"),
    minutes = inDate.getMinutes().toString().padStart(2, "0");

  if (diffYears === 0 && diffDays === 0 && diffMonths === 0) {
    return "Today at " + hours + ":" + minutes;
  } else if (diffYears === 0 && diffDays === 1) {
    return "Yesterday at " + hours + ":" + minutes;
  } else if (diffYears === 0 && diffDays === -1) {
    return "Tomorrow at " + hours + ":" + minutes;
  } else if (diffYears === 0 && diffDays > 1 && diffDays < 7) {
    return fulldays[dt.getDay()] + " at " + hours + ":" + minutes;
  } else if (diffYears >= 1) {
    return (
      date +
      " " +
      month +
      " " +
      new Date(inDate).getFullYear() +
      " at " +
      hours +
      ":" +
      minutes
    );
  } else {
    return date + " " + month + " at " + hours + ":" + minutes;
  }
};

// formatDate(Date.now()) //"Today"
// formatDate(Date.now() - 86400000) // "Yesterday"
// formatDate(Date.now() - 172800000) // it will return the name of the week if it is beyond two days
