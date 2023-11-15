import {
    userModel
} from '../../models/user.js';
import { createHash } from "../../utils.js";
import { cartModel } from '../../models/cart.js';

export const getAllUser = async () => {
    return await userModel.find();
};

export const add_User = async (newUser) => {
    const arrayCart = [];
    const cart = await cartModel.create({arrayCart});
    console.log(cart);
    newUser.cart = cart._id;
    console.log(newUser);
    const user = await userModel.create(newUser);
    console.log(user);

    //const cart = cartModel.create();
    return user;
};

export const delete_User = async (_id) => {
    try {
        const user = await userModel.deleteOne(_id);
    } catch (error) {
        return false;
    }

    return true;
};

export const delete_Users = async () => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const deletedUsers = await userModel.find({
            fecha_ultima_conexion: { $lt: sevenDaysAgo }
        });

        const result = await userModel.deleteMany({
            fecha_ultima_conexion: { $lt: sevenDaysAgo }
        });

        return { deletedCount: result.deletedCount, deletedUsers };
    } catch (error) {
        return { deletedCount: 0, deletedUsers: [] };
    }
};


export const update_User = async (user) => {
    try {
        const result = await userModel.updateOne(
            { _id: user._id }, 
            { $set: { fecha_ultima_conexion: user.fecha_ultima_conexion } } 
        );

        if (result.nModified === 0) {
            console.log("Usuario no encontrado o ningún cambio realizado.");
            return false;
        }
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        return false;
    }

    return true;
};

export const get_User = async (username) => {
    return await userModel.findOne({
        email: username
    });
};

export const get_User_By_Id = async (_id) => {
    const user = await userModel.findById(_id);
    return user;
};

export const reset_Pass = async (email, password) => {
    //console.log(email);
    const user = await userModel.findOne({ email });
    //console.log(user);
    if (!user) {
        return res.status(404).send({
            status: "error",
            error: "No existe el usuario"
        });
    }
    const passwordHash = createHash(password);

    if (passwordHash === user.password) {
        return {
            status: "error",
            error: "La nueva contraseña debe ser diferente a la actual"
        };
    }

    await userModel.updateOne({
        email
    }, {
        $set: {
            password: passwordHash
        }
    })
};