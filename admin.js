// admin.js

const ESTATUS = ["Pendiente de revisión", "En revisión", "Finalizada"];
const CATEGORIAS = [
  "Violencia de género",
  "Maltrato de jefe",
  "Problema con compañero",
  "Queja general"
];

// Demo inicial con 4 quejas
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

// Carga quejas desde localStorage o crea demo
function cargarQuejas() {
  let q = JSON.parse(localStorage.getItem("quejas"));
  if (!q || q.length === 0) {
    localStorage.setItem("quejas", JSON.stringify(quejasDemo));
    return quejasDemo;
  }
  return q;
}

// Guarda quejas en localStorage
function guardarQuejas(quejas) {
  localStorage.setItem("quejas", JSON.stringify(quejas));
}

// Crea tabla para las quejas recibidas
function crearTablaQuejas(quejas) {
  const tabla = document.createElement("table");
  const thead = document.createElement("thead");
  const filaHead = document.createElement("tr");

  ["Folio", "Descripción", "Nombre", "Fecha", "Estatus", "Comentarios", "Acciones"].forEach(texto => {
    const th = document.createElement("th");
    th.textContent = texto;
    filaHead.appendChild(th);
  });
  thead.appendChild(filaHead);
  tabla.appendChild(thead);

  const tbody = document.createElement("tbody");

  quejas.forEach((q, idx) => {
    const tr = document.createElement("tr");
    if (q.categoria === "Violencia de género") {
      tr.classList.add("violencia");
    }

    // Folio
    const tdFolio = document.createElement("td");
    tdFolio.textContent = q.folio;
    tr.appendChild(tdFolio);

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

    // Estatus (select editable)
    const tdEstatus = document.createElement("td");
    const select = document.createElement("select");
    ESTATUS.forEach(e => {
      const option = document.createElement("option");
      option.value = e;
      option.textContent = e;
      if (q.estatus === e) option.selected = true;
      select.appendChild(option);
    });
    tdEstatus.appendChild(select);
    tr.appendChild(tdEstatus);

    // Comentarios (textarea editable)
    const tdComentarios = document.createElement("td");
    const textarea = document.createElement("textarea");
    textarea.value = q.comentarios || "";
    textarea.rows = 3;
    tdComentarios.appendChild(textarea);
    tr.appendChild(tdComentarios);

    // Acciones (botón guardar)
    const tdAcciones = document.createElement("td");
    const btnGuardar = document.createElement("button");
    btnGuardar.textContent = "Guardar";
    btnGuardar.className = "guardar";

    btnGuardar.addEventListener("click", () => {
      // Validación violencia género: nombre obligatorio
      if (q.categoria === "Violencia de género" && (!q.nombre || q.nombre.trim() === "")) {
        alert("Para quejas de Violencia de género el nombre es obligatorio.");
        return;
      }
      // Actualizar datos
      q.estatus = select.value;
      q.comentarios = textarea.value.trim();

      // Guardar cambios
      const quejas = cargarQuejas();
      quejas[idx] = q;
      guardarQuejas(quejas);

      alert("Queja actualizada correctamente.");
      mostrarQuejas();
    });

    tdAcciones.appendChild(btnGuardar);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
  });

  tabla.appendChild(tbody);
  return tabla;
}

// Mostrar quejas agrupadas por estatus y categoría
function mostrarQuejas() {
  const contenedor = document.getElementById("contenidoAdmin");
  contenedor.innerHTML = "";

  const quejas = cargarQuejas();

  ESTATUS.forEach(status => {
    const seccion = document.createElement("div");
    seccion.classList.add("seccion-quejas");

    const titulo = document.createElement("h2");
    titulo.textContent = status;
    seccion.appendChild(titulo);

    CATEGORIAS.forEach(cat => {
      const qFiltradas = quejas.filter(q => q.estatus === status && q.categoria === cat);
      if (qFiltradas.length > 0) {
        const tituloCat = document.createElement("div");
        tituloCat.classList.add("categoria");
        tituloCat.textContent = cat;
        seccion.appendChild(tituloCat);

        const tabla = crearTablaQuejas(qFiltradas);
        seccion.appendChild(tabla);
      }
    });

    contenedor.appendChild(seccion);
  });
}

// Validar sesión simple
window.addEventListener("load", () => {
  if (localStorage.getItem("adminLogueado") !== "true") {
    alert("No autorizado. Por favor, inicia sesión.");
    window.location.href = "login.html";
    return;
  }
  mostrarQuejas();
});
