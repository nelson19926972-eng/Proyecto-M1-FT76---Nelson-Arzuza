
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

generarColores(Number(selector.value));

