import nc from "next-connect";
import db from "../../../../utils/db";
import { isAuth } from "../../../../utils/auth";
import { onError, isAdmin } from "../../../../utils/error";
import { Product } from "../../../../models/Product";

const handler = nc({ onError });
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find();
  await db.disconnect();
  res.send(products);
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
