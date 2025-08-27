const socket = io();

const productList = document.getElementById("productList");
const addProductForm = document.getElementById("addProductForm");

socket.on("productsUpdated", (products) => {
  productList.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${product.title}</h3>
      <p>Precio: $${product.price}</p>
      <p>ID: ${product.id}</p>
      <button class="deleteProduct" data-id="${product.id}">Eliminar</button>
    `;
    productList.appendChild(li);
  });
});

addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newProduct = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
  };
  socket.emit("addProduct", newProduct);
  addProductForm.reset();
});

productList.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteProduct")) {
    const productId = e.target.getAttribute("data-id");
    socket.emit("deleteProduct", productId);
  }
});