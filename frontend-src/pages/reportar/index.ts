import { Router } from "@vaadin/router";
import { state } from "../../state";
import * as mapboxgl from "mapbox-gl";
import { Marker } from "mapbox-gl";
import * as MapboxClient from "mapbox";
import { Dropzone } from "dropzone";

class Reportar extends HTMLElement {
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
    const reportarContainerEl = document.createElement("div");
    reportarContainerEl.classList.add("ingresar-container");
    this.appendChild(reportarContainerEl);

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
            justify-items: center;
            gap: 24px;
            margin-bottom: 20px;
          }
          .ingresar-container__form label {
            max-width: 326px;
            text-align: left;
            font-size: 16px;
            font-weight: 500; 
          }
          input {
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
          button {
            background: #FF9DF5;
            border-radius: 4px;
            width: 326px;
            height: 50px;
            font-family: "Poppins";
            font-size: 16px;
            font-weight: 700;
            border-style: none; 
          }
          .map-container{
            width: 326px;
            height: 250px;
            display: grid;
            justify-content: center;
          }
          .map-search-form{
            display: grid;
            justify-items: center;
            gap: 24px;
            margin: 0 0 10 0;
          }
          .search-description{
            font-size: 16px;
            line-height: 24px;
            text-transform: uppercase;
            width: 335px;
            padding-left: 4px;
          }
          button.cancel {
            background: #CDCDCD;
          }
          .dz-success-mark, .dz-error-mark, .dz-filename, .dz-size, .dz-progress {
            display:none;
          }
          .dropzone-btn {
            background: #97EA9F;
            border-radius: 4px;
            width: 326px;
            height: 50px;
            font-family: "Poppins";
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            padding: 1px 6px;
            text-align: center;
            align-items: center;
            display: grid;
          }
    
      `;
    reportarContainerEl.appendChild(style);

    // TITULO
    const titleContainer = document.createElement("div");
    titleContainer.className = "title-container";
    titleContainer.innerHTML = `
      <h1 class="title">Reportar mascota perdida</h1>
    `;
    reportarContainerEl.appendChild(titleContainer);

    // FORM
    const reportarFormContEl = document.createElement("form");
    reportarContainerEl.appendChild(reportarFormContEl);
    reportarFormContEl.classList.add("ingresar-container__form");
    reportarFormContEl.innerHTML = `
    <label>
    NOMBRE</br>
    <input name="name" type="text" />
    </label>
    `;

    // DROPZONE

    // Image data inputs container
    const imageData = document.createElement("label");
    reportarFormContEl.append(imageData);
    imageData.classList.add("image-data");
    imageData.style.display = "none";

    const templateImg = document.createElement("img");
    templateImg.classList.add("template-img");
    reportarFormContEl.appendChild(templateImg);
    templateImg.setAttribute(
      "src",
      require("url:../../images/dropzone-preview.png")
    );

    const dropzonePreviewEl = document.createElement("div");
    dropzonePreviewEl.classList.add("dropzone-preview");
    reportarFormContEl.appendChild(dropzonePreviewEl);

    const dropzoneEl = document.createElement("div");
    reportarFormContEl.appendChild(dropzoneEl);
    dropzoneEl.classList.add("my-dropzone");
    dropzoneEl.innerHTML = `
      <div class="dropzone-btn">agregar/modificar foto</div>
    `;

    const myDropzone = new Dropzone(".my-dropzone", {
      url: "/falsa",
      previewsContainer: ".dropzone-preview",
      maxFiles: 1,
      autoProcessQueue: false,
      maxFilesize: 2, // MB
      thumbnailWidth: 333,
      thumbnailHeight: 147,
      resizeWidth: 333,
      resizeHeight: 147,
      resizeMethod: "contain",
      thumbnailMethod: "contain",
      clickable: ".dropzone-btn",
    });

    myDropzone.on("thumbnail", function (file) {
      const img = document.querySelector(".template-img");
      img.setAttribute("style", "display: none");
      document.querySelector(".image-data").innerHTML = `
              <input type="text" name="dataURL" value="${file.dataURL}" />
            `;
    });

    myDropzone.on("maxfilesexceeded", function (file) {
      myDropzone.removeAllFiles();
      myDropzone.addFile(file);
    });

    // MAPBOX
    const mapContainer = document.createElement("div");
    mapContainer.setAttribute("id", "map-container");
    mapContainer.classList.add("map-container");
    reportarFormContEl.appendChild(mapContainer);

    const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const mapboxClient = new MapboxClient(MAPBOX_TOKEN);

    const map = new mapboxgl.Map({
      container: "map-container", // container ID
      style: "mapbox://styles/mapbox/streets-v8", // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });

    // location Data inputs container
    const locationData = document.createElement("label");
    reportarFormContEl.append(locationData);
    locationData.classList.add("location-data");
    locationData.style.display = "none";

    // BUSCADOR
    const mapSearch = document.createElement("form");
    reportarFormContEl.appendChild(mapSearch);
    mapSearch.classList.add("map-search-form");
    mapSearch.innerHTML = `
      <label> UBICACION </br>
        <input name="q" type="search" />
      </label>
      <div class="search-description">Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad. Podes ayudarte arrastrando el marcador.</div>
    `;

    // Handler
    function initSearchForm(callback) {
      const form = document.querySelector(".map-search-form");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const target = e.target as any;
        const value = target.q.value;
        mapboxClient.geocodeForward(
          value,
          {
            country: "ar",
            autocomplete: true,
            language: "es",
          },
          function (err, data, res) {
            if (!err) callback(data.features);
          }
        );
      });
    }

    (function () {
      initSearchForm(function (results) {
        const firstResult = results[0];
        const marker = new Marker({ draggable: true })
          .setLngLat(firstResult.geometry.coordinates)
          .addTo(map);

        map.setCenter(firstResult.geometry.coordinates);
        map.setZoom(14);
        let latR = firstResult.geometry.coordinates[1];
        let lngR = firstResult.geometry.coordinates[0];

        function onDragEnd() {
          const lngLat = marker.getLngLat();
          latR = lngLat.lat;
          lngR = lngLat.lng;
          getLocationData();
        }

        marker.on("dragend", onDragEnd);

        getLocationData();

        function getLocationData() {
          fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngR},${latR}.json?limit=1&access_token=${MAPBOX_TOKEN}`
          ).then((res) => {
            res.json().then((data) => {
              document.querySelector(".location-data").innerHTML = `
                <input type="text" name="lat" value="${latR}" />
                <input type="text" name="lng" value="${lngR}" />
                <input type="text" name="city" value="${data.features[0].context[0].text}"/>
                <input type="text" name="region" value="${data.features[0].context[1].text}"/>
              `;
            });
          });
        }
      });
    })();

    //Boton de reportar
    const sumbitButton = document.createElement("button");
    sumbitButton.innerHTML = `
    Reportar como perdido
    `;
    reportarFormContEl.appendChild(sumbitButton);

    // Cancel Button
    const cancelButton = document.createElement("button");
    cancelButton.classList.add("cancel");
    cancelButton.innerHTML = `
    Cancelar
    `;
    cancelButton.addEventListener("click", () => {
      Router.go("/");
    });
    reportarFormContEl.appendChild(cancelButton);

    // Handler de los datos finales del form
    reportarFormContEl.addEventListener("submit", async (event: any) => {
      event.preventDefault();

      const data = new FormData(event.target);
      const value = Object.fromEntries(data.entries());

      if (!value.name) {
        window.alert("Debes ingresar un nombre");
        return;
      }
      if (!value.lat) {
        window.alert("Debes buscar una ubicacion");
        return;
      }
      if (!value.dataURL) {
        window.alert("Debes subir una foto");
        return;
      }

      // Mask
      const mask = document.createElement("div");
      mask.style.cssText = `top: 0; position: fixed; cursor: wait; z-index: 999; height: 100vh; width: 100vw;`;
      this.appendChild(mask);

      const bodyObj = {
        name: value.name as string,
        lat: value.lat as string,
        lng: value.lng as string,
        city: value.city as string,
        region: value.region as string,
        imageUrl: value.dataURL as string,
        contact: state.getState().currentUser.email,
      };

      fetch(process.env.API_BASE_URL + "/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + state.getState().currentUser.token,
        },
        body: JSON.stringify(bodyObj),
      }).then((res) => {
        res.json().then((data) => {
          Router.go("/mascotas-reportadas");
        });
      });
    });
  }
}

customElements.define("custom-reportar", Reportar);
