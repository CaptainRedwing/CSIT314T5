import { createError } from "../utils/error.js";
import { UserAccount } from "../entity/UserAccount.js";

export async function viewUserAccount(req, res, next) {
    try {
        const users = await UserAccount.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.log(error.message);
        return next(createError(400, "No User Account has been created"));
    }
}

export async function createUserAccount(req, res, next) {
    try {
        const user = new UserAccount(req.body);

        if (!user.isValid()) {
            return res.status(400).json({ error: "Invalid user input" });
        }

        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.log(error.message);
        return next(createError(400, error.message));
    }
}

export async function viewAccountByUserNameRole(req, res, next) {
    try {
        const { username, role } = req.query;
        const users = await UserAccount.findByUsernameAndRole(username, role);
        res.status(200).json(users);
    } catch (error) {
        console.log(error.message);
        return next(createError(400, error.message));
    }
}

export async function findSpecificUserAccount(req, res, next) {
    try {
        const id = req.params.id;
        const user = await UserAccount.findById(id);

        if (!user) {
            return next(createError(400, "User Account Not Found!"));
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        return next(createError(400, error.message));
    }
}

export async function suspendUserAccount(req, res, next) {
    try {
        const id = req.params.id;
        const success = await UserAccount.suspendById(id);

        if (!success) {
            return next(createError(400, "User Account Not Found!"));
        }

        res.status(200).json({ message: "Deleted successfully!" });
    } catch (error) {
        console.log(error.message);
        return next(createError(400, error.message));
    }
}

export async function updateUserAccount(req, res, next) {
    try {
        const { id } = req.params;
        const updatedUser = await UserAccount.updateById(id, req.body);

        if (!updatedUser) {
            return res.status(400).json({ error: "User Not Found!" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
}
