import { prisma } from "../lib/prisma.js";

export const addToCart = async (req, res) => {
  try {
    const user = req.user; 
    const { bookId, quantity } = req.body;

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return res.status(404).json({ msg: "Book not found" });

    const existingCart = await prisma.cart.findFirst({
      where: { buyerId: user.id, bookId },
    });

    let cartItem;
    if (existingCart) {
      cartItem = await prisma.cart.update({
        where: { id: existingCart.id },
        data: { quantity: existingCart.quantity + (quantity || 1) },
      });
    } else {
      cartItem = await prisma.cart.create({
        data: {
          buyerId: user.id,
          bookId,
          quantity: quantity || 1,
        },
      });
    }

    res.json({ success: true, cartItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      include: { seller: true },
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCartBooks = async (req, res) => {
  try {
    const user = req.user;

    const cartItems = await prisma.cart.findMany({
      where: { buyerId: user.id },
      include: { book: true },
    });

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const user = req.user;

    const cartItems = await prisma.cart.findMany({
      where: { buyerId: user.id },
      include: { book: true },
    });

    if (cartItems.length === 0)
      return res.status(400).json({ msg: "Cart is empty" });

    const orders = [];

    for (let item of cartItems) {
      const order = await prisma.order.create({
        data: {
          buyerId: user.id,
          sellerId: item.book.sellerId,
          bookId: item.bookId,
          status: "pending",
        },
      });

      await prisma.book.update({
        where: { id: item.bookId },
        data: { stock: item.book.stock - item.quantity },
      });

      orders.push(order);
    }

    await prisma.cart.deleteMany({ where: { buyerId: user.id } });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const myOrder = async (req, res) => {
  try {

    const user = req.user;

    const orders = await prisma.order.findMany({
      where: { buyerId: user.id },
      include: { book: true, seller: true },
    });


    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
