import { Pet } from "../models/models";
import { User } from "../models/models";
import { index } from "../lib/algolia";
import "../lib/cloudinary";
import { v2 as cloudinary } from "cloudinary";

async function createPet(
  name: string,
  lat: number,
  lng: number,
  imageUrl: string,
  userId: number,
  city: string,
  region: string,
  contact: string
) {
  const imagenCloudinary = await cloudinary.uploader.upload(imageUrl, {
    resource_type: "image",
    discard_original_filename: true,
  });

  const pet = await Pet.create({
    name,
    lat,
    lng,
    imageUrl: imagenCloudinary.secure_url,
    UserId: userId,
    isFound: false,
    city,
    region,
    contact,
  });

  const originalId = pet.get("id");

  await index.saveObject({
    objectID: originalId,
    _geoloc: {
      lat,
      lng,
    },
  });

  return pet;
}

async function findPetsClose(lat, lng) {
  const res = await index.search("", {
    aroundLatLng: lat + ", " + lng,
    aroundRadius: 10000, // 10km
  });

  return res;
}

async function findPetById(id) {
  const pet = await Pet.findByPk(id);
  return pet;
}

async function updatePet(
  name?: string,
  lat?: number,
  lng?: number,
  newImageUrl?: string,
  city?: string,
  region?: string,
  id?: string
) {
  if (newImageUrl) {
    await cloudinary.uploader
      .upload(newImageUrl, {
        resource_type: "image",
        discard_original_filename: true,
      })
      .then(async (imageUrl) => {
        await Pet.update(
          {
            imageUrl: imageUrl.secure_url,
          },
          { where: { id: id } }
        );
      })
      .catch((err) => {
        return err;
      });
  }

  if (lat && lng && city && region) {
    const update = await index.partialUpdateObject({
      _geoloc: {
        lat,
        lng,
      },
      objectID: id,
    });

    await Pet.update(
      {
        lat,
        lng,
        city,
        region,
      },
      { where: { id: id } }
    );
  }

  if (name) {
    return await Pet.update(
      {
        name,
      },
      { where: { id: id } }
    );
  }
}

async function setFoundPet(id) {
  return await Pet.update(
    {
      isFound: true,
    },
    { where: { id: id } }
  );
}

async function setLostPet(id) {
  return await Pet.update(
    {
      isFound: false,
    },
    { where: { id: id } }
  );
}

async function deletePet(id) {
  await index.deleteObject(id);
  return await Pet.destroy({ where: { id: id } });
}

async function createReport(name, phoneNumber, description, petId, contact) {
  const sgMail = require("@sendgrid/mail");

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: contact, // Change to your recipient
    from: "apxlostpets@gmail.com", // Change to your verified sender
    subject: "Informacion de tu mascota",
    text: `
      Recibimos el siguiente reporte acerca de tu mascota:

      Nombre: ${name}.
      Numero de telefono: ${phoneNumber}.
      Mensaje: ${description}.

      Comunicate con la persona para mas info.
    `,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });

  return msg;
}

async function findMyPets(userId: string) {
  return await Pet.findAll({
    where: {
      UserId: userId,
    },
    include: [User],
  });
}

async function getMyPetById(petId, userId) {
  return await Pet.findOne({
    where: {
      UserId: userId,
      id: petId,
    },
    include: [User],
  });
}

export {
  createPet,
  findPetsClose,
  findPetById,
  updatePet,
  createReport,
  setFoundPet,
  setLostPet,
  deletePet,
  findMyPets,
  getMyPetById,
};
