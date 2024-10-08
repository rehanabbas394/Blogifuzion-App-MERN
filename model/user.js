const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const  { CreateUserToken } = require("../util/auth")

const UserSchema = new mongoose.Schema(
  {
    Fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    //   required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString();
  const hashpassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.salt = salt;
  user.password = hashpassword;

  next();
});

UserSchema.static("matchPasswordandCreateToken", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
  
    const hash = createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");
  
    if (hash !== user.password) {
      throw new Error("Incorrect password");
    }
    const userWithoutSensitiveData = user.toObject();
    delete userWithoutSensitiveData.password;
    delete userWithoutSensitiveData.salt;
    const token = CreateUserToken(userWithoutSensitiveData)
    return token;

  });

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
