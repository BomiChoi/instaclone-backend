import { createWriteStream } from "fs";
import bcrypt from "bcrypt";
import client from "../../client";
import { protectedResolver } from "../users.utils";

export default {
    Mutation: {
        editProfile: protectedResolver(
            async (
                _,
                {
                    firstName,
                    lastName,
                    username,
                    email,
                    password: newPassword,
                    bio,
                    avatar
                },
                { loggedInUser }
            ) => {
                const { filename, createReadStream } = await avatar;
                const readStream = createReadStream();
                const writeStream = createWriteStream(process.cwd() + "/uploads/" + filename);
                readStream.pipe(writeStream);
                let uglyPassword = null;
                if (newPassword) {
                    uglyPassword = await bcrypt.hash(newPassword, 10);
                }
                const updatedUser = await client.user.update({
                    where: { id: loggedInUser.id },
                    data: {
                        firstName,
                        lastName,
                        username,
                        email,
                        bio,
                        avatar,
                        ...(uglyPassword && { password: uglyPassword })
                    },
                });
                if (updatedUser) {
                    return { ok: true }
                } else {
                    return {
                        ok: false,
                        error: "Could not update profile."
                    }
                }
            }
        ),
    },
};