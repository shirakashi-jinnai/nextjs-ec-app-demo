import nc from "next-connect";
import Order from "../../../models/Order";
import db from "../../../utils/db";
import { Product } from "../../../models/Product";
import User from "../../../models/User";
import { isAuth } from "../../../utils/auth";
import { onError, isAdmin } from "../../../utils/error";

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.find().select("_id").populate("_id");
  const orders = await Order.find().populate("user", "name"); //({ path: "user", select: "email" })と同義;

  //aggregateはfindのパイプラインとは別のパイプラインで検索、集計することが可能（lean同様、純粋なjavascriptとしてリターンされる）
  const orderPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: "$itemsPrice" }, //売上高
      },
    },
  ]);
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);
  const productsData = await Product.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      },
    },
  ]);

  await db.disconnect();

  res.send({ orders });
});

handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: "サンプル",
    slug: "sample-slug-" + Math.random(),
    category: "sample",
    image: "/images/shirt1.jpg",
    price: 50,
    brand: "JIN",
    rating: 3,
    numReviews: 0,
    countInStock: 20,
    description: "サンプル ですよ",
  });
  const product = await newProduct.save();
  await db.disconnect();

  res.send({ message: "Product Created", product });
});

export default handler;
