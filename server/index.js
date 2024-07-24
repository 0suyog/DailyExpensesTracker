const express = require("express");
const { mongoose, MongooseError } = require("mongoose");
const cors = require("cors");
require("./db.connection.js");
require("dotenv").config();
const { User, Expense, Item } = require("./db.models.js");
const { Expenses, insertData } = require("./Data.js");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: "*",
    })
);

app.post("/register", async (req, res) => {
    const userDetails = req.body;
    bcrypt.hash(userDetails.password, 5, (err, hash) => {
        const user = new User({
            name: userDetails.userName,
            password: hash,
        });
        user.save()
            .then(() => {
                res.sendStatus(200);
            })
            .catch((err) => {
                if (err.code == 11000) {
                    res.sendStatus(409);
                }
            });
    });
});
app.post("/login", (req, res) => {
    const userDetails = req.body;
    console.log("sdlaf");
    User.find({ name: userDetails.userName })
        .exec()
        .then((data) => {
            if (data[0]) {
                bcrypt.compare(userDetails.password, data[0].password, (err, result) => {
                    if (err) {
                        console.log(err.message);
                        res.status(500).json({ error: "Tnternal server Error" });
                    } else {
                        if (result) {
                            res.status(200).json(data[0]._id);
                        } else {
                            res.sendStatus(401);
                        }
                    }
                });
            } else {
                res.status(401).json({ error: "User Not Found" });
            }
        })
        .catch((err) => {
            res.sendStatus(500);
        });
});

app.post("/item", (req, res) => {
    const receivedData = req.body;
    const item = new Item({
        item: receivedData.item,
        price: receivedData.price,
        user: receivedData.user,
    });
    item.save()
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            // err code 11000 from mongo is data already exists and isnt unique
            if (err.code == 11000) {
                res.status(409).json({ error: "Item Already Exists" });
            }
        });
});

app.post("/items", (req, res) => {
    const receivedData = req.body;
    Item.find({ user: new mongoose.Types.ObjectId(receivedData.user) })
        .select("item price _id")
        .exec()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.sendStatus(500);
        });
});

app.post("/initialData", (req, res) => {
    const user = req.body;
    Expense.aggregate([
        [
            {
                $match: {
                    user: new mongoose.Types.ObjectId(user.id),
                },
            },
            {
                $addFields: {
                    due: {
                        $subtract: [
                            {
                                $multiply: ["$quantity", "$ownPrice"],
                            },
                            "$partiallyPaid",
                        ],
                    },
                    total: {
                        $multiply: ["$quantity", "$ownPrice"],
                    },
                },
            },
            {
                $group: {
                    _id: "$item",
                    due: {
                        $sum: "$due",
                    },
                    total: {
                        $sum: "$total",
                    },
                },
            },
            {
                $lookup: {
                    from: "items",
                    localField: "_id",
                    foreignField: "_id",
                    as: "item",
                },
            },
            {
                $addFields: {
                    item: {
                        $let: {
                            vars: {
                                i: {
                                    $arrayElemAt: ["$item", 0],
                                },
                            },
                            in: "$$i.item",
                        },
                    },
                },
            },
            {
                $sort: { item: 1, _id: 1 },
            },
        ],
    ]).then((expenses) => {
        if (expenses.length > 0) {
            res.status(200).json(expenses);
        } else {
            res.sendStatus(404);
        }
        // console.log(expenses);
    });
});

app.post("/expenses", (req, res) => {
    const receivedData = req.body;
    Expense.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(receivedData.userId),
                item: new mongoose.Types.ObjectId(receivedData.itemId),
            },
        },
        {
            $lookup: {
                from: "items",
                localField: "item",
                foreignField: "_id",
                as: "item",
            },
        },
        {
            $addFields: {
                item: {
                    $let: {
                        vars: {
                            item: {
                                $arrayElemAt: ["$item", 0],
                            },
                        },
                        in: "$$item",
                    },
                },
            },
        },
        {
            $sort: {
                _id: 1,
            },
        },
    ])
        .then((expenses) => {
            res.status(200).json(expenses);
        })
        .catch((e) => {
            res.status(500).json(e.message);
        });
});

