import { state } from "../../state";

class MascotasReportadas extends HTMLElement {
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

    // HOME
    const mascotasReportadasContainerEl = document.createElement("div");
    mascotasReportadasContainerEl.classList.add("mascotasReportadas-container");

    // TITULO
    const titleContainer = document.createElement("div");
    titleContainer.className = "title-container";
    titleContainer.innerHTML = `
      <h1 class="title">Tus mascotas reportadas</h1>
    `;
    mascotasReportadasContainerEl.appendChild(titleContainer);

    // CARDS
    const cardsContainer = document.createElement("div");
    cardsContainer.classList.add("card-container");
    mascotasReportadasContainerEl.appendChild(cardsContainer);
    if (state.getState().signedIn) {
      fetch(process.env.API_BASE_URL + "/me/pets", {
        headers: {
          Authorization: "bearer " + state.getState().currentUser.token,
        },
      })
        .then((res) => {
          res.json().then((pets) => {
            if (!pets[0]) {
              const mensaje = document.createElement("h3");
              mensaje.innerHTML = "Aun no reportaste mascotas perdidas";
              mensaje.classList.add("mensaje");
              mascotasReportadasContainerEl.appendChild(mensaje);
              return;
            }
            pets.forEach((pet) => {
              const card = document.createElement("custom-pet-card");
              card.setAttribute("property", "own");
              card.setAttribute("nombre", pet.name as string);
              card.setAttribute("city", pet.city);
              card.setAttribute("region", pet.region);
              card.setAttribute("src", pet.imageUrl);
              card.setAttribute("contact", pet.contact);
              card.setAttribute("petId", pet.id);
              cardsContainer.appendChild(card);
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // CSS
    const style = document.createElement("style");
    style.innerHTML = `
      .mascotasReportadas-container {
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
      .card-container{
        display: grid;
        gap: 20px;
      }
      .mensaje {
        font-family: Poppins;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        text-transform: uppercase;
        width: 292px;
        height: 48px;
      }
  `;
    mascotasReportadasContainerEl.appendChild(style);

    this.appendChild(mascotasReportadasContainerEl);
  }
}

customElements.define("custom-mascotas-reportadas", MascotasReportadas);
