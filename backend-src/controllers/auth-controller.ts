import { User } from "../models/users";
import { Auth } from "../models/auth";
import * as sha1 from "js-sha1";
import * as jwt from "jsonwebtoken";

const SECRET = "jimmy";

async function signup(email: string, password: string, fullName: string) {
  // Encuentra o crea un nuevo usuario. Solamente guarda los datos personales en una instancia User.
  // Devuelve un user con los datos creados y un created (boolean).
  const [user, created] = await User.findOrCreate({
    where: { email: email },
    defaults: {
      email,
      fullName,
    },
  });

  // Si ya existia un usuario con ese email, debe actualizarlo.
  if (!created) {
    const updatedUser = await user.update({
      fullName,
    });

    const auth = await Auth.findOne({
      where: { email: email },
    });

    const updatedAuth = await auth.update({
      password: sha1(password),
    });

    return { updatedUser, updatedAuth };
  }

  // Crea una instancia de Auth, con la contraseña y a partir del email.
  const newAuth = await Auth.create({
    email,
    password: sha1(password),
    userId: user.get().id,
  });
  return { user, newAuth };
}

async function signin(email: string, password: string) {
  const auth = await Auth.findOne({
    where: { email, password: sha1(password) },
  });
  if (auth === null) {
    return { found: false };
  } else {
    var token = jwt.sign({ userId: auth.get().userId }, SECRET);
    return { found: true, token };
  }
}

async function getAuthByEmail(email: string) {
  const auth = await Auth.findOne({
    where: { email },
  });
  if (auth === null) {
    return false;
  } else {
    return true;
  }
}

export { signup, signin, getAuthByEmail, SECRET };
