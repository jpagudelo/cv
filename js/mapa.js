//Constantes
const TOTAL_NUMBERS_WORLDS = 6;

//Variables alto header
var idHeader = document.getElementById("vuaHeader");
var idHome = document.getElementById("home");
var headerHeight;

//Variables backdrop
var classBackdrop = "backdrop";
var idBackdropIframe = "backdrop__iframe";
var classBackdropPreload = "backdrop__preload";
var attrDataHref = "[data-href]";
var classbtnCloseBackDrop = "backdrop__close";
var itemDataHref = document.querySelectorAll(attrDataHref); //enlaces con data-href
var btnCloseBackDrop = document.getElementsByClassName(classbtnCloseBackDrop); //boton cerrar backdrop

//Variables mapa
var idMap = document.getElementById("map");
var mapWidth;
var zoomFactor = 1.2;
var zoomInMax = 2000;
var zoomOutMax = 360;

//Variables mundos
var hero = document.getElementById("hero");
var lockedWorlds = document.getElementsByClassName("world--locked");
var realWorldNumber;
var nextWorldNumber;

var statusWorld = localStorage.getItem("number_world_audifarma");
if (statusWorld) {
   realWorldNumber = statusWorld;
} else {
   realWorldNumber = 1;
}

var realWorld;
var nextWorld;

//Variables progressbar
var idProgressbar = document.getElementById("progressbar");



document.addEventListener("DOMContentLoaded", init());

function init() {
   try {
      clickCloseSplashInicio();
      
      getWidthMap();
      document.getElementById("zoom__in").addEventListener("click", zoomIn);
      document.getElementById("zoom__out").addEventListener("click", zoomOut);
      
      //eventos
      if (itemDataHref) {
         addEventClick(itemDataHref, openinDataHref); //clic en enlace data-href
      }
      if (btnCloseBackDrop) {
         addEventClick(btnCloseBackDrop, closeBackdrop); //clic en cerra backdrop
      }
      
      blockWorlds();
      addEventClick(document.getElementsByClassName("world"), variablesActivateNextWorld);
      unlockWorldsAccordingProgress();
      clickCloseSplashFinal();

   } catch (error) {
      console.log(error);
   }
}

//Función encargada de poner la url en el iframe
function putUrlInIframe() {
   var url = this.attr('data-target');
   $('.js-backdrop__iframe').prop('src', url);
}

//Función responsable de enlazar eventos
function addEventClick(element, functions) {
   for (let i = 0; i < element.length; i++) {
      element[i].addEventListener("click", functions);
      element[i].addEventListener("touchstart", functions);
   }
}

//funcion responsable de abrir URL 
function openinDataHref() {
   var openIn = this.getAttribute("data-openin");
   var url = this.getAttribute("data-href");
   var elemento = this;

   openInto(elemento, url, openIn);
}

//funcion responsable de abrir la URL en metodo correspondiente
function openInto(elemento, url, openIn) {
   switch (openIn) {
      case '_backdrop':
         openintoBackdrop(url);
         break;
   }
}

//funcion responsable de abrir la url en un Backdrop
function openintoBackdrop(url) {
   document.getElementById(idBackdropIframe).setAttribute("src", url);
   document.getElementById(idBackdropIframe).addEventListener("load", function () {
      var preload = document.getElementsByClassName(classBackdropPreload)[0];
      preload.classList.add('backdrop__preload--invisible');
   });
   document.getElementsByClassName(classBackdrop)[0].classList.add("backdrop--in");
   document.getElementsByTagName('body')[0].style.overflow = "hidden";
}

//funcion que cierra el backdrop
function closeBackdrop() {
   document.getElementsByClassName(classBackdrop)[0].classList.remove("backdrop--in");
   setTimeout(function () {
      document.getElementsByClassName(classBackdropPreload)[0].classList.remove('backdrop__preload--invisible');
      document.getElementById(idBackdropIframe).setAttribute("src", "");
   }, 400);
   document.getElementsByTagName('body')[0].style.overflow = "auto";
   localStorage.setItem("number_world_audifarma", realWorldNumber);
   console.log('realWorldNumber ', realWorldNumber);
   if (realWorldNumber == TOTAL_NUMBERS_WORLDS) {
      earnBadge();
      setTimeout(() => {
         showSplashFianl();
      }, 1000);
   }
}

//Escucha todos los mensajes enviados por los iframes
window.addEventListener('message', function (event) {
   //Cierra el backdrop
   if (event.data.hasOwnProperty("closeBackdrop")) {
      closeBackdrop();
   }
});


//Función encargada de obtener el ancho del mapa
function getWidthMap() {
   mapWidth = idMap.getBoundingClientRect().width;
}

//Función encargada de realizar el zoom in
function zoomIn() {
   getWidthMap();
   if (mapWidth < zoomInMax) {
      idMap.style.width = mapWidth * zoomFactor + "px";
   }
}

//Función encargada de realizar el zoom out
function zoomOut() {
   getWidthMap();
   if (mapWidth > zoomOutMax) {
      idMap.style.width = mapWidth / zoomFactor + "px";
   }
}


