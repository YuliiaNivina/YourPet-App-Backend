const express = require('express')

const ctrl = require('../../controllers/pets')

const router = new express.Router()

const { validateBody, upload, authenticate } = require('../../middlewares')

const { schemasPet } = require('../../models/pet')

router.get('/users/pets', authenticate, ctrl.getUserPets);

router.post('/users/addPet', authenticate, upload.single('photoURL'), validateBody(schemasPet.addPetSchema), ctrl.addUserPet);

router.delete('/users/:petId', authenticate, ctrl.deleteUserPet);

module.exports = router;

