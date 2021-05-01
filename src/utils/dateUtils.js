export function convertDateToYearMonthDayString(date)
{
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}