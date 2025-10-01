// /js/calculadora.js

console.log("✅ calculadora.js bien chargé !");

// === Utilitaires ===

// Fusion tramos estatal + comunidad
function getTramosTotales(ccaa) {
  const estatal = TAX_PARAMS.irpf.estatal;
  const auton = TAX_PARAMS.irpf.comunidades[ccaa] || TAX_PARAMS.irpf.comunidades.generico;
  return estatal.map((t, i) => ({
    hasta: t.hasta,
    tipo: t.tipo + (auton[i] ? auton[i].tipo : 0)
  }));
}

// Minimos personales y familiares
function calcularMinimos(datos) {
  const m = TAX_PARAMS.irpf.minimos;
  let total = TAX_PARAMS.irpf.minimo_personal;

  if (datos.edad >= 65) total += m.edad.mayor_65;
  if (datos.edad >= 75) total += m.edad.mayor_75;

  (datos.hijos || []).forEach((hijo, idx) => {
    if (idx === 0) total += m.descendientes.primer;
    else if (idx === 1) total += m.descendientes.segundo;
    else if (idx === 2) total += m.descendientes.tercero;
    else total += m.descendientes.cuarto;

    if (hijo.edad < 3) total += m.descendientes.menores_3;
    if (hijo.discapacidad) {
      total += hijo.grado === "33_65" ? m.discapacidad.grado_33_65 : m.discapacidad.grado_65;
    }
  });

  (datos.ascendientes || []).forEach((asc) => {
    if (asc.edad >= 65) total += m.ascendientes.base;
    if (asc.edad >= 75) total += m.ascendientes.mayores_75;
    if (asc.discapacidad) {
      total += asc.grado === "33_65" ? m.discapacidad.grado_33_65 : m.discapacidad.grado_65;
    }
  });

  if (datos.discapacidad_contribuyente.grado_33_65) total += m.discapacidad.grado_33_65;
  if (datos.discapacidad_contribuyente.grado_65) total += m.discapacidad.grado_65;
  if (datos.discapacidad_contribuyente.movilidad_reducida) total += m.discapacidad.movilidad_reducida;

  if (
    datos.situacion_familiar?.estado === "casado" &&
    datos.situacion_familiar.tributacion_conjunta &&
    datos.situacion_familiar.conyuge_ingresos_bajos
  ) {
    total += m.unidad_familiar;
  }

  return total;
}

// IRPF
function calcularIRPF(baseImponible, ccaa) {
  const tramos = getTramosTotales(ccaa);
  let restante = baseImponible, cuota = 0, inicio = 0;
  tramos.forEach((tramo) => {
    const limite = tramo.hasta;
    const cantidad = Math.min(restante, limite - inicio);
    if (cantidad > 0) {
      cuota += cantidad * tramo.tipo;
      restante -= cantidad;
      inicio = limite;
    }
  });
  return cuota;
}

// Salaire net
function calcularSueldo(datos) {
  const bruto = datos.sueldo_bruto_anual;
  const ssRate = TAX_PARAMS.contratos[datos.contrato]?.ssRate || TAX_PARAMS.ss.rate;
  const baseSS = Math.min(bruto, TAX_PARAMS.ss.maxBase);
  const ss = baseSS * ssRate;

  let baseIrpf = bruto - ss;
  const minimos = calcularMinimos(datos);
  baseIrpf = Math.max(0, baseIrpf - minimos);

  const irpf = calcularIRPF(baseIrpf, datos.ccaa);

  const netoAnual = bruto - ss - irpf;
  const netoMensual = netoAnual / datos.numero_pagas;

  return { bruto, ss, minimos, irpf, netoAnual, netoMensual };
}

// Gestion des tabs
function mostrar(seccion) {
  const rapido = document.getElementById("rapido");
  const preciso = document.getElementById("preciso");
  const bR = document.getElementById("btn-rapido");
  const bP = document.getElementById("btn-preciso");

  if (seccion === "rapido") {
    rapido.classList.remove("hidden");
    preciso.classList.add("hidden");
    bR.classList.add("bg-blue-600","text-white");
    bR.classList.remove("bg-gray-200");
    bP.classList.remove("bg-blue-600","text-white");
    bP.classList.add("bg-gray-200");
  } else {
    preciso.classList.remove("hidden");
    rapido.classList.add("hidden");
    bP.classList.add("bg-blue-600","text-white");
    bP.classList.remove("bg-gray-200");
    bR.classList.remove("bg-blue-600","text-white");
    bR.classList.add("bg-gray-200");
  }
}
window.mostrar = mostrar;

