import nc from "next-connect";
import { Product } from "../../../models/Product";
import db from "../../../utils/db";

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: "Sup Shirs",
    slug: "sup-shirt",
    category: "Shirts",
    image: "/images/shirt1.jpg",
    price: 7000,
    brand: "しゅぷりーむ",
    rating: 4.5,
    numReviews: 10,
    countInStock: 20,
    description: "A popular shirt",
  });
  const product = await newProduct.save();
  await db.disconnect();

  res.send({ message: "新規登録が完了しました", product });
});

export default handler;
