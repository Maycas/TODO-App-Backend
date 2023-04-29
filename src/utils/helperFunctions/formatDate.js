const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // add leading zero if necessary
    const day = String(date.getDate()).padStart(2, '0'); // add leading zero if necessary
    const hours = String(date.getHours()).padStart(2, '0'); // add leading zero if necessary
    const minutes = String(date.getMinutes()).padStart(2, '0'); // add leading zero if necessary
    const seconds = String(date.getSeconds()).padStart(2, '0'); // add leading zero if necessary

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = { formatDate }