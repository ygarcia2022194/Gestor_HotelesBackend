import ReviewModel from "./review.model.js";
import {request, response} from 'express';

export const postReview = async (req = request, res = response) => {
    try {
        const { comment, raitingClean, raitingStaff, raitingAttention, hotel } = req.body;
        const user = req.usuario._id;

        if(user.role === 'USER_ROLE') {
            const review = new ReviewModel({ comment, raitingClean, raitingStaff, raitingAttention, hotel, user });
            console.log(review);
            
            await review.save();
            
            res.status(200).json({ review });
        } else {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

    } catch (error) {
        console.error('Error al crear review:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}