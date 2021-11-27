import { Router } from "@vaadin/router";
import { state } from "../../state";

class Home extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    if (!state.getState().permisos) {
      Router.go("/permisos");
      return;
    }

    // HEADER
    const headerEl = document.createElement("custom-header");
    this.appendChild(headerEl);

    // HOME
    const homeContainerEl = document.createElement("div");
    homeContainerEl.classList.add("home-container");

    // TITULO
    const titleContainer = document.createElement("div");
    titleContainer.className = "title-container";
    titleContainer.innerHTML = `
      <h1 class="title">Mascotas perdidas cerca tuyo</h1>
    `;
    homeContainerEl.appendChild(titleContainer);

    // CARDS
    const cardsContainer = document.createElement("div");
    cardsContainer.classList.add("card-container");
    homeContainerEl.appendChild(cardsContainer);

    // BUSQUEDA DE PETS CERCANAS
    fetch(
      process.env.API_BASE_URL +
        "/pets-cerca-de?lat=" +
        state.getState().currentLocation.lat +
        "&lng=" +
        state.getState().currentLocation.lng
    )
      .then((res) => {
        res
          .json()
          .then((res) => {
            res.hits.forEach((hit) => {
              // Por cada uno usar el id para encontrarlo y appendearlo.
              fetch(
                process.env.API_BASE_URL + "/pets/" + parseInt(hit.objectID)
              ).then((res) => {
                res.json().then((petHit) => {
                  // append
                  if (!petHit.isFound) {
                    const card = document.createElement("custom-pet-card");
                    card.setAttribute("nombre", petHit.name);
                    card.setAttribute("city", petHit.city);
                    card.setAttribute("region", petHit.region);
                    card.setAttribute("src", petHit.imageUrl);
                    card.setAttribute("contact", petHit.contact);
                    cardsContainer.appendChild(card);
                  }
                });
              });
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    // CSS
    const style = document.createElement("style");
    style.innerHTML = `
      .home-container {
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
  `;
    homeContainerEl.appendChild(style);

    this.appendChild(homeContainerEl);
  }
}

customElements.define("custom-home", Home);
