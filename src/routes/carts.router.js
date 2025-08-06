import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager('src/data/carts.json');

router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.json(newCart);
});

router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  cart ? res.json(cart) : res.status(404).send('Carrito no encontrado');
});

router.post('/:cid/product/:pid', async (req, res) => {
  const result = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  if (result.error) return res.status(404).send(result.error);
  res.json(result);
});

export default router;
