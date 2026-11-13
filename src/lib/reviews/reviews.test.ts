import { type ProductReview } from "./review";
import {
  filterReviews,
  formatReviewDate,
  getPageList,
  paginate,
  summarizeReviews,
} from "./reviews";

const review = (overrides: Partial<ProductReview>): ProductReview => ({
  id: "r",
  rating: 5,
  title: "Great",
  author: "A",
  createdAt: "2020-07-02T15:29:00Z",
  likes: 0,
  topics: [],
  hasMedia: false,
  ...overrides,
});

const reviews = [
  review({ id: "a", rating: 5, topics: ["shipment"], hasMedia: true }),
  review({ id: "b", rating: 4, description: "Nice" }),
  review({ id: "c", rating: 4, topics: ["product-price"] }),
  review({ id: "d", rating: 1, description: "  " }),
];

describe("summarizeReviews", () => {
  it("averages and counts per star", () => {
    expect(summarizeReviews(reviews)).toEqual({
      average: 3.5,
      total: 4,
      breakdown: [
        { stars: 5, count: 1 },
        { stars: 4, count: 2 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 1 },
      ],
    });
    expect(summarizeReviews([]).average).toBe(0);
  });
});

describe("filterReviews", () => {
  const ids = (filter: Parameters<typeof filterReviews>[1]) =>
    filterReviews(reviews, filter).map((r) => r.id);

  it("combines ratings, topics and tab", () => {
    expect(ids({ ratings: [], topics: [], tab: "all" })).toEqual([
      "a",
      "b",
      "c",
      "d",
    ]);
    expect(ids({ ratings: [4], topics: [], tab: "all" })).toEqual(["b", "c"]);
    expect(
      ids({ ratings: [], topics: ["shipment", "product-price"], tab: "all" }),
    ).toEqual(["a", "c"]);
    expect(ids({ ratings: [], topics: [], tab: "media" })).toEqual(["a"]);
    // Blank descriptions don't count.
    expect(ids({ ratings: [], topics: [], tab: "description" })).toEqual(["b"]);
  });
});

describe("paginate / getPageList", () => {
  it("slices and clamps the page", () => {
    expect(paginate([1, 2, 3, 4, 5], 2, 2)).toEqual({
      items: [3, 4],
      page: 2,
      pageCount: 3,
    });
    expect(paginate([1, 2, 3], 9, 2).page).toBe(2);
    expect(paginate([], 1).pageCount).toBe(1);
  });

  it("lists pages with ellipses like the design", () => {
    expect(getPageList(1, 19)).toEqual([1, 2, "ellipsis", 19]);
    expect(getPageList(10, 19)).toEqual([
      1,
      "ellipsis",
      9,
      10,
      11,
      "ellipsis",
      19,
    ]);
    expect(getPageList(1, 1)).toEqual([1]);
  });
});

it("formats dates like the design, per locale", () => {
  expect(formatReviewDate("2020-07-02T15:29:00Z", "en-US")).toBe(
    "July 2, 2020 03:29 PM",
  );
  // Arabic month names, Western digits.
  expect(formatReviewDate("2020-07-02T15:29:00Z", "ar-EG-u-nu-latn")).toMatch(
    /^2 يوليو 2020/,
  );
});
