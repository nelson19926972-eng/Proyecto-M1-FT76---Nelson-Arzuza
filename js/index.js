
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


function crearswatch(colorHSL, colorHEX, nombre) {
    const swatch = document.createElement("article");
    swatch.className = "swatch";

    const color = document.createElement("div");
    color.className = "swatch-color";
    color.style.background = colorHSL; // el fondo SIEMPRE usa HSL, así el color no cambia

    const info = document.createElement("div");
    info.className = "swatch-info";

    const nombreColor = document.createElement("p");
    nombreColor.className = "swatch-nombre";
    nombreColor.textContent = nombre;

    const codigoColor = document.createElement("p");
    codigoColor.className = "swatch-codigo";

    // Solo cambia el TEXTO del código, no el color
    codigoColor.textContent = (cd.value === "hsl") ? colorHSL : colorHEX;

    info.append(nombreColor, codigoColor);
    swatch.append(color, info);
    return swatch;
}

function generarColor() {
    const h = Math.round(Math.random() * 360);
    const hsl = "hsl(" + h + ", 70%, 55%)";
    const hex = hslToHex(h, 70, 55);
    return { hsl, hex };
}

const galeria = document.getElementById("galeria");

// 👇 Guardamos los colores actuales para no regenerarlos
let coloresActuales = [];

function generarColores(cantidad) {
    coloresActuales = [];
    for (let i = 0; i < cantidad; i++) {
        coloresActuales.push(generarColor());
    }
    dibujarColores();
}

// 👇 Solo dibuja usando los colores ya guardados
function dibujarColores() {
    galeria.innerHTML = "";
    coloresActuales.forEach((color, i) => {
        const swatch = crearswatch(color.hsl, color.hex, "Color " + (i + 1));
        galeria.appendChild(swatch);
    });
}

const boton = document.getElementById("generar");
const selector = document.getElementById("cantidad");
const cd = document.getElementById("codigo");

boton.addEventListener("click", function() {
    generarColores(Number(selector.value)); // genera colores NUEVOS
});

selector.addEventListener("change", function() {
    generarColores(Number(selector.value)); // cambia cantidad => nuevos colores
});

cd.addEventListener("change", function() {
    dibujarColores(); // 👈 solo cambia HSL/HEX, MISMOS colores
});

generarColores(Number(selector.value));