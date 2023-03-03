import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const productSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name is a mandatory field and needs to be a string",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage: "description is a mandatory field and needs to be a string",
    },
  },
  brand: {
    in: ["body"],
    isString: {
      errorMessage: "brand is a mandatory field and needs to be a string",
    },
  },

  imageUrl: {
    in: ["body"],
    isString: {
      errorMessage: "imageUrl is a mandatory field and needs to be a string",
    },
  },
  price: {
    in: ["body"],
    isDecimal: {
      errorMessage: "price  is a mandatory field and needs to be a number",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a string",
    },
  },
};

const reviewSchema = {
  comment: {
    in: ["body"],
    isString: {
      errorMessage: "comment is a mandatory field and needs to be a string",
    },
  },

  rate: {
    in: ["body"],
    isDecimal: {
      errorMessage: "rate  is a mandatory field and needs to be a number",
    },
  },
};
export const checkProductSchema = checkSchema(productSchema);
export const checkReviewSchema = checkSchema(reviewSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);

  console.log(errors.array());

  if (errors.isEmpty()) {
    next();
  } else {
    next(
      createHttpError(400, "Errors during product validation", {
        errorsList: errors.array(),
      })
    );
  }
};
