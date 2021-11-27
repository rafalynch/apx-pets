import { Router } from "@vaadin/router";
import { state } from "../../state";

class Header extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    // CONTAINER
    const headerContainerEl = document.createElement("div");
    this.appendChild(headerContainerEl);
    headerContainerEl.classList.add("header-container");

    // Current State
    const currentState = state.getState();

    // LOGO
    const logoEl = document.createElement("img");
    logoEl.setAttribute("src", require("url:../../images/logo_header.png"));
    logoEl.setAttribute("alt", "logo");
    logoEl.classList.add("logo-img");
    headerContainerEl.appendChild(logoEl);
    logoEl.addEventListener("click", () => {
      if (!location.href.includes("/permisos")) {
        Router.go("/");
      }
    });

    // MENU
    const menuEl = document.createElement("ul");
    menuEl.classList.add("menu");
    headerContainerEl.appendChild(menuEl);

    // BURGER
    const burgerEl = document.createElement("img");
    burgerEl.setAttribute("src", require("url:../../images/menu.png"));
    burgerEl.setAttribute("alt", "menu");
    burgerEl.classList.add("menu-img");
    headerContainerEl.appendChild(burgerEl);

    burgerEl.addEventListener("click", () => {
      // toggle nav-bar
      menuEl.classList.toggle("nav-active");
    });

    // Links de navegacion.
    menuEl.innerHTML = `
    <li><a class="nav-link datos">Mis datos</a></li>
    <li><a class="nav-link mascotas">Mis mascotas reportadas</a></li>
    <li><a class="nav-link reportar">Reportar mascota</a></li>
    `;

    // Ingresar/Cerrar Sesion.
    const navSessionEl = document.createElement("li");
    menuEl.appendChild(navSessionEl);
    navSessionEl.classList.add("nav-session");

    if (currentState.signedIn) {
      // Si hay una sesion abierta. Se muestra el email y la opcion de cerrar sesion.
      navSessionEl.innerHTML = `
        <div class="nav-session__email">${currentState.currentUser.email}</div>
      `;

      const cerrarSesionBtnEl = document.createElement("div");
      cerrarSesionBtnEl.className = "nav-session__close";
      cerrarSesionBtnEl.innerHTML = `<div class="nav-session__close">CERRAR SESION</div>`;
      navSessionEl.appendChild(cerrarSesionBtnEl);
      cerrarSesionBtnEl.addEventListener("click", () => {
        state.logOut();
        Router.go("/logout");
        menuEl.classList.toggle("nav-active");
      });
    } else {
      // Si no hay ninguna sesion abierta se muestra la opcion de ingresar.
      navSessionEl.innerHTML = `
      <div class="nav-session__in">INGRESAR</div>
      `;
      navSessionEl.addEventListener("click", () => {
        Router.go("/ingresar");
        menuEl.classList.toggle("nav-active");
      });
    }

    // LINKS EVENTS
    const navLinks = document.querySelectorAll(".nav-link.datos");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuEl.classList.toggle("nav-active");
        if (!currentState.signedIn) {
          Router.go("/ingresar");
        } else {
          Router.go("/mis-datos");
        }
      });
    });

    const navLinkReportarEl = document.querySelectorAll(".nav-link.reportar");
    navLinkReportarEl.forEach((link) => {
      link.addEventListener("click", () => {
        menuEl.classList.toggle("nav-active");
        if (!currentState.signedIn) {
          Router.go("/ingresar");
        } else {
          Router.go("/reportar");
        }
      });
    });

    const navLinkMascotasEl = document.querySelectorAll(".nav-link.mascotas");
    navLinkMascotasEl.forEach((link) => {
      link.addEventListener("click", () => {
        menuEl.classList.toggle("nav-active");
        if (!currentState.signedIn) {
          Router.go("/ingresar");
        } else {
          Router.go("/mascotas-reportadas");
        }
      });
    });

    // CSS
    const style = document.createElement("style");
    style.innerHTML = `
      .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: #FF6868;
        height: 10%;
      }
      .logo-img {
        height: 34px;
        widht: 40px;
        z-index: 3;
        cursor: pointer;
      }
      .menu-img {
        height: 34px;
        widht: 40px;
        z-index: 3;
        cursor: pointer;
      }

      .menu {
        position: fixed;
        display: grid;
        grid-template-rows: 1fr 1fr 1fr 2fr;
        margin: 0;
        right: 0px;
        height: 100%;
        top: 0%;
        width: 100%;
        background-color: lightblue;
        align-items: center;
        justify-items: center;
        gap: 25px;
        transform: translateY(300%);
        font-size: 15px;
        z-index: 2;
        text-decoration: none;
        font-size: 24px;
        padding: 100px 0 40px 0;
        text-align: center;
      }
      .menu li {
        list-style: none;
      }
      .nav-link {
        font-weight: 700;
        cursor: pointer;
      }
      .nav-link:hover {
        text-decoration: underline;
        text-underline-position: under;
      }
      .menu a {
        text-decoration: none;
        color: black;
      }
      .nav-active {
        transform: translateY(0%);
      }
      .nav-session p{
        font-size: 24px;
      }
      .nav-session__email{

      }
      .nav-session__close, .nav-session__in {
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #C6558B;
        text-decoration-line: underline;
        cursor: pointer;
      }
  `;
    headerContainerEl.appendChild(style);
  }
}

customElements.define("custom-header", Header);
