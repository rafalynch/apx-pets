import { Router } from "@vaadin/router";
import { state } from "../../state";

class Contraseña extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    if (state.getState().signedIn || state.getState().currentUser.email == "") {
      Router.go("/home");
      return;
    }

    // HEADER
    const headerEl = document.createElement("custom-header");
    this.appendChild(headerEl);

    // CONTAINER
    const contraseñaContainerEl = document.createElement("div");
    contraseñaContainerEl.classList.add("contraseña-container");

    // TITULO
    const titleContainer = document.createElement("div");
    titleContainer.className = "title-container";
    titleContainer.innerHTML = `
      <h1 class="title">Ingresar</h1>
    `;
    contraseñaContainerEl.appendChild(titleContainer);

    // BODY
    const contraseñaBodyContEl = document.createElement("form");
    contraseñaBodyContEl.classList.add("contraseña-container__body");
    contraseñaBodyContEl.innerHTML = `
    <label>
      CONTRASEÑA</br>
      <input type="password" name="password" />
      <a>OLVIDÉ MI CONTRASEÑA</a>
    </label>
    <button>Siguiente</button>
    `;
    contraseñaContainerEl.appendChild(contraseñaBodyContEl);

    contraseñaBodyContEl.addEventListener("submit", (event: any) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const value = Object.fromEntries(data.entries());

      fetch(process.env.API_BASE_URL + "/auth/token", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          password: value.password,
          email: state.getState().currentUser.email,
        }),
      }).then((res) => {
        if (res.status == 200) {
          state.signIn();

          res.json().then(async (data) => {
            state.setToken(data.token);
            const user = await fetch(process.env.API_BASE_URL + "/me", {
              headers: {
                Authorization: "bearer " + data.token,
              },
            });

            user.json().then((data) => {
              const { fullName, id } = data;
              state.setName(fullName);
              state.setId(id);
              Router.go("/home");
            });
          });
        } else {
          window.alert("Contraseña incorrecta");
        }
      });
    });

    // CSS
    const style = document.createElement("style");
    style.innerHTML = `
      .contraseña-container {
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
      .contraseña-container__body {
        display: grid;
        justify-content: center;
        gap: 24px;
      }
      .contraseña-container__body label {
        max-width: 326px;
        font-size: 16px;
        font-weight: 500;
        display: grid; 
      }
      .contraseña-container__body label a {
        justify-self: center;
        text-decoration-line: underline;
        line-height: 24px;
        color: #40AFFF;
      }
      .contraseña-container__body input {
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
      .contraseña-container__body button {
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
    contraseñaContainerEl.appendChild(style);

    this.appendChild(contraseñaContainerEl);
  }
}

customElements.define("custom-contraseña", Contraseña);
