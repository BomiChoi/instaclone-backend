import client from "../client";

export default {
    Photo: {
        user: ({ userId }) => client.user.findUnique({
            where: { id: userId },
        }),
        hashtags: ({ id }) => client.hashtag.findMany({
            where: {
                photos: {
                    some: { id, },
                },
            },
        }),
        comments: ({ id }) => client.comment.findMany({
            where: {
                photo: {
                    id
                },
            },
        }),
        likes: ({ id }) => client.like.count({
            where: { photoId: id }
        }),
        commentNumber: ({ id }) => client.comment.count({
            where: { photoId: id }
        }),
        isMine: ({ userId }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false;
            }
            return userId === loggedInUser.id;
        },
        isLiked: async ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false;
            }
            const ok = await client.like.findUnique({
                where: {
                    photoId_userId: {
                        photoId: id,
                        userId: loggedInUser.id,
                    },
                },
                select: {
                    id: true,
                },
            });
            if (ok) {
                return true;
            }
            else {
                return false;
            }
        },
    },
    Hashtag: {
        photos: ({ id }, { page }) => {
            return client.hashtag.findUnique({
                where: {
                    id,
                },
            }).photos({
                take: 5,
                skip: (page - 1) * 5
            });
        },
        totalPhotos: ({ id }) => client.photo.count({
            where: {
                hashtags: {
                    some: { id, },
                },
            },
        })
    }
};