import { Router } from "@vaadin/router";
import { state } from "../../state";
import * as isemail from "isemail";

class Ingresar extends HTMLElement {
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
    const ingresarContainerEl = document.createElement("div");
    ingresarContainerEl.classList.add("ingresar-container");

    // TITULO
    const titleContainer = document.createElement("div");
    titleContainer.className = "title-container";
    titleContainer.innerHTML = `
      <h1 class="title">Ingresar</h1>
    `;
    ingresarContainerEl.appendChild(titleContainer);

    // BODY
    const ingresarFormContEl = document.createElement("form");
    ingresarFormContEl.classList.add("ingresar-container__form");
    ingresarFormContEl.innerHTML = `
    <label>
      EMAIL</br>
      <input name="email" type="text" />
    </label>
    <button type="submit">Siguiente</button>
    `;
    ingresarContainerEl.appendChild(ingresarFormContEl);

    ingresarFormContEl.addEventListener("submit", (event: any) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const value = Object.fromEntries(data.entries());

      if (!isemail.validate(value.email as string)) {
        window.alert("No es un mail valido");
        return;
      }

      // Mask
      const mask = document.createElement("div");
      mask.style.cssText = `top: 0; position: fixed; cursor: wait; z-index: 999; height: 100vh; width: 100vw;`;
      this.appendChild(mask);

      state.setCurrentMail(value.email);

      fetch(process.env.API_BASE_URL + "/auth/" + value.email).then((res) => {
        res.json().then((data) => {
          if (data) {
            Router.go("/contrasena");
          } else {
            Router.go("/mis-datos");
          }
        });
      });
    });

    // CSS
    const style = document.createElement("style");
    style.innerHTML = `
      .ingresar-container {
        display: grid;
        justify-content: center;
      }
      .title-container {
        max-width: 326px;
        margin: 33px auto;
        justify-self: center;
      }
      .title {
        font-size: 40px;
        margin: 0;
      }
      .ingresar-container__form {
        display: grid;
        justify-content: center;
        gap: 24px;
      }
      .ingresar-container__form label {
        max-width: 326px;
        text-align: left;
        font-size: 16px;
        font-weight: 500; 
      }
      .ingresar-container__form input {
        width: 326px;
        height: 50px;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        border: 2px solid #000000;
        border-radius: 4px;
        font-size: 16px;
        font-family: "Poppins"; 
      }
      .ingresar-container__form button {
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
    ingresarContainerEl.appendChild(style);

    this.appendChild(ingresarContainerEl);
  }
}

customElements.define("custom-ingresar", Ingresar);
