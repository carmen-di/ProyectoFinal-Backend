const socket = io()

const buttonAdd = document.querySelector("#btnAdd")
if (buttonAdd) {
    buttonAdd.addEventListener("click", (e) => {
        // ----- VALIDACIONES
        let actualStatus = false
        if (document.querySelector("#statusAdd").checked) {
            actualStatus = true
        }
        let thumbnails = []
        if (!document.querySelector("#thumbnailsAdd").value === "") {
            thumbnails = thumbnails.push(
                document.querySelector("#thumbnailsAdd").value
            )
        }

    //---Objeto obtenido del formulario
    const prod = {
        title: document.querySelector("#titleAdd").value,
        description: document.querySelector("#descriptionAdd").value,
        code: document.querySelector("#codeAdd").value,
        price: parseFloat(document.querySelector("#priceAdd").value),
        stock: parseInt(document.querySelector("#stockAdd").value),
        category: document.querySelector("#categoryAdd").value,
        thumbnails: thumbnails,
    }

    // se hace fetch a la api que crea productos
    fetch('/api/products/', {
        method: 'POST',
        body: JSON.stringify(prod),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status === 201) {
            const savedProduct = response.json()
        }
    })


    //se resetean los inputs del formulario
    document.querySelector("#titleAdd").value = ""
    document.querySelector("#descriptionAdd").value = ""
    document.querySelector("#codeAdd").value = ""
    document.querySelector("#priceAdd").value = ""
    document.querySelector("#stockAdd").value = ""
    document.querySelector("#categoryAdd").value = ""

    // ---se envia el producto obtenido del formulario
    // Se en via prod pero no se usa
    socket.emit("addProduct", prod)
  })
}

const buttonUpdate = document.querySelector("#btnUpdate")
    if (buttonUpdate) {
    buttonUpdate.addEventListener("click", (e) => {
        //validamos que si no se ingresa un id de algun producto para identificarlo te alerta
        if (!document.querySelector("#idUpdate").value) {
        alert("No se ingreso ningun id de producto a modificar")
        } else {
        // ----- VALIDACIONES
        let actualStatus = false
        if (document.querySelector("#statusUpdate").checked) {
            actualStatus = true
        }
        //inicializamos el producto que se obtendrá del formulario para luego ir completándolo dinámicamente
        let prod = {}

        if (document.querySelector("#idUpdate").value) {
            prod = { ...prod, id: document.querySelector("#idUpdate").value }
        }
        if (document.querySelector("#titleUpdate").value) {
            prod = { ...prod, title: document.querySelector("#titleUpdate").value }
        }
        if (document.querySelector("#descriptionUpdate").value) {
            prod = {
            ...prod,
            description: document.querySelector("#descriptionUpdate").value,
            }
        }
        if (document.querySelector("#priceUpdate").value) {
            prod = { ...prod, price: document.querySelector("#priceUpdate").value }
        }
        if (document.querySelector("#thumbnailsUpdate").value) {
            prod = {
            ...prod,
            thumbnails: document.querySelector("#thumbnailsUpdate").value,
            }
        }
        if (document.querySelector("#codeUpdate").value) {
            prod = { ...prod, code: document.querySelector("#codeUpdate").value }
        }
        if (document.querySelector("#stockUpdate").value) {
            prod = { ...prod, stock: document.querySelector("#stockUpdate").value }
        }
        if (document.querySelector("#categoryUpdate").value) {
            prod = {
            ...prod,
            category: document.querySelector("#categoryUpdate").value,
            }
        }
        if (document.querySelector("#statusUpdate").checked) {
            prod = { ...prod, status: actualStatus }
        }

      //se resetean los inputs del formulario
      document.querySelector("#idUpdate").value = ""
      document.querySelector("#titleUpdate").value = ""
      document.querySelector("#descriptionUpdate").value = ""
      document.querySelector("#priceUpdate").value = ""
      document.querySelector("#thumbnailsUpdate").value = ""
      document.querySelector("#codeUpdate").value = ""
      document.querySelector("#stockUpdate").value = ""
      document.querySelector("#categoryUpdate").value = ""

      // ---se envia el producto obtenido edel formulario
      socket.emit("updateProduct", prod.id, prod)
    }
  })
}

