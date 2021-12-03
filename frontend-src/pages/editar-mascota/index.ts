import { Router } from "@vaadin/router";
import { state } from "../../state";
import * as mapboxgl from "mapbox-gl";
import { Marker } from "mapbox-gl";
import * as MapboxClient from "mapbox";
import { Dropzone } from "dropzone";

class EditarMascota extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  async render() {
    if (!state.getState().editPetId) {
      Router.go("/");
    }

    // FETCH
    const petData = await fetch(
      process.env.API_BASE_URL + "/me/pets/" + state.getState().editPetId,
      {
        headers: {
          Authorization: "bearer " + state.getState().currentUser.token,
        },
      }
    ).then((res) => res.json());

    if (petData == null) {
      Router.go("/");
      window.alert("No puedes editar esa mascota");
    }

    // HEADER
    const headerEl = document.createElement("custom-header");
    this.appendChild(headerEl);

    // CONTAINER
    const editarMascotaContainerEl = document.createElement("div");
    editarMascotaContainerEl.classList.add("editar-container");
    this.appendChild(editarMascotaContainerEl);

    // CSS
    const style = document.createElement("style");
    style.innerHTML = `
          .editar-container {
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
          .editar-container__form {
            display: grid;
            justify-items: center;
            gap: 24px;
            margin-bottom: 20px;
          }
          .editar-container__form label {
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
          button.encontrado-btn{
            background-color: #97EA9F;
          }
          button.perdido-btn{
            background-color: #97EA9F;
          }
          .dz-success-mark, .dz-error-mark, .dz-filename, .dz-size, .dz-progress, .dz-error-message {
            display:none;
          }
          .despublicar-btn{
            text-decoration-line: underline;
            color: #FF3A3A;
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
    editarMascotaContainerEl.appendChild(style);

    // TITULO
    const titleContainer = document.createElement("div");
    titleContainer.className = "title-container";
    titleContainer.innerHTML = `
      <h1 class="title">Editar mascota perdida</h1>
    `;
    editarMascotaContainerEl.appendChild(titleContainer);

    // FORM
    const editarFormContEl = document.createElement("form");
    editarMascotaContainerEl.appendChild(editarFormContEl);
    editarFormContEl.classList.add("editar-container__form");
    editarFormContEl.innerHTML = `
    <label>
    NOMBRE</br>
    <input name="name" type="text" value="${petData.name}" />
    </label>
    `;

    // DROPZONE

    // Image data inputs container
    const imageData = document.createElement("label");
    editarFormContEl.append(imageData);
    imageData.classList.add("image-data");
    imageData.style.display = "none";
    imageData.innerHTML = `
      <input type="text" name="dataURL" value="${petData.imageUrl}" />
    `;

    const templateImg = document.createElement("img");
    templateImg.classList.add("template-img");
    templateImg.style.height = "147px";
    editarFormContEl.appendChild(templateImg);
    templateImg.setAttribute("src", petData.imageUrl);

    const dropzonePreviewEl = document.createElement("div");
    dropzonePreviewEl.classList.add("dropzone-preview");
    editarFormContEl.appendChild(dropzonePreviewEl);

    const dropzoneEl = document.createElement("div");
    editarFormContEl.appendChild(dropzoneEl);
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
      // usando este evento pueden acceder al dataURL directamente
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
    const mapContainerEl = document.createElement("div");
    mapContainerEl.setAttribute("id", "map-container");
    mapContainerEl.classList.add("map-container");
    editarFormContEl.appendChild(mapContainerEl);

    const MAPBOX_TOKEN =
      "pk.eyJ1IjoicmFmYWx5bmNoIiwiYSI6ImNrdWoxOGY2cTJ0YWMycW56eXh5Y3Z4OGQifQ.zqxAiB1-awBbHgbarsvPMg";

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const mapboxClient = new MapboxClient(MAPBOX_TOKEN);

    const map = new mapboxgl.Map({
      container: "map-container", // container ID
      style: "mapbox://styles/mapbox/streets-v8", // style URL
      center: [petData.lng, petData.lat], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });

    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([petData.lng, petData.lat])
      .addTo(map);

    function onDragEnd() {
      const lngLat = marker.getLngLat();
      getLocationData(lngLat.lng, lngLat.lat);
    }

    marker.on("dragend", onDragEnd);

    // location Data inputs container
    const locationData = document.createElement("label");
    editarFormContEl.append(locationData);
    locationData.classList.add("location-data");
    locationData.style.display = "none";
    setLocationInput();

    function setLocationInput() {
      locationData.innerHTML = `
                <input type="text" name="lat" value="${petData.lat}" />
                <input type="text" name="lng" value="${petData.lng}" />
                <input type="text" name="city" value="${petData.city}"/>
                <input type="text" name="region" value="${petData.region}"/>
              `;
    }

    // BUSCADOR
    const mapSearch = document.createElement("form");
    editarFormContEl.appendChild(mapSearch);
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
        marker.remove();
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
      initSearchForm(async function (results) {
        const firstResult = results[0];
        const marker = new Marker({ draggable: true })
          .setLngLat(firstResult.geometry.coordinates)
          .addTo(map);
        const [lng, lat] = firstResult.geometry.coordinates;
        map.setCenter(firstResult.geometry.coordinates);
        map.setZoom(14);
        const latR = firstResult.geometry.coordinates[1];
        const lngR = firstResult.geometry.coordinates[0];

        function onDragEnd() {
          const lngLat = marker.getLngLat();
          getLocationData(lngLat.lng, lngLat.lat);
        }

        marker.on("dragend", onDragEnd);

        await getLocationData(lngR, latR);
      });
    })();

    async function getLocationData(lng, lat) {
      await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?limit=1&access_token=${MAPBOX_TOKEN}`
      ).then((res) => {
        res.json().then((data) => {
          locationData.innerHTML = `
            <input type="text" name="lat" value="${lat}" />
            <input type="text" name="lng" value="${lng}" />
            <input type="text" name="city" value="${data.features[0].context[0].text}"/>
            <input type="text" name="region" value="${data.features[0].context[1].text}"/>
          `;
        });
      });
    }

    //Boton de reportar
    const sumbitButton = document.createElement("button");
    sumbitButton.innerHTML = `
      Guardar
    `;
    editarFormContEl.appendChild(sumbitButton);

    if (petData.isFound) {
      // Perdido Button
      const perdidoButton = document.createElement("button");
      perdidoButton.classList.add("perdido-btn");
      perdidoButton.innerHTML = `
        Reportar como perdido
    `;
      perdidoButton.addEventListener("click", () => {});
      editarFormContEl.appendChild(perdidoButton);

      perdidoButton.addEventListener("click", (e) => {
        e.preventDefault();
        var myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          "bearer " + state.getState().currentUser.token
        );
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ isLost: true });

        var requestOptions = {
          method: "PATCH",
          headers: myHeaders,
          body: raw,
        };

        fetch(
          process.env.API_BASE_URL + "/pets/" + state.getState().editPetId,
          requestOptions
        )
          .then(() => Router.go("/mascotas-reportadas"))
          .catch((error) => console.log("error", error));
      });
    } else {
      // Encontrado Button
      const encontradoButton = document.createElement("button");
      encontradoButton.classList.add("encontrado-btn");
      encontradoButton.innerHTML = `
        Reportar como encontrado
      `;
      encontradoButton.addEventListener("click", () => {});
      editarFormContEl.appendChild(encontradoButton);

      encontradoButton.addEventListener("click", (e) => {
        e.preventDefault();
        var myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          "bearer " + state.getState().currentUser.token
        );
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ isFound: true });

        var requestOptions = {
          method: "PATCH",
          headers: myHeaders,
          body: raw,
        };

        fetch(
          process.env.API_BASE_URL + "/pets/" + state.getState().editPetId,
          requestOptions
        )
          .then(() => Router.go("/mascotas-reportadas"))
          .catch((error) => console.log("error", error));
      });
    }

    // Despublicar Button
    const despublicarButton = document.createElement("a");
    despublicarButton.classList.add("despublicar-btn");
    despublicarButton.innerHTML = `
      DESPUBLICAR
    `;
    despublicarButton.addEventListener("click", () => {});
    editarFormContEl.appendChild(despublicarButton);

    despublicarButton.addEventListener("click", (e) => {
      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "bearer " + state.getState().currentUser.token
      );
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: "DELETE",
        headers: myHeaders,
      };

      fetch(
        process.env.API_BASE_URL + "/pets/" + state.getState().editPetId,
        requestOptions
      )
        .then(() => Router.go("/mascotas-reportadas"))
        .catch((error) => console.log("error", error));
    });

    // Handler de los datos finales del form
    editarFormContEl.addEventListener("submit", async (event: any) => {
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
        lat: Number(value.lat as string),
        lng: Number(value.lng as string),
        city: value.city as string,
        region: value.region as string,
        imageUrl: value.dataURL as string,
      };

      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "bearer " + state.getState().currentUser.token
      );
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify(bodyObj);

      var requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
      };

      fetch(
        process.env.API_BASE_URL + "/pets/" + state.getState().editPetId,
        requestOptions
      )
        .then(() => Router.go("/mascotas-reportadas"))
        .catch((error) => console.log("error", error));
    });
  }
}

customElements.define("custom-editar-mascota", EditarMascota);
