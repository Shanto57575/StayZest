export const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const month = monthNames[date.getUTCMonth()];
    const day = date.getUTCDate();
    return `${month} ${day}`;
};

export const convertToMDY = (date) => {
    const newDate = new Date(date);

    const options = { year: 'numeric', month: 'short', day: 'numeric' };

    const dateFormatted = newDate.toLocaleDateString('en-US', options);

    return dateFormatted;
};

