import nc from "next-connect";
import Order from "../../../models/Order";
import db from "../../../utils/db";
import { isAuth } from "../../../utils/auth";
import { onError, isAdmin } from "../../../utils/error";

const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const orders = await Order.find().populate("user", "name"); //({ path: "user", select: "email" })と同義;
  await db.disconnect();
  res.send(orders);
});

export default handler;
