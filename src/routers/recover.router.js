import { Router } from "express"
import { forgotPageController, resetPasswordController, resetPasswordEmailController, resetPasswordPageController, sendResetPasswordEmail, sendProductDeletedEmail } from "../controllers/mailing.controller.js"
import express from "express"

export const recoverRouter = Router()

recoverRouter.use(express.json())
recoverRouter.use(express.urlencoded({ extended: true }))

recoverRouter.get('/', forgotPageController)

recoverRouter.post('/:key', resetPasswordEmailController)

recoverRouter.get('/:key', resetPasswordPageController)

recoverRouter.post('/', sendResetPasswordEmail)

recoverRouter.post('/', sendProductDeletedEmail)