import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const productsJSONPAth = join(dataFolderPath, "products.json");

export const getProducts = () => readJSON(productsJSONPAth);
export const writeProducts = (productsArray) =>
  writeJSON(productsJSONPAth, productsArray);
