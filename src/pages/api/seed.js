import nc from "next-connect";
import { Product, Test } from "../../models/Product";
import User from "../../models/User";
import db from "../../utils/db";
import data from "../../utils/data";

const handler = nc();

// mongodbにデータをinsertしている
handler.get(async (req, res) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Product.deleteMany();
  const test = await Test.deleteMany();
  await Product.insertMany(data.products);
  await Test.insertMany(data.tests);
  await db.disconnect();
  res.send({
    message: "seeded successfully",
    count: test.deletedCount,
  });
});

//export しないとエラーが出てしまう
export default handler;
