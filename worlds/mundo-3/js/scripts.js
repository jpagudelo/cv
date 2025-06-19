// Previous code remains the same...

function animatedBanners() {
    const idBackground1 = document.getElementById("superServidor__fondoEscenario1");
    const idBackground2 = document.getElementById("superServidor__fondoEscenario2");
    const idHero = document.getElementById("superServidor__personaje");

    setTimeout(() => {
        idBackground1.classList.add("superServidor__fondoEscenario--ocultar");
        idBackground2.classList.add("superServidor__fondoEscenario--mostrar");
        idHero.classList.add("superServidor__personaje--cambio");
    }, 2000);
}

// Código dentro del iframe
function cerrarBackdrop() {
    window.parent.postMessage('closeBackdrop', '*');
}
