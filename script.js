// 💰 Impuestos estimados para tiendas digitales en Argentina
const impuestos = {
  steam: 0.21 + 0.03,        // IVA 21% + Ingresos Brutos estimado 3% = 24%
  xbox:  0.21 + 0.03,        // mismo
  appstore: 0.21 + 0.03,     // mismo
  playstation: 0.21 + 0.03   // mismo
};

async function convertir() {
  const cantidad = parseFloat(document.getElementById("cantidad").value);
  const tipo = document.getElementById("tipo").value;
  const direccion = document.getElementById("direccion").value;
  const tienda = document.getElementById("tienda").value;
  const resultadoDiv = document.getElementById("resultado");

  resultadoDiv.classList.remove("mostrar");

  if (isNaN(cantidad) || cantidad <= 0) {
    resultadoDiv.innerText = "⚠️ Ingresá una cantidad válida.";
    resultadoDiv.classList.add("mostrar");
    return;
  }

  try {
    const respuesta = await fetch(`https://dolarapi.com/v1/dolares/${tipo}`);
    const data = await respuesta.json();
    const valorVenta = data.venta;
    const valorCompra = data.compra;

    let resultado = 0;
    if (direccion === "ARS-USD") {
      resultado = cantidad / valorVenta;
    } else {
      resultado = cantidad * valorVenta;
    }

    let texto = `
      💵 <strong>${tipo.toUpperCase()}</strong><br>
      🟢 Compra: ${valorCompra} ARS<br>
      🔴 Venta: ${valorVenta} ARS<br><br>
      🔹 Resultado: ${resultado.toFixed(2)} ${direccion === "ARS-USD" ? "USD" : "ARS"}
    `;

    if (tienda && impuestos[tienda] !== undefined) {
      const porcentaje = impuestos[tienda];
      const totalConImpuesto = resultado * (1 + porcentaje);
      texto += `
        <br><hr>
        🛒 Tienda: ${tienda.charAt(0).toUpperCase() + tienda.slice(1)}<br>
        📈 Impuesto estimado: ${(porcentaje * 100).toFixed(2)}%<br>
        💰 Total con impuestos: ${totalConImpuesto.toFixed(2)} ${direccion === "ARS-USD" ? "USD" : "ARS"}
      `;
    }

    resultadoDiv.innerHTML = texto;
    resultadoDiv.classList.add("mostrar");

  } catch (error) {
    resultadoDiv.innerText = "❌ Error al obtener los datos.";
    resultadoDiv.classList.add("mostrar");
  }
}
