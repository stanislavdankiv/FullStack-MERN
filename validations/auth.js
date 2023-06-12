import { body } from 'express-validator'

export const registerValidator = [
    body('email', 'Невірний формат пошти').isEmail(),
    body('password', 'Пароль повинен бути мінімум 5 символів').isLength({ min: 5 }),
    body('fullName', 'Вкажи імя').isLength({ min: 3 }),
    body('avatarUrl', 'Невірна силка на аватарку').optional().isURL(),
];