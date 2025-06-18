// admin.js

const ESTATUS = ["Pendiente de revisión", "En revisión", "Finalizada"];
const CATEGORIAS = [
  "Violencia de género",
  "Maltrato de jefe",
  "Problema con compañero",
  "Queja general"
];

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

// Variables globales para estado
let quejas = [];
let quejaSeleccionada = null;

function cargarQuejas() {
  let q = JSON.parse(localStorage.getItem("quejas"));
  if (!q || q.length === 0) {
    localStorage.setItem("quejas", JSON.stringify(quejasDemo));
    return quejasDemo;
  }
  return q;
}

function guardarQuejas(data) {
  localStorage.setItem("quejas", JSON.stringify(data));
}

function crearTablaSimple(quejasFiltradas) {
  const tabla = document.createElement("table");
  tabla.style.marginBottom = "20px";

  const thead = document.createElement("thead");
  const filaHead = document.createElement("tr");

  ["Folio", "Fecha", "Estatus", "Ver Detalles"].forEach(texto => {
    const th = document.createElement("th");
    th.textContent = texto;
    filaHead.appendChild(th);
  });
  thead.appendChild(filaHead);
  tabla.appendChild(thead);

  const tbody = document.createElement("tbody");

  quejasFiltradas.forEach(q => {
    const tr = document.createElement("tr");
    if (q.categoria === "Violencia de género") {
      tr.style.backgroundColor = "#ff6666";
      tr.style.color = "#000";
    }

    // Folio
    const tdFolio = document.createElement("td");
    tdFolio.textContent = q.folio;
    tr.appendChild(tdFolio);

    // Fecha
    const tdFecha = document.createElement("td");
    tdFecha.textContent = q.fecha;
    tr.appendChild(tdFecha);

    // Estatus
    const tdEstatus = document.createElement("td");
    tdEstatus.textContent = q.estatus;
    tr.appendChild(tdEstatus);

    // Ver detalles (botón)
    const tdAccion = document.createElement("td");
    const btnDetalle = document.createElement("button");
    btnDetalle.textContent = "Ver detalles";
    btnDetalle.className = "guardar";
    btnDetalle.style.padding = "4px 10px";
    btnDetalle.addEventListener("click", () => {
      abrirDetalle(q.folio);
    });
    tdAccion.appendChild(btnDetalle);
    tr.appendChild(tdAccion);

    tbody.appendChild(tr);
  });

  tabla.appendChild(tbody);
  return tabla;
}

function mostrarQuejas() {
  const contenedor = document.getElementById("contenidoAdmin");
  contenedor.innerHTML = "";

  ESTATUS.forEach(status => {
    const seccion = document.createElement("div");
    seccion.classList.add("seccion-quejas");

    const titulo = document.createElement("h2");
    titulo.textContent = status;
    seccion.appendChild(titulo);

    CATEGORIAS.forEach(cat => {
      const filtradas = quejas.filter(q => q.estatus === status && q.categoria === cat);
      if (filtradas.length > 0) {
        const tituloCat = document.createElement("div");
        tituloCat.classList.add("categoria");
        tituloCat.textContent = cat;
        seccion.appendChild(tituloCat);

        const tabla = crearTablaSimple(filtradas);
        seccion.appendChild(tabla);
      }
    });

    contenedor.appendChild(seccion);
  });
}

// Abrir detalle editable
function abrirDetalle(folio) {
  quejaSeleccionada = quejas.find(q => q.folio === folio);
  if (!quejaSeleccionada) return;

  document.getElementById("folioDetalle").textContent = folio;
  document.getElementById("categoriaDetalle").textContent = quejaSeleccionada.categoria;
  document.getElementById("fechaDetalle").textContent = quejaSeleccionada.fecha;
  document.getElementById("descripcionDetalle").textContent = quejaSeleccionada.descripcion;

  // Nombre (input)
  document.getElementById("nombreDetalle").value = quejaSeleccionada.nombre || "";

  // Estatus (select)
  document.getElementById("estatusDetalle").value = quejaSeleccionada.estatus;

  // Comentarios (textarea)
  document.getElementById("comentariosDetalle").value = quejaSeleccionada.comentarios || "";

  document.getElementById("detalleQueja").style.display = "block";
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

// Guardar cambios con confirmación
document.getElementById("btnGuardarDetalle").addEventListener("click", () => {
  if (!quejaSeleccionada) return;

  // Validación violencia género: nombre obligatorio
  const nombreVal = document.getElementById("nombreDetalle").value.trim();
  if (quejaSeleccionada.categoria === "Violencia de género" && nombreVal === "") {
    alert("Para quejas de Violencia de género el nombre es obligatorio.");
    return;
  }

  if (!confirm("¿Estás seguro de guardar los cambios?")) {
    return;
  }

  quejaSeleccionada.nombre = nombreVal;
  quejaSeleccionada.estatus = document.getElementById("estatusDetalle").value;
  quejaSeleccionada.comentarios = document.getElementById("comentariosDetalle").value.trim();

  // Actualizar en localStorage
  const index = quejas.findIndex(q => q.folio === quejaSeleccionada.folio);
  quejas[index] = quejaSeleccionada;
  guardarQuejas(quejas);

  alert("Cambios guardados correctamente.");

  mostrarQuejas();
  document.getElementById("detalleQueja").style.display = "none";
});

// Botón cerrar detalles sin guardar
document.getElementById("btnCerrarDetalle").addEventListener("click", () => {
  document.getElementById("detalleQueja").style.display = "none";
  quejaSeleccionada = null;
});

window.addEventListener("load", () => {
  if (localStorage.getItem("adminLogueado") !== "true") {
    alert("No autorizado. Por favor, inicia sesión.");
    window.location.href = "login.html";
    return;
  }
  quejas = cargarQuejas();
  mostrarQuejas();
});
