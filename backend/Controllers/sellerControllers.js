import { prisma } from "../lib/prisma.js";

export const addBook = async (req, res) => {
  try {
    const user = req.user; 
    

    const { title, description, price, stock } = req.body;
    const fileUrl = req.file?.path || null;

    const book = await prisma.book.create({
      data: {
        sellerId: user.id,
        title,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl: fileUrl,
      },
    });

    res.status(201).json({ success: true, book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyBooks = async (req, res) => {
  try {
    const user = req.user;

   

    const books = await prisma.book.findMany({
      where: { sellerId: user.id },
      include: { seller: true },
    });


    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const allOrders = async (req, res) => {
  try {
    const user = req.user;
    const orders = await prisma.order.findMany({
      where: { sellerId: user.id },
      include: { book: true, buyer: true },
    });


    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const updateOrderStatus = async (req, res) => {
  try {
    const user = req.user;
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "shipped", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    const updatedOrder = await prisma.order.updateMany({
      where: {
        id: parseInt(orderId),
        sellerId: user.id, 
      },
      data: { status },
    });

    if (updatedOrder.count === 0) {
      return res.status(404).json({ success: false, error: "Order not found or not authorized" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};