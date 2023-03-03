import Express from "express";
import multer from "multer";
import {
  getProducts,
  getReviews,
  saveProductImage,
  writeProducts,
  writeReviews,
} from "../../lib/fs-tools.js";
import {
  checkProductSchema,
  checkReviewSchema,
  triggerBadRequest,
} from "./validator.js";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { extname } from "path";

const productsRouter = Express.Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    let productsArray = await getProducts();

    if (req.query && req.query.category) {
      const filteredProducts = productsArray.filter(
        (p) => p.category === req.query.category
      );
      res.send(filteredProducts);
    } else {
      res.send(productsArray);
    }
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
      res.status(201).send({ id: newProduct._id });
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const productArray = await getProducts();

    const productToSearch = productArray.find(
      (product) => product._id === req.params.productId
    );
    if (productToSearch) {
      res.send(productToSearch);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} is not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    let productArray = await getProducts();

    const index = productArray.findIndex(
      (product) => product._id === req.params.productId
    );
    if (index !== -1) {
      const oldProduct = productArray[index];
      const updatedProduct = {
        ...oldProduct,
        ...req.body,
        updatedAt: new Date(),
      };
      productArray[index] = updatedProduct;
      await writeProducts(productArray);
      res.send(updatedProduct);
    } else {
      next(
        createHttpError(
          404,
          `product with id ${req.params.productId} is not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const productArray = await getProducts();
    const remainingProducts = productArray.filter(
      (product) => product._id !== req.params.productId
    );
    if (productArray.length !== remainingProducts.length) {
      await writeProducts(remainingProducts);
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `product with id ${req.params.productId} is not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.post(
  "/:productId/upload",
  multer().single("productImage"),
  async (req, res, next) => {
    try {
      if (req.file) {
        console.log("FILE:", req.file);
        const originalFileExtension = extname(req.file.originalname);
        const fileName = req.params.productId + originalFileExtension;
        await saveProductImage(fileName, req.file.buffer);
        const productArray = await getProducts();
        const index = productArray.findIndex(
          (product) => product._id === req.params.productId
        );
        if (index !== -1) {
          const oldProduct = productArray[index];
          const updatedProduct = {
            ...oldProduct,
            imageUrl: `http://localhost:3000/img/products/${fileName}`,
          };
          productArray[index] = updatedProduct;

          await writeProducts(productArray);
          res.send({ message: "file uploaded" });
        } else {
          next(
            createHttpError(404, {
              message: `Product with id ${req.params.productId} not found`,
            })
          );
        }
      } else {
        next(createHttpError(400, { message: "Upload an image" }));
      }
    } catch (error) {
      next(error);
    }
  }
);
productsRouter.post(
  "/:productId/reviews",
  checkReviewSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const reviewsArray = await getReviews();
      const newReview = {
        ...req.body,
        productID: req.params.productId,
        _id: uniqid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      reviewsArray.push(newReview);
      await writeReviews(reviewsArray);
      res.status(201).send({ id: newReview._id });
    } catch (error) {
      next(error);
    }
  }
);
productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const productArray = await getProducts();
    const product = productArray.find((p) => p._id === req.params.productId);
    if (product) {
      const reviewArray = await getReviews();
      const reviewsOfAProduct = reviewArray.filter(
        (r) => r.productID === req.params.productId
      );

      res.send(reviewsOfAProduct);
    } else {
      next(
        createHttpError(
          404,
          `product with id ${req.params.productId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const productArray = await getProducts();

    const reviewArray = await getReviews();
    const product = productArray.find((p) => p._id === req.params.productId);
    if (product) {
      const reviewsOfProduct = reviewArray.filter(
        (r) => r.productID === product._id
      );
      const review = reviewsOfProduct.find(
        (r) => r._id === req.params.reviewId
      );

      if (review) {
        res.send(review);
      } else {
        next(
          createHttpError(
            404,
            `Review with id ${req.params.reviewId} is not found`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} is not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const reviewArray = await getReviews();
    const productArray = await getProducts();
    const product = productArray.find((p) => p._id === req.params.productId);

    if (product) {
      const index = reviewArray.findIndex((r) => r._id === req.params.reviewId);
      if (index !== -1) {
        const oldReview = reviewArray[index];
        const updatedReview = {
          ...oldReview,
          ...req.body,
          updatedAt: new Date(),
        };
        reviewArray[index] = updatedReview;
        await writeReviews(reviewArray);
        res.send(updatedReview);
      } else {
        next(
          createHttpError(
            404,
            `review with id ${req.params.reviewId} is not found`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} is not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.delete(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    try {
      const productArray = await getProducts();
      const product = productArray.find((p) => p._id === req.params.productId);
      const reviewArray = await getReviews();
      if (product) {
        const remainingReviews = reviewArray.filter(
          (r) => r._id !== req.params.reviewId
        );
        if (reviewArray.length !== remainingReviews.length) {
          await writeReviews(remainingReviews);
          res.status(204).send();
        } else {
          next(
            createHttpError(
              404,
              `review with id ${req.params.reviewId} is not found`
            )
          );
        }
      } else {
        next(
          createHttpError(
            404,
            `product with id ${req.params.productId} is not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default productsRouter;
