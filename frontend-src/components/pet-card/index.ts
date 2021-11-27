import { Router, RouterLocation } from "@vaadin/router";
import { state } from "../../state";

class PetCard extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    const petCardContainerEl = document.createElement("div");
    this.appendChild(petCardContainerEl);
    petCardContainerEl.classList.add("pet-card-container");

    // FOTO
    const imagePetEl = document.createElement("img");
    petCardContainerEl.appendChild(imagePetEl);
    imagePetEl.classList.add("image-pet");
    imagePetEl.setAttribute("src", this.getAttribute("src"));
    imagePetEl.setAttribute("alt", this.getAttribute("nombre"));

    // DATOS
    const datosPetEl = document.createElement("div");
    petCardContainerEl.appendChild(datosPetEl);
    datosPetEl.classList.add("datos-pet");

    // Titulo y lugar
    const tituloYLugarContEl = document.createElement("div");
    tituloYLugarContEl.classList.add("titulo-y-lugar-cont");
    datosPetEl.appendChild(tituloYLugarContEl);
    // Titulo
    const tituloPet = document.createElement("h2");
    tituloPet.classList.add("datos-pet__titulo");
    tituloYLugarContEl.appendChild(tituloPet);
    tituloPet.innerHTML = `${this.getAttribute("nombre")}`;
    // Lugar
    const locationPet = document.createElement("h4");
    locationPet.classList.add("datos-pet__location");
    tituloYLugarContEl.appendChild(locationPet);
    locationPet.innerHTML = `${this.getAttribute("city")}, ${this.getAttribute(
      "region"
    )}`;

    // Editar/Reportar
    const actionPetEl = document.createElement("div");
    actionPetEl.classList.add("action-pet");
    const reportBtn = document.createElement("a");
    const editImgEl = document.createElement("img");
    reportBtn.innerHTML = "Reportar mascota";
    datosPetEl.appendChild(actionPetEl);
    if (this.getAttribute("property") == "own") {
      editImgEl.setAttribute("src", require("url:../../images/edit.png"));
      editImgEl.setAttribute("alt", "edit");
      editImgEl.classList.add("edit-img");
      actionPetEl.appendChild(editImgEl);
    } else {
      actionPetEl.appendChild(reportBtn);
    }

    // EDITAR
    editImgEl.addEventListener("click", () => {
      state.setEditPetId(this.getAttribute("petId"));
      Router.go("editar-mascota");
    });

    // REPORTAR MODAL
    reportBtn.addEventListener("click", () => {
      // Mask
      const mask = document.createElement("div");
      document.body.appendChild(mask);
      mask.style.cssText = `
        top: 0;
        position: fixed;
        z-index: 90;
        height: 100vh;
        width: 100vw;
        background-color:black;
        opacity: 0.1;
      `;

      // Modal
      const modal = document.createElement("div");
      document.body.appendChild(modal);
      modal.style.cssText = `
        position: fixed;
        z-index: 100;
        height: 80vh; 
        width: 80vw;
        border-radius: 4px;
        background-color: white;
        top: 10vh;
        bottom: 10vh;
        left: 10vw;
        right: 10vw;
        display: grid;
        grid-template-rows: 1fr 2fr 15fr;
      `;
      const modalExitEl = document.createElement("img");
      modalExitEl.setAttribute("src", require("url:../../images/exit.svg"));
      modalExitEl.classList.add("modal-exit");
      modal.appendChild(modalExitEl);
      const modalTitleEl = document.createElement("h1");
      modalTitleEl.classList.add("modal-title");
      modal.appendChild(modalTitleEl);
      modalTitleEl.innerHTML = `Reportar info de ${this.getAttribute(
        "nombre"
      )}`;

      const modalFormEl = document.createElement("form");
      modalFormEl.classList.add("modal-form");
      modal.appendChild(modalFormEl);

      modalFormEl.innerHTML = `
          <label>
            TU NOMBRE </br>
            <input name="nombre" type="text" />
          </label>
          <label>
            TU TELEFONO </br>
            <input name="telefono" type="text" />
          </label>
          <label>
            DONDE LO VISTE? </br>
            <textarea name="info"></textarea>
          </label>
          <button>Enviar</button>
      `;

      // MODAL EVENT

      modalFormEl.addEventListener("submit", (e: any) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const value = Object.fromEntries(data.entries());

        const reqObj = {
          name: value.nombre,
          phoneNumber: value.telefono,
          description: value.info,
          petId: "1",
          contact: this.getAttribute("contact"),
        };

        fetch(process.env.API_BASE_URL + "/report", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(reqObj),
        }).then((res) => {
          location.reload();
          window.alert(
            "Mascota reportada. Le enviamos tus datos al dueño y para que se comunique con vos."
          );
        });
      });

      modalExitEl.addEventListener("click", volver);
      mask.addEventListener("click", volver);

      function volver() {
        modal.remove();
        mask.remove();
        document.body.style.overflow = "initial";
      }
    });

    // CSS
    const style = document.createElement("style");
    petCardContainerEl.appendChild(style);
    style.innerHTML = `
      .pet-card-container {
        height: 250px;
        width: 331px;
        border: 2px solid #000000;
        border-radius: 4px;
        display: grid;
        margin-bottom: 15px;
        ;
      }
      .image-pet {
        place-self: center;
        max-width:100%;
        max-height:147px;
        object-fit: contain;
      }
      .datos-pet{
        padding: 10px;
        display: flex;
        justify-content: space-between;
      }
      .datos-pet__titulo{
        margin: 0;
      }
      .datos-pet__location{
        margin: 0;
        font-size: 80%;
      }
      .action-pet{
        display: grid;
        align-content: center;
      }
      .action-pet a {
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #3E91DD;
        text-decoration-line: underline;
        cursor: pointer;
        max-width: 100px;
        text-align: right;
      }

      .modal-exit {
        margin: 12px;
        justify-self: right;
      }
      .modal-title {
        font-size: 5vh;
        margin: 0;
        width: 60vw;
        margin: auto;
      }
      .modal-form {
        display: grid;
        justify-content: center;
        margin: 0;
        margin-top: 5px;
        align-content: space-evenly;
      }
      .modal-form label {
        width: 60vw;
        text-align: left;
        font-size: 14px;
        font-weight: 500; 
      }
      .modal-form input {
        width: 100%;
        height: 5vh;
        text-align: left;
        font-size: 14px;
        font-weight: 500;
        border: 2px solid #000000;
        border-radius: 4px;
        font-family: "Poppins"; 
      }
      .modal-form button {
        width: 100%;
        background: #FF9DF5;
        border-radius: 4px;
        height: 5vh;
        font-family: "Poppins";
        font-size: 14px;
        font-weight: 700;
        border-style: none; 
      }
      .modal-form textarea {
        width: 100%;
        height: 15vh;
        text-align: left;
        font-size: 14px;
        font-weight: 500;
        border: 2px solid #000000;
        border-radius: 4px;
        font-family: "Poppins"; 
        resize: none;
      }

      
  `;
  }
}

customElements.define("custom-pet-card", PetCard);
