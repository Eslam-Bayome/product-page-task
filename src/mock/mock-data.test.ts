import { getMockData } from "./index";

// Only the text may differ between languages.
const shape = (locale: "en" | "ar") => {
  const { products, reviews } = getMockData(locale);
  return {
    products: products.map(({ id, price, rating, soldCount, imageUrl }) => ({
      id,
      price,
      rating,
      soldCount,
      imageUrl,
    })),
    reviews: reviews.map(
      ({
        id,
        rating,
        createdAt,
        likes,
        topics,
        hasMedia,
        avatarUrl,
        description,
      }) => ({
        id,
        rating,
        createdAt,
        likes,
        topics,
        hasMedia,
        avatarUrl,
        hasDescription: Boolean(description),
      }),
    ),
  };
};

it("keeps en and ar mock data identical apart from text", () => {
  expect(shape("ar")).toEqual(shape("en"));
  expect(getMockData("en").products).toHaveLength(6);
  expect(getMockData("ar").reviews[0]?.title).not.toBe(
    getMockData("en").reviews[0]?.title,
  );
});
