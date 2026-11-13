import avatar1 from "@/assets/mock/avatar-1.png";
import avatar2 from "@/assets/mock/avatar-2.png";
import avatar3 from "@/assets/mock/avatar-3.png";
import avatar4 from "@/assets/mock/avatar-4.png";
import product1 from "@/assets/mock/product-1.png";
import product2 from "@/assets/mock/product-2.png";
import product3 from "@/assets/mock/product-3.png";
import product4 from "@/assets/mock/product-4.png";
import product5 from "@/assets/mock/product-5.png";

/** JSON can't import images, so mock entries reference them by key. */
export const MOCK_ASSETS: Record<string, string> = {
  "product-1": product1,
  "product-2": product2,
  "product-3": product3,
  "product-4": product4,
  "product-5": product5,
  "avatar-1": avatar1,
  "avatar-2": avatar2,
  "avatar-3": avatar3,
  "avatar-4": avatar4,
};
