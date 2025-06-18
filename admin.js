// admin.js

// Quejas de demo para cargar inicialmente (si no hay datos guardados)
const quejasDemo = [
  {
    folio: "Q-0001",
    categoria: "Violencia de género",
    descripcion: "Comentarios ofensivos y actitud agresiva por parte del jefe.",
    nombre: "Ana Pérez",
    fecha: "2025-06-18",
    estatus: "Pendiente de revisión",
    comentarios: ""
  },
  {
    folio: "Q-0002",
    categoria: "Maltrato de jefe",
    descripcion: "El jefe hace comentarios despectivos constantemente.",
    nombre: "Carlos López",
    fecha: "2025-06-17",
    estatus: "En revisión",
    comentarios: "Estamos investigando el caso."
  },
  {
    folio: "Q-0003",
    categoria: "Problema con compañero",
    descripcion: "Conflictos frecuentes con un compañero de trabajo.",
    nombre: "Laura Gómez",
    fecha: "2025-06-16",
    estatus: "En revisión",
    comentarios: "Se solicitó mediación."
  },
  {
    folio: "Q-0004",
    categoria: "Queja general",
    descripcion: "Mal estado de las instalaciones.",
    nombre: "Anónimo",
    fecha: "2025-06-15",
    estatus: "Finalizada",
    comentarios: "Se realizó mantenimiento el 16 de junio."
  }
];

// Claves y categorías
const ESTATUS = ["Pendiente de revisión", "En revisión", "Finalizada"];
const CATEGORIAS = ["Violencia de género", "Maltrato de jefe", "Problema con compañero", "Queja general"];

function cargarQuejas() {
  // Cargar quejas desde localStorage o usar demo
  let quejas = JSON.parse(localStorage.getItem("quejas")) || quejasDemo;
  // Guardar demo en localStorage para persistencia
  localStorage.setItem("quejas", JSON.stringify(quejas));
  return quejas;
}

function guardarQuejas(quejas) {
  localStorage.setItem("quejas", JSON.stringify(quejas));
}

// Crear tabla para una lista de quejas
function crearTablaQuejas(quejas) {
  const tabla = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Folio", "Categoría", "Descripción", "Nombre", "Fecha", "Estatus", "Comentarios", "Acciones"].forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  tabla.appendChild(thead);

  const tbody = document.createElement("tbody");

  quejas.forEach((q, index) => {
    const tr = document.createElement("tr");
    if (q.categoria === "Violencia de género") {
      tr.style.backgroundColor = "#ff6666"; // rojo para violencia de género
      tr.style.color = "#000";
    }

    // Folio
    const tdFolio = document.createElement("td");
    tdFolio.textContent = q.folio;
    tr.appendChild(tdFolio);

    // Categoría
    const tdCategoria = document.createElement("td");
    tdCategoria.textContent = q.categoria;
    tr.appendChild(tdCategoria);

    // Descripción
    const tdDescripcion = document.createElement("td");
    tdDescripcion.textContent = q.descripcion;
    tr.appendChild(tdDescripcion);

    // Nombre
    const tdNombre = document.createElement("td");
    tdNombre.textContent = q.nombre || "Anónimo";
    tr.appendChild(tdNombre);

    // Fecha
    const tdFecha = document.createElement("td");
    tdFecha.textContent = q.fecha;
    tr.appendChild(tdFecha);

    // Estatus (select para cambiar)
    const tdEstatus = document.createElement("td");
    const selectEstatus = document.createElement("select");
    ESTATUS.forEach(e => {
      const option = document.createElement("option");
      option.value = e;
      option.textContent = e;
      if (q.estatus === e) option.selected = true;
      selectEstatus.appendChild(option);
    });
    tdEstatus.appendChild(selectEstatus);
    tr.appendChild(tdEstatus);

    // Comentarios (textarea editable)
    const tdComentarios = document.createElement("td");
    const textareaComentarios = document.createElement("textarea");
    textareaComentarios.value = q.comentarios;
    textareaComentarios.rows = 3;
    tdComentarios.appendChild(textareaComentarios);
    tr.appendChild(tdComentarios);

    // Acciones (botón guardar)
    const tdAcciones = document.createElement("td");
    const btnGuardar = document.createElement("button");
    btnGuardar.textContent = "Guardar";
    btnGuardar.className = "guardar";

    btnGuardar.addEventListener("click", () => {
      // Validación especial para violencia de género: nombre obligatorio
      if (q.categoria === "Violencia de género" && (!q.nombre || q.nombre.trim() === "")) {
        alert("Para quejas de Violencia de género el nombre es obligatorio.");
        return;
      }

      // Actualizar datos
      q.estatus = selectEstatus.value;
      q.comentarios = textareaComentarios.value.trim();

      // Guardar en localStorage
      quejas[index] = q;
      guardarQuejas(quejas);

      alert("Queja actualizada correctamente.");
      // Recargar para reflejar cambios
      mostrarQuejas();
    });

    tdAcciones.appendChild(btnGuardar);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
  });

  tabla.appendChild(tbody);
  return tabla;
}

function mostrarQuejas() {
  const contenedor = document.getElementById("contenidoAdmin");
  contenedor.innerHTML = "";

  const quejas = cargarQuejas();

  ESTATUS.forEach(status => {
    const seccion = document.createElement("div");
    seccion.className = "seccion-quejas";

    const titulo = document.createElement("h2");
    titulo.textContent = status;
    seccion.appendChild(titulo);

    CATEGORIAS.forEach(cat => {
      const quejasFiltradas = quejas.filter(q => q.estatus === status && q.categoria === cat);
      if (quejasFiltradas.length > 0) {
        const tituloCat = document.createElement("div");
        tituloCat.className = "categoria";
        tituloCat.textContent = cat;
        seccion.appendChild(tituloCat);

        const tabla = crearTablaQuejas(quejasFiltradas);
        seccion.appendChild(tabla);
      }
    });

    contenedor.appendChild(seccion);
  });
}

// Al cargar la página
window.addEventListener("load", () => {
  // Validar que admin esté logueado (por seguridad básica)
  if (localStorage.getItem("adminLogueado") !== "true") {
    alert("No autorizado. Por favor, inicie sesión.");
    window.location.href = "login.html";
    return;
  }

  mostrarQuejas();
});
