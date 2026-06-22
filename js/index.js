
function hslToHex(h, s, l) {
    l = l / 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = function (n) {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
        .toString(16).padStart(2, "0");
    };
    return "#" + f(0) + f(8) + f(4);
}

/**
 * Manejo del modo oscuro
 */

  const btn   = document.getElementById('themeBtn');
  const icon  = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) applyDark(true);

  function toggleDark() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyDark(!isDark);
  }

  function applyDark(on) {
    document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light');
    localStorage.setItem('theme', on ? 'dark' : 'light');
    icon.textContent  = on ? '☀️' : '🌙';
    label.textContent = on ? 'Modo claro' : 'Modo oscuro';
    btn.classList.toggle('is-dark', on);
  }


function crearswatch(color, i) {
    const swatch = document.createElement("article");
    swatch.className = "swatch";

    const colorDiv = document.createElement("div");
    colorDiv.className = "swatch-color";
    colorDiv.style.background = color.hsl;

    // Botón de candado
    const lockBtn = document.createElement("button");
    lockBtn.className = color.locked ? "swatch-lock bloqueado" : "swatch-lock";
    lockBtn.type = "button";
    lockBtn.textContent = color.locked ? "🔒" : "🔓";
    lockBtn.setAttribute("aria-label", color.locked ? "Desbloquear color" : "Bloquear color");
    lockBtn.addEventListener("click", function() {
        color.locked = !color.locked;
        dibujarColores();
    });
    colorDiv.appendChild(lockBtn);

    const info = document.createElement("div");
    info.className = "swatch-info";

    const nombreColor = document.createElement("p");
    nombreColor.className = "swatch-nombre";
    nombreColor.textContent = "Color " + (i + 1);

    // 👇 Fila con el código + botón de copiar
    const codigoFila = document.createElement("div");
    codigoFila.className = "swatch-codigo-fila";

    const codigoColor = document.createElement("p");
    codigoColor.className = "swatch-codigo";
    const codigoTexto = (cd.value === "hsl") ? color.hsl : color.hex;
    codigoColor.textContent = codigoTexto;

    const copiarBtn = document.createElement("button");
    copiarBtn.className = "swatch-copiar";
    copiarBtn.type = "button";
    copiarBtn.textContent = "Copiar";
    copiarBtn.setAttribute("aria-label", "Copiar código del color");
    copiarBtn.addEventListener("click", function() {
        navigator.clipboard.writeText(codigoTexto).then(function() {
            // Feedback visual temporal
            copiarBtn.textContent = "¡Copiado!";
            copiarBtn.classList.add("copiado");
            setTimeout(function() {
                copiarBtn.textContent = "Copiar";
                copiarBtn.classList.remove("copiado");
            }, 1200);
        });
    });

    codigoFila.append(codigoColor, copiarBtn);
    info.append(nombreColor, codigoFila);
    swatch.append(colorDiv, info);
    return swatch;
}

function generarColor() {
    const h = Math.round(Math.random() * 360);
    const hsl = "hsl(" + h + ", 70%, 55%)";
    const hex = hslToHex(h, 70, 55);
    return { hsl, hex, locked: false }; // 👈 nace desbloqueado
}

const galeria = document.getElementById("galeria");
let coloresActuales = [];

function generarColores(cantidad) {
    const nuevos = [];
    for (let i = 0; i < cantidad; i++) {
        // 👇 si el color de esa posición está bloqueado, lo conservamos
        if (coloresActuales[i] && coloresActuales[i].locked) {
            nuevos.push(coloresActuales[i]);
        } else {
            nuevos.push(generarColor());
        }
    }
    coloresActuales = nuevos;
    dibujarColores();
}

function dibujarColores() {
    galeria.innerHTML = "";
    coloresActuales.forEach((color, i) => {
        galeria.appendChild(crearswatch(color, i));
    });
}

const boton = document.getElementById("generar");
const selector = document.getElementById("cantidad");
const cd = document.getElementById("codigo");

boton.addEventListener("click", function() {
    generarColores(Number(selector.value)); // bloqueados se quedan, el resto cambia
});

selector.addEventListener("change", function() {
    generarColores(Number(selector.value));
});

cd.addEventListener("change", function() {
    dibujarColores(); // solo cambia HSL/HEX
});


const guardarBtn = document.getElementById("guardar");
const guardadas = document.getElementById("guardadas");

// 👇 Cargamos las paletas guardadas (o un array vacío si no hay nada)
let paletasGuardadas = JSON.parse(localStorage.getItem("paletasGuardadas")) || [];

// Guarda el array actual en localStorage
function guardarEnStorage() {
    localStorage.setItem("paletasGuardadas", JSON.stringify(paletasGuardadas));
}

// Crea la tarjeta (imagen + botón eliminar) a partir de un data URL
function crearTarjeta(dataURL) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "guardada-item";

    const imagen = document.createElement("img");
    imagen.src = dataURL;
    imagen.alt = "Paleta de colores guardada";
    imagen.className = "guardada-img";

    const eliminarBtn = document.createElement("button");
    eliminarBtn.className = "guardada-eliminar";
    eliminarBtn.type = "button";
    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.setAttribute("aria-label", "Eliminar paleta guardada");
    eliminarBtn.addEventListener("click", function() {
        // 👇 quita del array, actualiza storage y redibuja
        paletasGuardadas = paletasGuardadas.filter(function(item) {
            return item !== dataURL;
        });
        guardarEnStorage();
        dibujarGuardadas();
    });

    tarjeta.append(imagen, eliminarBtn);
    return tarjeta;
}

// Dibuja todas las paletas guardadas desde el array
function dibujarGuardadas() {
    guardadas.innerHTML = "";
    paletasGuardadas.forEach(function(dataURL) {
        guardadas.appendChild(crearTarjeta(dataURL));
    });
}

guardarBtn.addEventListener("click", function() {
    const cantidad = coloresActuales.length;
    if (cantidad === 0) return;

    const anchoFranja = 200;
    const altoFranja = 300;
    const altoTexto = 50;

    const canvas = document.createElement("canvas");
    canvas.width = anchoFranja * cantidad;
    canvas.height = altoFranja + altoTexto;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    coloresActuales.forEach(function(color, i) {
        const x = i * anchoFranja;
        ctx.fillStyle = color.hsl;
        ctx.fillRect(x, 0, anchoFranja, altoFranja);

        const codigoTexto = (cd.value === "hsl") ? color.hsl : color.hex;
        ctx.fillStyle = "#111827";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(codigoTexto, x + anchoFranja / 2, altoFranja + 30);
    });

    // 👇 Guardamos el data URL en el array y en localStorage
    const dataURL = canvas.toDataURL("image/png");
    paletasGuardadas.push(dataURL);
    guardarEnStorage();
    dibujarGuardadas();
});

// 👇 Al cargar la página, mostramos lo que ya estaba guardado
dibujarGuardadas();


generarColores(Number(selector.value));