// === Boot ===
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM chargé !");
  console.log("TAX_PARAMS:", TAX_PARAMS);

  // Remplit dynamiquement les selects depuis TAX_PARAMS.options
  function fillSelect(id, options, selectedVal) {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.innerHTML = "";
    options.forEach(opt => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      if (opt === selectedVal) o.selected = true;
      sel.appendChild(o);
    });
  }

  fillSelect("pagas-rapido", TAX_PARAMS.options.numero_pagas, TAX_PARAMS.defaults.numero_pagas);
  fillSelect("pagas", TAX_PARAMS.options.numero_pagas, TAX_PARAMS.defaults.numero_pagas);
  fillSelect("contrato", TAX_PARAMS.options.contratos, TAX_PARAMS.defaults.contrato);
  fillSelect("comunidad", TAX_PARAMS.options.comunidades, "madrid");

  // Sync brut mensual/anual/pagas (nouvelle version)
  function syncBruto(idMensual, idAnual, idPagas) {
    const mensual = document.getElementById(idMensual);
    const anual = document.getElementById(idAnual);
    const pagasEl = document.getElementById(idPagas);

    function recalcFromAnual() {
      const val = parseFloat(anual.value);
      const pagas = parseInt(pagasEl.value) || 12;
      if (!isNaN(val) && val > 0) mensual.value = (val / pagas).toFixed(2);
    }
    function recalcFromMensual() {
      const val = parseFloat(mensual.value);
      const pagas = parseInt(pagasEl.value) || 12;
      if (!isNaN(val) && val > 0) anual.value = (val * pagas).toFixed(2);
    }

    mensual?.addEventListener("input", recalcFromMensual);
    anual?.addEventListener("input", recalcFromAnual);
    pagasEl?.addEventListener("change", () => {
      if (anual.value) recalcFromAnual();
      else if (mensual.value) recalcFromMensual();
    });

    // 🔥 recalcul initial si une valeur est déjà présente
    if (anual.value) recalcFromAnual();
    else if (mensual.value) recalcFromMensual();
  }

  // Appels après que le DOM est prêt
  syncBruto("bruto-mensual-rapido", "bruto-anual-rapido", "pagas-rapido");
  syncBruto("bruto-mensual-preciso", "bruto-anual-preciso", "pagas");

  // Gestion hijos dynamiques
  document.getElementById("add-hijo")?.addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("flex","gap-2","items-center");
    div.innerHTML = `
      <input type="number" class="edad-hijo border p-1 rounded w-20" placeholder="Edad">
      <label><input type="checkbox" class="disc-hijo-33"> 33-65%</label>
      <label><input type="checkbox" class="disc-hijo-65"> ≥65%</label>
      <button type="button" class="remove-hijo text-red-500">✕</button>
    `;
    document.getElementById("hijos-lista").appendChild(div);
    div.querySelector(".remove-hijo").addEventListener("click", () => div.remove());
  });

  // Gestion ascendientes dynamiques
  document.getElementById("add-asc")?.addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("flex","gap-2","items-center");
    div.innerHTML = `
      <input type="number" class="edad-asc border p-1 rounded w-20" placeholder="Edad">
      <label><input type="checkbox" class="disc-asc-33"> 33-65%</label>
      <label><input type="checkbox" class="disc-asc-65"> ≥65%</label>
      <button type="button" class="remove-asc text-red-500">✕</button>
    `;
    document.getElementById("asc-lista").appendChild(div);
    div.querySelector(".remove-asc").addEventListener("click", () => div.remove());
  });

  // Form rapide
  document.getElementById("form-rapido").addEventListener("submit", (e) => {
    e.preventDefault();
    const bruto = parseFloat(document.getElementById("bruto-anual-rapido").value);
    const pagas = parseInt(document.getElementById("pagas-rapido").value) || 12;
    if (!bruto || bruto <= 0) return;

    const datos = { ...TAX_PARAMS.defaults, sueldo_bruto_anual: bruto, ccaa: "madrid", numero_pagas: pagas, hijos: [], ascendientes: [] };
    const r = calcularSueldo(datos);

    document.querySelector("#resultado-rapido p.text-3xl").innerText = r.netoMensual.toFixed(2) + " € / mes";
    document.getElementById("resultado-rapido").classList.remove("hidden");
  });

  // Form précis
  document.getElementById("form-preciso").addEventListener("submit", (e) => {
    e.preventDefault();
    const bruto = parseFloat(document.getElementById("bruto-anual-preciso").value);
    const pagas = parseInt(document.getElementById("pagas").value);
    const comunidad = document.getElementById("comunidad").value;
    const edad = parseInt(document.getElementById("edad").value);
    const contrato = document.getElementById("contrato").value;

    const discapacidad_contribuyente = {
      grado_33_65: document.getElementById("disc_33_65").checked,
      grado_65: document.getElementById("disc_65").checked,
      movilidad_reducida: document.getElementById("disc_mov").checked
    };

    const hijos = [];
    document.querySelectorAll("#hijos-lista > div").forEach((row) => {
      const edadH = parseInt(row.querySelector(".edad-hijo").value) || 0;
      const disc33 = row.querySelector(".disc-hijo-33").checked;
      const disc65 = row.querySelector(".disc-hijo-65").checked;
      hijos.push({ edad: edadH, discapacidad: disc33 || disc65, grado: disc65 ? "65" : disc33 ? "33_65" : null });
    });

    const ascendientes = [];
    document.querySelectorAll("#asc-lista > div").forEach((row) => {
      const edadA = parseInt(row.querySelector(".edad-asc").value) || 0;
      const disc33 = row.querySelector(".disc-asc-33").checked;
      const disc65 = row.querySelector(".disc-asc-65").checked;
      ascendientes.push({ edad: edadA, discapacidad: disc33 || disc65, grado: disc65 ? "65" : disc33 ? "33_65" : null });
    });

    if (!bruto || bruto <= 0) return;

    const datos = { ...TAX_PARAMS.defaults, sueldo_bruto_anual: bruto, numero_pagas: pagas, ccaa: comunidad, edad, contrato, discapacidad_contribuyente, hijos, ascendientes };
    const r = calcularSueldo(datos);

    document.querySelector("#resultado-preciso p.text-3xl").innerText = `${r.netoMensual.toFixed(2)} € / mes`;
    document.getElementById("detalle").innerText = `SS: ${r.ss.toFixed(2)} €, IRPF: ${r.irpf.toFixed(2)} €, Neto anual: ${r.netoAnual.toFixed(2)} €`;
    document.getElementById("resultado-preciso").classList.remove("hidden");
  });
});