app.post("/expense", (req, res) => {
    const data = req.body;
    const expense = new Expense({
        item: data.itemName,
        ownPrice: data.itemPrice,
        date: data.date,
        paid: data.paidStatus,
        quantity: data.quantity,
        user: data.user,
        partiallyPaid: data.paidStatus ? data.ownPrice * data.quantity : data.partiallyPaidPrice,
    });
    expense
        .save()
        .then((expense) => {
            if (data.changeAll) {
                Item.findByIdAndUpdate(data.itemName, { price: data.ownPrice })
                    .exec()
                    .then((item) => {
                        res.status(200).json(req.body);
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
            } else {
                res.status(200).json(req.body);
            }
        })
        .catch((err) => {
            console.log(err.message);
        });
});
app.post("/updateStatus", (req, res) => {
    const receivedData = req.body;
    Expense.updateMany(
        {
            user: new mongoose.Types.ObjectId(receivedData.userId),
            item: new mongoose.Types.ObjectId(receivedData.itemId),
        },

        [
            {
                $set: {
                    partiallyPaid: receivedData.status
                        ? { $multiply: ["$quantity", "$ownPrice"] }
                        : 0,
                    paid: receivedData.status,
                },
            },
        ]
    )
        .exec()
        .then((data) => {
            res.sendStatus(200);
        });
});

app.post("/updateStatusOfIndividualExpense", (req, res) => {
    const receivedData = req.body;
    Expense.findByIdAndUpdate(receivedData.id, {
        paid: receivedData.status,
        partiallyPaid: receivedData.status ? receivedData.totalPrice : 0,
    })
        .exec()
        .then((data) => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log(err.message);
            res.sendStatus(500);
        });
});
app.post("/deleteAllExpenseOfOneType", (req, res) => {
    const receivedData = req.body;
    Expense.deleteMany({
        item: new mongoose.Types.ObjectId(receivedData.itemId),
        user: new mongoose.Types.ObjectId(receivedData.userId),
    })
        .exec()
        .then(() => {
            res.status(200).json({ message: "Deleted Succesfully" });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post("/deleteIndividualExpense", (req, res) => {
    const receivedData = req.body;
    Expense.deleteOne({ _id: new mongoose.Types.ObjectId(receivedData.id) })
        .exec()
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log(err.message);
            res.sendStatus(500);
        });
});

app.post("/deleteItem", (req, res) => {
    const id = req.body.id;
    Item.findByIdAndDelete(id)
        .exec()
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            res.status(500).json(err.message);
        });
});
app.post("/payAllExpenses", (req, res) => {
    const receivedData = req.body;
    Expense.updateMany(
        {
            user: new mongoose.Types.ObjectId(receivedData.userId),
        },

        [
            {
                $set: {
                    partiallyPaid: { $multiply: ["$quantity", "$ownPrice"] },
                },
            },
        ]
    )
        .exec()
        .then((data) => {
            res.sendStatus(200);
        });
});
app.post("/unPayAllExpenses", (req, res) => {
    const receivedData = req.body;
    Expense.updateMany(
        {
            user: new mongoose.Types.ObjectId(receivedData.userId),
        },

        [
            {
                $set: {
                    partiallyPaid: 0,
                },
            },
        ]
    )
        .exec()
        .then((data) => {
            res.sendStatus(200);
        });
});
app.post("/deleteAllExpenses", (req, res) => {
    const receivedData = req.body;
    Expense.deleteMany({
        user: new mongoose.Types.ObjectId(receivedData.userId),
    })
        .exec()
        .then((data) => {
            res.sendStatus(200);
        });
});

app.post("/totalExpenseOfItems", (req, res) => {
    const receivedData = req.body;
    Expense.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(receivedData.userId),
            },
        },
        {
            $group: {
                _id: "$item",
                total: {
                    $sum: {
                        $multiply: ["$ownPrice", "$quantity"],
                    },
                },
            },
        },
        {
            $lookup: {
                from: "items",
                localField: "_id",
                foreignField: "_id",
                as: "item",
            },
        },
        {
            $addFields: {
                item: {
                    $let: {
                        vars: {
                            i: {
                                $arrayElemAt: ["$item", 0],
                            },
                        },
                        in: "$$i.item",
                    },
                },
            },
        },
        {
            $sort: {
                total: -1,
            },
        },
    ])
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json(err.message);
        });
});

app.post("/totalExpense", (req, res) => {
    const receivedData = req.body;
    console.log(receivedData);
    Expense.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(receivedData.userId),
            },
        },
        {
            $group: {
                _id: "$user",
                total: {
                    $sum: {
                        $multiply: ["$quantity", "$ownPrice"],
                    },
                },
                due: {
                    $sum: {
                        $subtract: [
                            {
                                $multiply: ["$quantity", "$ownPrice"],
                            },
                            "$partiallyPaid",
                        ],
                    },
                },
            },
        },
    ]).then((data) => {
        if (data.length == 0) {
            res.sendStatus(404);
        }

        res.status(200).json(data[0]);
    });
});

app.listen(3000, console.log("hello world"));
