import nc from "next-connect";
import Order from "../../../../models/Order";
import { isAuth } from "../../../../utils/auth";
import db from "../../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  console.log("query_id", req.query.id);
  const order = await Order.findById(req.query.id);
  console.log("order", order);
  await db.disconnect();
  res.send(order);
});

export default handler;
