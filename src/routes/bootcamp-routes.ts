import express, { Router } from 'express';
import { getAllBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp } from '../controllers/bootcamp-controller'


const router: Router = express.Router();

router.route('/')
    .get(getAllBootcamps)
    .post(createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);



export default router;