if (localStorage.getItem("adminLogueado") !== "true") {
  window.location.href = "login.html";
}

const tbody = document.getElementById("denunciasTableBody");
const logoutBtn = document.getElementById("logoutBtn");

function cargarDenuncias() {
  const denuncias = JSON.parse(localStorage.getItem("denuncias") || "[]");
  tbody.innerHTML = "";

  denuncias.forEach((denuncia, index) => {
    const tr = document.createElement("tr");

    if (denuncia.categoria && denuncia.categoria.toLowerCase().includes("violencia")) {
      tr.classList.add("violencia");
    }

    const comentarioAdmin = denuncia.comentarios ? denuncia.comentarios.join("\n") : "";

    tr.innerHTML = `
      <td>${denuncia.folio}</td>
      <td>${denuncia.fecha}</td>
      <td>${denuncia.categoria || "-"}</td>
      <td>${denuncia.descripcion}</td>
      <td>${denuncia.anonima ? "Sí" : "No"}</td>
      <td>
        <select data-index="${index}" class="estatusSelect">
          <option value="Pendiente" ${denuncia.status === "Pendiente" ? "selected" : ""}>Pendiente</option>
          <option value="En revisión" ${denuncia.status === "En revisión" ? "selected" : ""}>En revisión</option>
          <option value="Finalizado" ${denuncia.status === "Finalizado" ? "selected" : ""}>Finalizado</option>
        </select>
      </td>
      <td>
        <textarea data-index="${index}" class="comentarioAdmin" rows="2" placeholder="Agregar comentario...">${comentarioAdmin}</textarea>
        <button data-index="${index}" class="guardarComentarioBtn">Guardar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Eventos para guardar estatus
  document.querySelectorAll(".estatusSelect").forEach(select => {
    select.addEventListener("change", (e) => {
      const index = e.target.dataset.index;
      const denuncias = JSON.parse(localStorage.getItem("denuncias") || "[]");
      denuncias[index].status = e.target.value;
      localStorage.setItem("denuncias", JSON.stringify(denuncias));
      alert(`Estatus actualizado a "${e.target.value}" para folio ${denuncias[index].folio}`);
    });
  });

  // Guardar comentario
  document.querySelectorAll(".guardarComentarioBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      const textareas = document.querySelectorAll(".comentarioAdmin");
      const comentario = textareas[index].value.trim();

      if (!comentario) {
        alert("El comentario está vacío.");
        return;
      }

      const denuncias = JSON.parse(localStorage.getItem("denuncias") || "[]");
      if (!denuncias[index].comentarios) {
        denuncias[index].comentarios = [];
      }
      denuncias[index].comentarios.push(comentario);
      localStorage.setItem("denuncias", JSON.stringify(denuncias));
      alert(`Comentario guardado para folio ${denuncias[index].folio}`);
    });
  });
}

cargarDenuncias();

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("adminLogueado");
  window.location.href = "login.html";
});
