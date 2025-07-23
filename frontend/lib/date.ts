export const formatDate = (date: Date) => {
  const sessionDate = date instanceof Date ? date : new Date(date);
  return sessionDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (date: Date) => {
  const sessionDate = date instanceof Date ? date : new Date(date);
  return sessionDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
