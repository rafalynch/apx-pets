import { Router, RouterLocation } from "@vaadin/router";
import { state } from "../../state";

class Permisos extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    // HEADER
    const headerEl = document.createElement("custom-header");
    this.appendChild(headerEl);

    // CONTAINER
    const permisosContainerEl = document.createElement("div");
    permisosContainerEl.classList.add("permisos-container");

    // TITULO
    const titleContainer = document.createElement("div");
    titleContainer.className = "title-container";
    titleContainer.innerHTML = `
    <h1 class="title">Mascotas perdidas cerca tuyo</h1>
    `;
    permisosContainerEl.appendChild(titleContainer);

    // BODY
    const permisosBodyContEl = document.createElement("div");
    this.appendChild(permisosContainerEl);

    permisosBodyContEl.classList.add("permisos-container__body");
    permisosBodyContEl.innerHTML = `
    <p>PARA VER LAS MASCOTAS REPORTADAS CERCA TUYO NECESITAMOS PERMISO PARA CONOCER TU UBICACION</p>
    <button class="permisos-btn">Dar mi ubicacion</button>
    `;
    permisosContainerEl.appendChild(permisosBodyContEl);

    document.querySelector(".permisos-btn").addEventListener("click", () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        state.permitirUbicacion(position);
      });
      Router.go("/home");
    });

    // CSS
    const style = document.createElement("style");
    style.innerHTML = `
      .permisos-container {
        display: grid;
        justify-content: center;
      }
      .title-container {
        max-width: 326px;
        margin: 33px auto;
        justify-self: start;
      }
      .title {
        font-size: 40px;
        margin: 0;
      }
      .permisos-container__body {
        display: grid;
        justify-content: center;
      }
      .permisos-container__body p {
        max-width: 326px;
        text-align: center;
        font-size: 16px;
        font-weight: 500; 
      }
      .permisos-container__body button {
        background: #FF9DF5;
        border-radius: 4px;
        width: 326px;
        height: 50px;
        font-family: "Poppins";
        font-size: 16px;
        font-weight: 700;
        border-style: none; 
      }
  `;
    permisosContainerEl.appendChild(style);
  }
}

customElements.define("custom-permisos", Permisos);
