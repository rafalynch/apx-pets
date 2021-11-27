// PAGES
import "./router";
import "./pages/home";
import "./pages/permisos";
import "./pages/ingresar";
import "./pages/contrasena";
import "./pages/mis-datos";
import "./pages/reportar";
import "./pages/mascotas-reportadas";
import "./pages/editar-mascota";

// COMPONENTS
import "./components/header";
import "./components/pet-card";

import { Router } from "@vaadin/router";
import { state } from "./state";

const API_BASE_URL = process.env.API_BASE_URL;

state.init();

function goHome(state) {
  if (!state.signedIn) {
    Router.go("/");
  }
}

goHome(state.getState());

export { API_BASE_URL };
