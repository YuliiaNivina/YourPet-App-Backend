const express = require('express')

const ctrl = require('../../controllers/pets')

const router = new express.Router()

const { ctrlWrapper } = require('../../helpers')

const { validateBody, upload } = require('../../middlewares')

const { schemasPet } = require('../../models/pet')

router.get('/users/pets', ctrl.authentification, ctrlWrapper(ctrl.getUserPets))

router.post(
    '/users/addPet',
    ctrl.authentification,
    upload.single('image'),
    validateBody(schemasPet),
    ctrlWrapper(ctrl.addUserPet)
)

router.delete(
    '/users/:petId',
    ctrl.authentification,
    ctrlWrapper(ctrl.deleteUserPet)
)

module.exports = router

