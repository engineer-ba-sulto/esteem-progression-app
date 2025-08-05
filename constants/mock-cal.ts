export const completedDates = [
  new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  new Date(new Date().getFullYear(), new Date().getMonth(), 2),
  new Date(new Date().getFullYear(), new Date().getMonth(), 5),
  new Date(new Date().getFullYear(), new Date().getMonth(), 8),
  new Date(new Date().getFullYear(), new Date().getMonth(), 9),
  new Date(new Date().getFullYear(), new Date().getMonth(), 10),
  new Date(new Date().getFullYear(), new Date().getMonth(), 15),
  new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  ), // today
  new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 1
  ), // yesterday
  new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 3
  ),
];