//Función encargada de quitar el evento de clic de los mundos bloqueados
function blockWorlds() {
   for (let i = 0; i < lockedWorlds.length; i++) {
      lockedWorlds[i].removeEventListener("click", openinDataHref);
      lockedWorlds[i].removeEventListener("touchstart", openinDataHref);
   }
}


function unlockWorldsAccordingProgress() {
   for (let i = 1; i < realWorldNumber; i++) {
      nextWorldNumber = i + 1;
      realWorld = document.getElementById("world--" + i);
      nextWorld = document.getElementById("world--" + nextWorldNumber);

      transformationHero();
      teleportationHero();
      //progressbarAdvances();
      badges(i);
      unlockNextWorld();
   }
}


//Función encargada de definir las variables para activar el siguiente mundo
function variablesActivateNextWorld() {
   const worlds = document.querySelectorAll('.world.world--active');
   realWorldNumber = parseInt(this.getAttribute("data-world"));
   nextWorldNumber = realWorldNumber + 1;
   realWorld = document.getElementById("world--" + realWorldNumber);
   nextWorld = document.getElementById("world--" + nextWorldNumber);
   setTimeout(() => {
      realWorld.classList.remove('world--active');
   }, 500);
}


//Función encargada de transforma el personaje
function transformationHero() {
   hero.classList.remove("hero--teleportation");
   hero.classList.remove("hero--" + realWorldNumber);
   hero.classList.add("hero--" + nextWorldNumber);
}

//Función encargada de teletransportar al personaje
function teleportationHero() {
   hero.classList.add("hero--teleportation");
   setTimeout(() => {
      hero.classList.remove("hero--world" + realWorldNumber);
      hero.classList.add("hero--world" + nextWorldNumber);
   }, 600);
}

//Función encargada de desbloquear el siguiente mundo
function unlockNextWorld() {
   realWorld.classList.remove("world--active");
   realWorld.classList.remove("world--unlocked");
   nextWorld.classList.remove("world--locked");
   nextWorld.classList.add("world--unlocked");
   nextWorld.classList.add("world--active");

   nextWorld.addEventListener("click", openinDataHref);
   nextWorld.addEventListener("touchstart", openinDataHref);
}

//Función encargada de hacer que la barra de progreso avance
// function progressbarAdvances() {
//    idProgressbar.classList.remove("progressbar--" + realWorldNumber);
//    idProgressbar.classList.add("progressbar--" + nextWorldNumber);
// }

//Función encargada de cargar los badges cuando se inciia el mapa
function badges(badgeNumber) {
   document.getElementById("badge--" + badgeNumber).setAttribute("src", "img/p-m" + badgeNumber + ".png");
}

function earnBadge() {
   document.getElementById("badge--" + realWorldNumber).setAttribute("src", "img/p-m" + realWorldNumber + ".png");
   document.getElementById("badge--" + realWorldNumber).classList.add("badge__image--win");
}





//Make the DIV element draggagle:
dragElement(document.getElementById("map"));

function dragElement(elmnt) {
   var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
   if (document.getElementById(elmnt.id + "header")) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
      document.getElementById(elmnt.id + "header").ontouchstart = touchStart;
   } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
      elmnt.ontouchstart = touchStart;
   }

   function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
   }

   function touchStart(e) {
      // e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;

      document.ontouchend = closeDragElement;
      // call a function whenever the cursor moves:
      document.ontouchmove = elementTouchDrag;
   }

   function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

      elmnt.style.cursor = "grabbing";
   }

   function elementTouchDrag(e) {
      // e = e || window.event;
      // e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.touches[0].clientX;
      pos2 = pos4 - e.touches[0].clientY;
      pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

      elmnt.style.cursor = "grabbing";
   }

   function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.ontouchend = null;
      document.onmousemove = null;
      document.ontouchmove = null;

      elmnt.style.cursor = "grab";
   }
}

//Función encargada del clic para cerrar el splash de inicio
function clickCloseSplashInicio() {
   document.getElementById("btnCloseSplashInicio").addEventListener("click", closeSplashInicio);
}

//Función encargada de cerrar el splash de inicio
function closeSplashInicio() {
   document.getElementById("splashInicio").classList.add("hide");
   setTimeout(() => {
      document.getElementById("splashInicio").classList.add("dNone");
   }, 60);
}

//Función encargada del clic para cerrar el splash de inicio
function clickCloseSplashFinal() {
   document.getElementById("btnCloseSplashFinal").addEventListener("click", closeSplashFinal);
}

//Función encargada de mostrar el splash final
function showSplashFianl() {
   document.getElementById("splashFinal").classList.remove("dNone");
   document.getElementById("splashFinal").classList.add("show");
}

//Función encargada de cerrar el splash de final
function closeSplashFinal() {
   document.getElementById("splashFinal").classList.remove("show");
   document.getElementById("splashFinal").classList.add("hide");
   setTimeout(() => {
      document.getElementById("splashFinal").classList.add("dNone");
   }, 600);
}
