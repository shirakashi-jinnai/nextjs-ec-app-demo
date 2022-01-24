import nc from "next-connect";
import db from "../../../../../utils/db";
import { isAuth } from "../../../../../utils/auth";
import { onError, isAdmin } from "../../../../../utils/error";
import { Product } from "../../../../../models/Product";

const handler = nc({ onError });
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

handler.put(async (req, res) => {
  await db.connect();
  const { name, slug, price, category, brand, countInStock, description } =
    req.body;
  const product = await Product.findById(req.query.id);

  if (product) {
    product.name = name;
    product.slug = slug;
    product.price = price;
    product.category = category;
    product.brand = brand;
    product.countInStock = countInStock;
    product.description = description;
    await product.save();
    await db.disconnect();
    res.send({ message: "商品の編集が完了しました。" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "商品が見つかりませんでした。" });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    product.remove();
    res.send({ message: "商品の削除が完了しました。" });
  } else {
    res.status(404).send({ message: "商品が見つかりませんでした。" });
  }

  await db.disconnect();
});

export default handler;
