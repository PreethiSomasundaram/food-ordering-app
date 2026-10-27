const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("public"));
let foods = [
    { id: 1, name: "Burger", price: 100 },
    { id: 2, name: "Pizza", price: 200 },
    { id: 3, name: "Sandwich", price: 80 }
];
let orders = [];
let nextFoodId = 4;
let nextOrderId = 1;
app.get("/foods", (req, res) => {
    res.json(foods);
});

app.post("/foods", (req, res) => {
    const { name, price } = req.body;

    if (typeof name !== "string" || !name.trim() ||
        price === undefined || !Number.isFinite(Number(price)) ||
        Number(price) < 0) {
        return res.status(400).json({ message: "Invalid food details" });
    }
    const food = {
        id: nextFoodId++,
        name: name.trim(),
        price: Number(price)
    };

    foods.push(food);
    res.status(201).json(food);
});

app.put("/foods/:id", (req, res) => {
    const food = foods.find(f => f.id === Number(req.params.id));

    if (!food) {
        return res.status(404).json({ message: "Food not found" });
    }

    const { name, price } = req.body;

    if (typeof name !== "string" || !name.trim() ||
        price === undefined || !Number.isFinite(Number(price)) ||
        Number(price) < 0) {
        return res.status(400).json({ message: "Invalid food details" });
    }

    food.name = name.trim();
    food.price = Number(price);

    res.json(food);
});
app.delete("/foods/:id", (req, res) => {
    const id = Number(req.params.id);
    const exists = foods.some(f => f.id === id);

    if (!exists) {
        return res.status(404).json({ message: "Food not found" });
    }

    foods = foods.filter(f => f.id !== id);
    res.json({ message: "Food deleted successfully" });
});
app.post("/orders", (req, res) => {
    const { customer, food } = req.body;

    if (typeof customer !== "string" || !customer.trim() ||
        typeof food !== "string" || !food.trim()) {
        return res.status(400).json({ message: "Invalid order details" });
    }

    const order = {
        id: nextOrderId++,
        customer: customer.trim(),
        food: food.trim()
    };

    orders.push(order);
    res.status(201).json(order);
});
app.get("/orders", (req, res) => {
    res.json(orders);
});
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});