import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const productsJSONPAth = join(dataFolderPath, "products.json");
const reviewsJSONPath = join(dataFolderPath, "reviews.json");
const productPublicFolderPath = join(process.cwd(), "./public/img/products");

export const getProducts = () => readJSON(productsJSONPAth);
export const writeProducts = (productsArray) =>
  writeJSON(productsJSONPAth, productsArray);

export const getReviews = () => readJSON(reviewsJSONPath);
export const writeReviews = (reviewsArray) =>
  writeJSON(reviewsJSONPath, reviewsArray);

export const saveProductImage = (fileName, fileContentAsBuffer) =>
  writeFile(join(productPublicFolderPath, fileName), fileContentAsBuffer);
