import nc from "next-connect";
import Order from "../../../models/Order";
import db from "../../../utils/db";
import { isAuth } from "../../../utils/auth";
import { onError, isAdmin } from "../../../utils/error";
import { Product } from "../../../models/Product";
import User from "../../../models/User";

const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();

  //aggregateはfindのパイプラインとは別のパイプラインで検索、集計することが可能（lean同様、純粋なjavascriptとしてリターンされる）
  const orderPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: "$itemsPrice" }, //売上高
      },
    },
  ]);
  const ordersPrice = orderPriceGroup.length > 0 ? orderPriceGroup[0].sales : 0;
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  await db.disconnect();

  res.send({
    ordersCount,
    productsCount,
    usersCount,
    ordersPrice,
    salesData,
  });
});
export default handler;
