import { Router } from "express" 
import * as usersController from "../controllers/users.controller.js"
import { deleteUsers } from "../controllers/mailing.controller.js"

export const usersRouter = Router()

usersRouter.post("/", usersController.postUsuarios)
usersRouter.get("/", usersController.getUsuarios)
usersRouter.post("/premium/:uid", usersController.changeRole)
usersRouter.delete("/delete/:uid", usersController.deleteUserById)
usersRouter.delete("/delete", deleteUsers)