import nc from "next-connect";
import { Product } from "../../../models/Product";
import db from "../../../utils/db";

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  //   mongodb空データをとってきている？
  await Product.where({ name: "Free Shirs" }).update({
    $set: { brand: "JIN" },
  });
  const products = await Product.find();
  await db.disconnect();
  res.send(products, "aaa");
});

//export しないとエラーが出てしまう
export default handler;
