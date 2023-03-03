import Express from "express";
import { getProducts, writeProducts } from "../../lib/fs-tools.js";
import { checkProductSchema, triggerBadRequest } from "./validator.js";
import uniqid from "uniqid";

const productsRouter = Express.Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    let productsArray = await getProducts();
    res.send(productsArray);
  } catch (error) {
    next(error);
  }
});
productsRouter.post(
  "/",
  checkProductSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const productsArray = await getProducts();
      const newProduct = {
        ...req.body,
        _id: uniqid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      productsArray.push(newProduct);
      await writeProducts(productsArray);
      res.send({ id: newProduct._id });
    } catch (error) {
      next(error);
    }
  }
);

// productsRouter.post("/", async (req, res, next) => {
//   try {
//   } catch (error) {
//     next(error);
//   }
// });

// productsRouter.post("/", async (req, res, next) => {
//   try {
//   } catch (error) {
//     next(error);
//   }
// });

// productsRouter.post("/", async (req, res, next) => {
//   try {
//   } catch (error) {
//     next(error);
//   }
// });

export default productsRouter;
