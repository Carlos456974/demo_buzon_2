const form = document.getElementById("formulario");
const confirmation = document.getElementById("confirmation");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const anonimo = form.anonimo.value === "sí";
  const nombre = form.nombre.value.trim();
  const descripcion = form.descripcion.value.trim();
  const categoria = form.categoria.value;
  const avisoAceptado = form.aviso.checked;

  if (!categoria) {
    alert("Por favor selecciona una categoría.");
    return;
  }

  if (!descripcion) {
    alert("Por favor escribe una descripción para la denuncia.");
    return;
  }

  if (!avisoAceptado) {
    alert("Debes aceptar el aviso de privacidad.");
    return;
  }

  if (!anonimo && !nombre) {
    alert("Por favor escribe tu nombre o selecciona denuncia anónima.");
    return;
  }

  if (categoria === "Violencia de género") {
    // Guardar temporal para pasarlo a violencia.html
    localStorage.setItem("denunciaViolencia", JSON.stringify({
      anonimo,
      nombre,
      descripcion,
      categoria,
      avisoAceptado,
    }));
    window.location.href = "violencia.html";
    return;
  }

  const folio = Date.now() + Math.floor(Math.random() * 1000);
  const fecha = new Date().toLocaleString();

  const denuncia = {
    folio,
    descripcion,
    correo: anonimo ? null : nombre,
    anonima: anonimo,
    fecha,
    categoria,
    status: "Pendiente",
    comentarios: []
  };

  let denuncias = JSON.parse(localStorage.getItem("denuncias") || "[]");
  denuncias.push(denuncia);
  localStorage.setItem("denuncias", JSON.stringify(denuncias));

  confirmation.style.display = "block";
  confirmation.textContent = `Denuncia enviada con éxito. Tu folio es: ${folio}. Guarda este folio para consultar el estatus.`;

  form.reset();
});
