import { Router } from "@vaadin/router";
import { state } from "../../state";

class MisDatos extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    if (state.getState().currentUser.email == "") {
      Router.go("/");
      return;
    }

    // HEADER
    const headerEl = document.createElement("custom-header");
    this.appendChild(headerEl);

    // CONTAINER
    const misDatosContainerEl = document.createElement("div");
    misDatosContainerEl.classList.add("mis-datos-container");
    this.appendChild(misDatosContainerEl);

    // TITULO
    const titleContainer = document.createElement("div");
    titleContainer.className = "title-container";
    titleContainer.innerHTML = `
    <h1 class="title">Mis datos</h1>
    `;
    misDatosContainerEl.appendChild(titleContainer);

    // BODY
    const misDatosFormContEl = document.createElement("form");
    misDatosContainerEl.appendChild(misDatosFormContEl);

    misDatosFormContEl.classList.add("mis-datos-container__form");
    misDatosFormContEl.innerHTML = `
    <label>
      EMAIL</br>
      <input name="email" class="email-input" type="text" disabled value="${
        state.getState().currentUser.email
      }" />
    </label>
    <label>
      NOMBRE</br>
      <input name="nombre" class="email-input" type="text" value="${
        state.getState().currentUser.nombre
      }" />
    </label>
    <label>
      CONTRASEÑA</br>
      <input type="password" name="password" />
    </label>
    <label>
      REPETIR CONTRASEÑA</br>
      <input type="password" name="passwordConfirmation" />
    </label>
    <button class="save-password-btn">Guardar</button>
    `;

    misDatosFormContEl.addEventListener("submit", (event: any) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const value = Object.fromEntries(data.entries());

      if (!value.password || !value.passwordConfirmation) {
        window.alert("Debes ingresar una constraseña");
        return;
      }

      if (value.password != value.passwordConfirmation) {
        window.alert("Las contraseñas no coinciden");
        return;
      }

      if (!value.nombre) {
        window.alert("El nombre no puede quedar vacio");
        return;
      }

      fetch(process.env.API_BASE_URL + "/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: value.nombre,
          password: value.password,
          email: state.getState().currentUser.email,
        }),
      })
        .then((res) => {
          res.json().then(async (data) => {
            state.signIn();
            state.setName(data.user.fullName);
            state.setId(data.user.id);

            const authData = await fetch(
              process.env.API_BASE_URL + "/auth/token",
              {
                headers: {
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                  password: value.password,
                  email: state.getState().currentUser.email,
                }),
              }
            ).then((res) => res.json());
            state.setToken(authData.token);

            Router.go("/");
            window.alert(data.mensaje);
          });
        })
        .catch((res) => {
          console.log(res);
        });
    });

    // CSS
    const style = document.createElement("style");
    style.innerHTML = `
      .mis-datos-container {
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
      .mis-datos-container__form {
        display: grid;
        justify-content: center;
        gap: 24px;
      }
      .mis-datos-container__form label {
        max-width: 326px;
        font-size: 16px;
        font-weight: 500;
        display: grid; 
      }
      .mis-datos-container__form label a {
        justify-self: center;
        text-decoration-line: underline;
        line-height: 24px;
        color: #40AFFF;
      }
      .mis-datos-container__form input {
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
      .mis-datos-container__form button {
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
    misDatosContainerEl.appendChild(style);
  }
}

customElements.define("custom-mis-datos", MisDatos);
