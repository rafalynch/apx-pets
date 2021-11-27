import { Router } from "@vaadin/router";

const outlet = document.querySelector(".root");
const router = new Router(outlet);
router.setRoutes([
  { path: "/home", component: "custom-home" },
  { path: "/", redirect: "/home" },
  { path: "/permisos", component: "custom-permisos" },
  { path: "/ingresar", component: "custom-ingresar" },
  { path: "/contrasena", component: "custom-contraseña" },
  { path: "/mis-datos", component: "custom-mis-datos" },
  { path: "/reportar", component: "custom-reportar" },
  { path: "/mascotas-reportadas", component: "custom-mascotas-reportadas" },
  { path: "/editar-mascota", component: "custom-editar-mascota" },
  { path: "/logout", redirect: "/ingresar" },
]);
