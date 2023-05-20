const socketClient = io();

let productForm = document.getElementById("productForm");
let divServices = document.getElementById("divServices");

productForm.addEventListener("submit", (evt) => {
	evt.preventDefault();
	const title = evt.target.elements.title.value;
	const description = evt.target.elements.description.value;
	const code = evt.target.elements.code.value;
	const price = evt.target.elements.price.value;
	const stock = evt.target.elements.stock.value;
	const category = evt.target.elements.category.value;
	const thumbnails = evt.target.elements.thumbnails.value;
	const product = {
		title: title,
		description: description,
		code: code,
		price: price,
		status: "true",
		stock: stock,
		category: category,
		thumbnails: thumbnails,
	};
	socketClient.emit("item", product);
	productForm.reset();
});

socketClient.on("itemShow", (data) => {
	data.forEach((product) => {
		const itemsElements = document.createElement("div");
		itemsElements.id = product.id;
		itemsElements.innerHTML = `
			<p>Id: ${product.id}</p>
        	<p>Producto: ${product.title} </p>
        	<p>Descripcion: ${product.description} </p>
        	<p>Codigo: ${product.code}</p>
        	<p>Precio: ${product.price} </p>
        	<p>Estado: ${product.status} </p>
        	<p>Stock: ${product.stock}</p>
        	<p>Categoria: ${product.category}</p>
		`;
		divServices.appendChild(itemsElements);
	});
});
