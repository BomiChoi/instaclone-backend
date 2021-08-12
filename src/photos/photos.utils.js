export const processHashtags = (caption) => {
    const hashtags = caption.match(/#[\w]+/g) || []; // 매치되는 해시태그 없을 경우 빈 배열 반환
    return hashtags.map(
        hashtag => (
            {
                where: { hashtag },
                create: { hashtag },
            }
        )
    );
};