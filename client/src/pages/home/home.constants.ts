import { CATEGORIES } from "../../utils/Categories";

export const HOME_FEED_CATEGORIES = CATEGORIES.filter(({ id }) => id !== "top");
export const HOME_CATEGORY_IDS = HOME_FEED_CATEGORIES.map(({ id }) => id);
