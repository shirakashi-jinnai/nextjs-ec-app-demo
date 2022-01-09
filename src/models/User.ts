import mongoose from 'mongoose'

// Optionの解説
// required：ブール値または関数。trueの場合、このプロパティに必要なバリデーターを追加します
// unique：ブール値、このプロパティに一意のインデックスを定義するかどうか。

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: String, required: true, default: false },
  },
  {
    timestamps: true,
  },
)

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
