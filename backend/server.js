import express from "express";
import cors from "cors";
import userRouter from "./Routes/userRoutes.js";
import buyerRouter from "./Routes/buyerRoutes.js";
import sellerRouter from "./Routes/sellerRoutes.js";



const app = express();


app.use(cors())
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/buyer", buyerRouter);


app.get("/", (req, res) => {
  res.send("Multi-Seller Bookstore API is running ");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