const buttonDelete = document.querySelector("#btnDelete")
const currentUserId = document.querySelector("#id-current-user")
if (buttonDelete) {
  buttonDelete.addEventListener("click", (e) => {
    //validamos que si no se ingresa un id de algun producto para identificarlo te alerta
    if (!document.querySelector("#idDelete").value) {
      alert("ingresar el id de un producto existente para Eliminarlo")
    } else {
      const productId = document.querySelector("#idDelete").value
      socket.emit("deleteProduct", {productId, currentUserId})
      document.querySelector("#idDelete").value = ""
    }
  })
}

const deleteFromCartButtons = document.querySelectorAll(".deleteFromCartBtn")
if (deleteFromCartButtons) {
  deleteFromCartButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
          const productId = e.target.id
          const cartId = document.querySelector(".cart").id
      socket.emit("deleteProductFromCart", {cartId: cartId,  productId: productId})
    })
  })
}

const addToCartButtons = document.querySelectorAll(".realtimeProductsAddtoCartBtn")
if (addToCartButtons) {
  addToCartButtons.forEach((button) => {
    // Agrega un evento click a cada boton
    button.addEventListener("click", async () => {
    // Obtiene el id del producto desde el boton
    const productId = button.id
    const cartId = document.querySelector(".cart").id

    // se hace fetch a la api que crea productos
    fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'POST',
    })
    .then(response => {
      if (response.status === 201) {
        const savedProduct = response.json()
    }
    })

      // ---se envia el producto obtenido edel formulario
      socket.emit("addProductToCart", {cartId: cartId,  productId: productId})
    })
  })
}

socket.on("updateProductsList", (prodListItems) => {
  const productList = document.getElementById("productList")
  const viewProductList = document.getElementById("view-productList")

  // Se crea una variable donde se ira guardando el código HTML de la vista de la lista de los productos
  let htmlList = ""

  // Por cada producto se crea un item y se agrega a la lista
  prodListItems.forEach((product) => {
    const item = `<li id=${product._id}>
    <div>
    <strong class="prod-title">${product.title}</strong>
    <br />
    <strong>Price:</strong> $${product.price}
    <br />
    <strong>Description:</strong> ${product.description}
    <br />
    <strong>Category:</strong> ${product.category}
    <br />
    <strong>Id:</strong> ${product._id}
    </div>
    <div class="add-to-cart-btn-container">
    <button id=${product._id} class="add-to-cart-btn realtimeProductsAddtoCartBtn">Agregar al carrito</button>
    </div>
    </li>`
    htmlList = htmlList + item
  })

  // Se agrega toda la vista de la lista de los productos al innerHTML
  productList.innerHTML = htmlList
  viewProductList.innerHTML = htmlList

  const productsAddToCartButtons = document.querySelectorAll(".realtimeProductsAddtoCartBtn")

  if (productsAddToCartButtons.length > 0) {
    addToCartButtons.forEach((button) => {
      // Agrega un evento click a cada boton
      button.addEventListener("click", async () => {
        // Obtiene el id del producto desde el boton
        const productId = button.id
        const cartId = document.querySelector(".cart").id

        // ---se envia el producto obtenido del formulario
        socket.emit("addProductToCart", {cartId: cartId,  productId: productId})
      })
    })
  }
})

socket.on("updateCartList", (cartResponse) => {
  const cartList = document.getElementById("cartList")
  // Se crea una variable donde se ira guardando el código HTML de la vista de la lista de los productos
  let htmlList = ""

  // Por cada producto se crea un item y se agrega a la lista
  cartResponse.payload.forEach((product) => {
    const item = `<li id=${product.product._id}>
    <div>
    <strong class="prod-title">${product.product.title}</strong>
    <br />
    <strong>Price:</strong> $${product.product.price}
    <br />
    <strong>Description</strong>: ${product.product.description}
    <br />
    <strong>Category</strong>: ${product.product.category}
    <br />
    <strong>Id</strong>: ${product.product._id}
    <br />
    <strong>Quantity</strong>: ${product.quantity}
    </div>
    <div class="delete-from-cart-btn-container">
    <button id=${product.product._id} 
    class="deleteFromCartBtn">Eliminar</button>
    </div>
    </li>`
    htmlList = htmlList + item
  })

    // Se agrega toda la vista de la lista de los productos al innerHTML
    cartList.innerHTML = htmlList

  const deleteFromCartButtons = document.querySelectorAll(
    ".deleteFromCartBtn"
  )
  if (deleteFromCartButtons.length > 0) {
    deleteFromCartButtons.forEach((button) => {
        button.addEventListener("click", async (e) => {
        const cartId = button.dataset.cartId;
        const productId = button.id
        socket.emit("deleteProductFromCart", {cartId: cartId,  productId: productId})
      })
    })
  }
})