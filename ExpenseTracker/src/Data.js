let Expenses = [
    {
        item: "Samosa",
        price: 15,
        date: new Date().getTime(),
        paid: false,
    },
    {
        item: "momo",
        price: 16,
        date: new Date().getTime(),
        paid: true,
    },
];
export function insertData(itemName, itemPrice, date, paidStatus) {
    Expenses.push({
        item: itemName,
        price: itemPrice,
        date: date,
        paid: paidStatus,
    });
}

export default Expenses;
