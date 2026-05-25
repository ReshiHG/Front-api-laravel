"use strict";

const d = document,
  $table = d.querySelector(".crud-table"),
  $tbody = $table.querySelector("tbody"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();

//
async function getAll() {
  
  // Manejo de errores
  try {
    // Solicitud al api
    let res = await fetch("http://laravel_api_rest.test/api/product"),
      json = await res.json();

    // Manejo de error en la respuesta
    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    // limpiamos la tabla 
    $tbody.innerHTML = "";

    // console.log(json.data);
    // Obtención de los datos y llenado del template
    json.data.forEach((el) => {
      $template.querySelector(".productName").textContent = el.name;
      $template.querySelector(".productPrice").textContent = el.price;
      $template.querySelector(".productStock").textContent = el.stock;
      $template.querySelector(".productButtonEdit").dataset.id = el.id;
      $template.querySelector(".productButtonEdit").dataset.name = el.name;
      $template.querySelector(".productButtonEdit").dataset.price = el.price;
      $template.querySelector(".productButtonEdit").dataset.stock = el.stock;
      $template.querySelector(".productButtonDelete").dataset.id = el.id;

      // Clonación del template e inserción
      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    });

    $tbody.appendChild($fragment);
  } catch (error) {
    let message = error.statusText || "Error al obtener los productos";
    $table.insertAdjacentHTML(
      "afterend",
      `<p>Error ${error.status}: ${message}</p>`,
    );
  }
};

// Agregamos un listener que ejecutará getAll al cargar el DOM
d.addEventListener("DOMContentLoaded", getAll);

// Agregamos listener para el formulario
d.addEventListener("submit", async (e) => {
  if (e.target === $form) {
    // Prevenimos las acciones por defecto
    e.preventDefault();
    const id = e.target.id.value;
    
    if (!id) {
      // Agregamos producto
      try {
        // Enviamos la petición a la API indicando la URL y los encabezados
        let res = await fetch("http://laravel_api_rest.test/api/product", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              name: e.target.name.value,
              price: e.target.price.value,
              stock: e.target.stock.value,
            }),
          }),
          json = await res.json();
        // Manejo de error en la respuesta
        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        // limpiamos
        e.target.reset();
        e.target.id.value = "";
        $title.textContent = "Agregar Producto";

        // Refrescar la tabla
        await getAll();
        
      } catch (error) {
        let message = error.statusText || "Error al insertar el producto";
        $table.insertAdjacentHTML(
          "afterend",
          `<p>Error ${error.status}: ${message}</p>`,
        );
      }
    } else {
      // Actualizamos producto
      try {
        console.log("entra al fetch");
        
        let res = await fetch(
            `http://laravel_api_rest.test/api/product/${id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                name: e.target.name.value,
                price: e.target.price.value,
                stock: e.target.stock.value,
              })
            },
          ),
          json = await res.json();

        // Manejo de error en la respuesta
        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        // limpiamos
        e.target.reset();
        e.target.id.value = "";
        $title.textContent = "Agregar Producto";

        // Refrescar la tabla
        await getAll();

      } catch (error) {
        let message = error.statusText || "Error al actualizar el producto";
        $table.insertAdjacentHTML(
          "afterend",
          `<p>Error ${error.status}: ${message}</p>`,
        );
      }
    }
  }
});

// Agregamos un listener para los botones
d.addEventListener("click", (e) => {
  if (e.target.matches(".productButtonEdit")) {
    $title.textContent = "Editar Producto";
    $form.name.value = e.target.dataset.name;
    $form.price.value = e.target.dataset.price;
    $form.stock.value = e.target.dataset.stock;
    $form.id.value = e.target.dataset.id;
  }
});
