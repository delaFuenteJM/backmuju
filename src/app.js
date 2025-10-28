import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/sessions.router.js";

import product from "./models/product.js";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";
import { initializePassport } from "./config/passport.config.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
initializePassport();
app.use(passport.initialize());

mongoose.connect(process.env.DATABASE_URL)
.then(()=>{
  console.log("Conectado a la base de datos MongoDB");
})
.catch((error)=>{
  console.error("Error al conectar a la base de datos MongoDB:", error);
});

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

socket.on("addProduct", async (newProduct) => {
    try {
      await product.create(newProduct);
      const updatedProducts = await product.find();
      io.emit("productsUpdated", updatedProducts);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      await product.findByIdAndDelete(productId);
      const updatedProducts = await product.find();
      io.emit("productsUpdated", updatedProducts);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  });
});