import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
    Query: {
        seeFeed: protectedResolver((_, { offset }, { loggedInUser }) =>
            client.photo.findMany({
                where: {
                    OR: [
                        {
                            user: {
                                followers: {
                                    some: {
                                        id: loggedInUser.id,
                                    },
                                },
                            },
                        },
                        {
                            userId: loggedInUser.id,
                        },
                    ]
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
                skip: offset ? offset : 0,
            })
        ),
    },
};