let Expenses = [
    {
        item: "Samosa",
        price: 15,
        date: new Date().getTime(),
        paid: 1,
    },
    {
        item: "momo",
        price: 16,
        date: new Date().getTime(),
        paid: 0,
    },
];
module.exports.Expenses = Expenses;
module.exports.insertData = function insertData(itemName, itemPrice, date, paidStatus) {
    Expenses.push({
        item: itemName,
        price: itemPrice,
        date: date,
        paid: paidStatus,
    });
};
