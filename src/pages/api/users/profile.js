import bcrypt from "bcryptjs";
import nc from "next-connect";
import User from "../../../models/User";
import { isAuth, signToken } from "../../../utils/auth";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();
  const { name, email, password } = req.body;
  const user = await User.findById(req.user.id);
  user.name = name || user.name;
  user.email = email || user.email;
  user.password = password ? bcrypt.hashSync(password) : user.password;

  await user.save();
  await db.disconnect();

  const token = signToken(user);

  res.send({
    token,
    id: user._id,
    name: user.name,
    email: user.email,
    isAddmin: user.isAddmin,
  });
});

export default handler;
