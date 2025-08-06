import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('src/data/products.json');

router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const product = await productManager.getProductById(pid);

  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

router.post('/', async (req, res) => {
  const nuevoProducto = req.body;
  const resultado = await productManager.addProduct(nuevoProducto);
  res.json(resultado);
});

router.put('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const datosActualizados = req.body;
  const resultado = await productManager.updateProduct(pid, datosActualizados);
  res.json(resultado);
});

router.delete('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const resultado = await productManager.deleteProduct(pid);
  res.json(resultado);
});

export default router;
