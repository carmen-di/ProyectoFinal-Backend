import { createTransport } from 'nodemailer'
import { hashear } from '../utils/crypto.js'
import { usersRepository } from '../repositories/users.repository.js'
import jwt from 'jsonwebtoken'

const clienteNodemailer = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'luisa.reinger80@ethereal.email',
        pass: 'RQZ9wrQ2SfM9RxPwjV'
    }
});

export const sendResetPasswordEmail = async (req, res) => {
    const { email } = req.body
    console.log(email)
    const secretKey = "secreto"
    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' })

    let result = await clienteNodemailer.sendMail({
        from: "<cdomingueziribe@gmail.com>",
        to: email,
        subject: "Reestablecimiento de contraseña",
        text: "Hola, esto es una prueba de envio de correo",
        html: `<div> <a href="http://localhost:8080/forgot/${token}">Click aquí para resetear tu contraseña</a>
        </div>`,
    })
    console.log(result)
    return result;
}

export const forgotPageController = async (req, res) => {
    res.render('recoverMailing', { title: 'Restaurar Contraseña' })
};

export const resetPasswordController = async (req, res) => {
    const { email, password } = req.body;

    let newPassword = encriptar(password)

    try {
        if (!email || !password ) {
            console.log("completar todos los campos")
        }

        const user = await usersRepository.getUserByEmail(email)

        if (!user) {
            return res.status(404).json({ message: 'error', data: 'User not exist' })
        } else {
            if (newPassword == user.password) {
                return res.status(404).json({message: 'error', data: 'Cannot reset the password using the old password'})
            }
            user.password = newPassword
            const result = await usersRepository.updateUserPassword(email, newPassword)
        
            if (user) {
                res.render("login", {title: "Login"})
                return result
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

export const resetPasswordEmailController = async (req, res) => {
    const { key } = req.params;
    const { password, email } = req.body;
    let newPassword = encriptar(password)
    try {
        const user = await usersRepository.getUserByEmail(email)
        console.log(user)
        if (user) {
            const result = await usersRepository.updatePassword(email, newPassword)
            res.render("login", {title: "Login"})
            return result
        } else {
            res.send('ERROR')
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

};

export const resetPasswordPageController = async (req, res) => {
    res.render('forgot', { title: 'Reset Password', stylesheet: 'resetpassword' })

}

export async function deleteUsers(req, res, next) {
    try {
        const now = new Date()
    
        const dias = 2
        const diasEnMilisegundos = dias * 24 * 60 * 60 * 1000
        const fechaLimite = now - diasEnMilisegundos
    
        const allUsers = await usersRepository.getUsers()

        const inactiveUsers = allUsers.filter((user) => {
            if (user.last_connection < fechaLimite) {
                return user
            }
        })

        inactiveUsers.forEach(async (inactiveUser) => {
            const userId = inactiveUser.id

            const emailOptions = {
                from: "<cdomingueziribe@gmail.com>",
                receiver: inactiveUser.email,
                subject: "Cuenta eliminada por inactividad",
                message: `Usuario "${inactiveUser?.email}", Su cuenta ha sido eliminada por inactividad`,
            }
            await clienteNodemailer.send(emailOptions)
            await usersRepository.deleteUser(userId)
        })
        res.status(201).json({
            allUsers: allUsers,
            inactiveUsers: inactiveUsers,
            })
        } catch (error) {
            throw new Error(error)
        }
}
