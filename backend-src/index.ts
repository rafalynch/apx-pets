// import * as dotenv from "dotenv";
// dotenv.config();
import * as express from "express";
import * as bearerToken from "bearer-token";
import * as path from "path";
import * as jwt from "jsonwebtoken";
import {
  signin,
  signup,
  getAuthByEmail,
  SECRET,
} from "./controllers/auth-controller";
import { getUserById } from "./controllers/users-controller";
import {
  createPet,
  findPetById,
  findPetsClose,
  updatePet,
  createReport,
  setFoundPet,
  setLostPet,
  deletePet,
  findMyPets,
  getMyPetById,
} from "./controllers/pets-controller";
import { sequelize } from "./models";

const app = express();
const port = process.env.PORT;

app.use(
  express.json({
    limit: "50mb",
  })
);

//sequelize.sync({ alter: true });

// Sign up. Recibe email, password, fullName en el body.
app.post("/auth", async (req, res) => {
  const { email, password, fullName } = req.body;
  const response = await signup(email, password, fullName);
  if (response.newAuth) {
    res.json({
      user: response.user,
      auth: response.newAuth,
      mensaje: "Usuario creado correctamente!",
    });
  } else {
    res.json({
      user: response.updatedUser,
      auth: response.updatedAuth,
      mensaje: "Usuario actualizado correctamente!",
    });
  }
});

// Sign in. recibe un email y un password.
app.post("/auth/token", async (req, res) => {
  const { email, password } = req.body;
  const response = await signin(email, password);
  if (response.found) {
    res.json(response);
  } else {
    res.status(400).json("La contraseña es incorrecta o no existe ese usuario");
  }
});

// Get auth by email
app.get("/auth/:email", async (req, res) => {
  const email = req.params.email;
  const response = await getAuthByEmail(email);
  res.json(response);
});

// Middleware
function authMiddleWare(req, res, next) {
  bearerToken(req, async (err, token) => {
    try {
      const decoded = jwt.verify(token, SECRET);
      req._userId = decoded.userId;
      next();
    } catch (err) {
      res.status(401).json(err);
    }
  });
}

// Datos del usuario. Recibe el token desde el header (Authorization: bearer {token})
app.get("/me", authMiddleWare, async (req, res) => {
  const user = await getUserById(req._userId);
  res.json(user);
});

// Crear Pet. Recibe los datos para crearlo. Ademas hay que pasarle el token en el header para que pase el middleware.
app.post("/pets", authMiddleWare, async (req, res) => {
  const { name, lat, lng, city, region, imageUrl, contact } = req.body;
  const userId = req._userId;

  const pet = await createPet(
    name,
    lat,
    lng,
    imageUrl,
    userId,
    city,
    region,
    contact
  );

  res.json(pet);
});

// recibe el token en el header para el middleware
app.get("/me/pets", authMiddleWare, async (req, res) => {
  const pets = await findMyPets(req._userId);
  res.json(pets);
});

// Post un report. Cualquiera puede hacerlo sin necesidad de registrarse.
app.post("/report", async (req, res) => {
  const { name, phoneNumber, description, petId, contact } = req.body;
  const report = await createReport(
    name,
    phoneNumber,
    description,
    petId,
    contact
  );
  res.json(report);
});

// recibe el token en el header para el middleware
app.get("/me/pets/:petId", authMiddleWare, async (req, res) => {
  const petId = req.params.petId;
  const pet = await getMyPetById(petId, req._userId);
  res.json(pet);
});

// Encontrar pets by id (sin tener usuario logeado)
app.get("/pets/:id", (req, res) => {
  const id = req.params.id;
  findPetById(id).then((pet) => {
    res.json(pet);
  });
});

// Encontrar pets cercanas
app.get("/pets-cerca-de", async (req, res) => {
  const { lat, lng } = req.query;
  const response = await findPetsClose(lat, lng);
  res.json(response);
});

app.patch("/pets/:id", authMiddleWare, async (req, res) => {
  const { id } = req.params;

  if (req.body.isFound) {
    const respuesta = await setFoundPet(id);
    res.json(respuesta);
    return;
  }

  if (req.body.isLost) {
    const respuesta = await setLostPet(id);
    res.json(respuesta);
    return;
  }

  const { name, lat, lng, city, region, imageUrl } = req.body;
  const pet = await updatePet(name, lat, lng, imageUrl, city, region, id);
  res.json(pet);
});

app.delete("/pets/:id", authMiddleWare, async (req, res) => {
  const { id } = req.params;
  const response = await deletePet(id);
  res.json(response);
});

app.get("*", express.static("frontend"));

app.get("*", (req, res) => {
  const ruta = path.resolve(__dirname, "../frontend", "index.html");
  res.sendFile(ruta);
});

app.listen(port, () => {
  console.log("Listening at port " + port);
});
