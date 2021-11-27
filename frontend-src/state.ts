export const state = {
  data: {
    currentUser: {
      email: "",
      nombre: "",
      id: "",
      token: "",
    },
    signedIn: false,
    permisos: false,
    currentLocation: {
      lat: 0,
      lng: 0,
    },
    editPetId: "",
  },
  listeners: [],
  init() {
    if (window.localStorage.getItem("state")) {
      this.setState(JSON.parse(window.localStorage.getItem("state")));
    }
  },
  subscribe(cb) {
    this.listeners.push(cb);
  },
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb(newState);
    }
    window.localStorage.setItem("state", JSON.stringify(newState));
    console.log("New state was set");
  },
  setCurrentMail(email) {
    const currentState = this.getState();
    currentState.currentUser.email = email;
    this.setState(currentState);
  },
  setName(fullName) {
    const currentState = this.getState();
    currentState.currentUser.nombre = fullName;
    this.setState(currentState);
  },
  setId(id) {
    const currentState = this.getState();
    currentState.currentUser.id = id;
    this.setState(currentState);
  },
  signIn() {
    const currentState = this.getState();
    currentState.signedIn = true;
    this.setState(currentState);
  },
  logOut() {
    const currentState = this.getState();
    currentState.signedIn = false;
    currentState.editPetId = "";
    currentState.currentUser = {
      email: "",
      nombre: "",
      id: "",
      token: "",
    };
    this.setState(currentState);
  },
  setToken(token) {
    const currentState = this.getState();
    currentState.currentUser.token = token;
    this.setState(currentState);
  },
  permitirUbicacion(position) {
    const currentState = this.getState();
    currentState.permisos = true;
    currentState.currentLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    this.setState(currentState);
  },
  setEditPetId(id) {
    const currentState = this.getState();
    currentState.editPetId = id;
    this.setState(currentState);
  },
};
