import Express from "express";
import { join } from "path";

import productsRouter from "./api/products/index.js";
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";

const server = Express();
const port = 3002;
const publicFolderPath = join(process.cwd(), "./public");
server.use(Express.static(publicFolderPath));
server.use(Express.json());
server.use("/products", productsRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);
server.listen(port, () => {
  console.log(`server running on ${port}`);
});
