const express = require('express')

const ctrl = require('../../controllers/pets')

const router = new express.Router()

const { ctrlWrapper } = require('../../helpers')

const { validateBody, upload, authenticate } = require('../../middlewares')

const { schemasPet } = require('../../models/pet')

router.get('/users/pets', authenticate, ctrlWrapper(ctrl.getUserPets))

router.post(
    '/users/addPet',
    authenticate,
    upload.single('image'),
    validateBody(schemasPet),
    ctrlWrapper(ctrl.addUserPet)
)

router.delete(
    '/users/:petId',
    authenticate,
    ctrlWrapper(ctrl.deleteUserPet)
)

module.exports = router

