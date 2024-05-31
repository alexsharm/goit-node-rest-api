import * as fs from "node:fs/promises";
import path from "node:path";

import User from "../models/user.js";

import Jimp from "jimp";

async function uploadAvatar(req, res, next) {
  try {
    console.log(req.file.filename);

    const image = await Jimp.read(req.file.path);
    await image.resize(250, 250).writeAsync(req.file.path);
    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: `/avatars/${req.file.filename}` },
      { new: true }
    );

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ avatarURL: `/avatars/${req.file.filename}` });
  } catch (error) {
    next(error);
  }
}

export default { uploadAvatar };
