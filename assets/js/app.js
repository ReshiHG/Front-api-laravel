"use strict";

const d = document,
  $table = d.querySelector(".crud-table"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();

//
const getAll = async () => {
  // Manejo de errores
  try {
    // Solicitud al api
    let res = await fetch("http://laravel_api_rest.test/api/product"),
      json = await res.json();

    // Manejo de error en la respuesta
    if (!res.ok) throw { status: res.status, statusText: res.statusText };

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

    $table.querySelector("tbody").appendChild($fragment);
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

    if (!e.target.id.value) {
      // Agregamos producto
      try {
        // creamos las opciones que vamos a enviar con fetch
        let options = {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=utf-8",
              "accept": "application/json",
            },
            body: JSON.stringify({
              name: e.target.name.value,
              price: e.target.price.value,
              stock: e.target.stock.value,
            }),
          },
          // Enviamos la petición a la API y guardamos la respuesta
          res = await fetch(
            "http://laravel_api_rest.test/api/product",
            options,
          ),

          json = await res.json();
        // Manejo de error en la respuesta
        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        // refrescamos la página
        e.target.reset();
        location.reload();

      } catch (error) {
        let message = error.statusText || "Error al obtener los productos";
        $table.insertAdjacentElement(
          "afterend",
          `<p>Error ${error.status}: ${message}</p>`,
        );

      }
    } else {
      // Actualizamos producto
    }
  }
});
