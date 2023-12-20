export const formatLocalDate = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const year = date.getFullYear().toString().slice(-2);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}
