export const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('/');

  const formattedMonth = month.padStart(2, '0');
  const formattedDay = day.padStart(2, '0');
  
  return `${year}/${formattedMonth}/${formattedDay}`;
};