import client from "../client";

export default {
    Comment: {
        user: ({ userId }) => client.user.findUnique({
            where: { id: userId },
        }),
        isMine: ({ userId }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false;
            }
            return userId === loggedInUser.id;
        },
    }
}