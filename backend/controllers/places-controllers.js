const HttpError = require('../models/http-error');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const fs = require('fs');

const getPlaceById =  async (req, res , next) => {
    const placeId = req.params.pid;
    let place;
    try {
         place = await Place.findById(placeId);    
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a place',500 );
        return next(error);
    }
    
    if(!place) {
        const error = (new HttpError('Could not find a place for required id.',404));
        return next(error);
    }

    res.json({place : place.toObject({getters : true})});
};

const getPlacesByUserId = async (req, res , next) => {  
    const userId = req.params.uid;
    let places;
    try {
        places = await Place.find({creator : userId});    
    } catch (err) {
        const error = new HttpError('fetching places failed, please try again later.', 500 );
        return next(error);
    }
    if(!places || places.length === 0) {
        return next(new HttpError('Could not find a places for required user id.',404));
    }

    res.json({places : places.map(place => place.toObject({getters : true}))});
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors);
        next(new HttpError('invalid inputs passed, please check your data.', 422)); 
    }
    const {title, description, address} = req.body;

    const coordinates = await getCoordsForAddress(address);

    const createdPlace = new Place({
        title,
        description,
        location: coordinates,
        address,
        image: req.file.path,
        creator : req.userData.userId
    });
    console.log(createdPlace);
    let user;
    try {
        console.log(req.userData);
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError('Creating places failed.please try again later.', 500);
        return next(error);
    }
    if(!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error);
    }
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session : sess});
        user.places.push(createdPlace);
        await user.save({session : sess});
        await sess.commitTransaction();
    } catch(err) {
        const error = new HttpError('Creating places failed.please try agin later', 500);
        return next(error);
    }
    res.status(201).json({place : createdPlace });
}
const updatePlace = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('invalid inputs passed, please check your data.', 422));
    }
    const {title, description} = req.body;
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something went wrong,could not update place.',500);
        return next(error);
    }
    if(place.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this place.',401);
        return next(error);
    }

    place.title = title;
    place.description = description; 
    try {
        await place.save();
    } catch (err) {
        const error = new HttpError('Something went wrong,could not update place.',500);
        return next(error);
    }
    
    res.status(200).json({place : place.toObject({getters : true})})

};
const deletePlace = async (req,res,next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete place.', 500);
        return next(error);
    }
    if(!place) {
        const error = new HttpError('Could not find place for this id.',404);
        return next(error);
    }
    if(place.creator.id !== req.userData.userId) {
        const error = new HttpError('You are not allowed to delete this place.',401);
        return next(error);
    }
    const ImagePath = place.image;
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session : sess});
        place.creator.places.pull(place);
        await place.creator.save({session : sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete place.', 500);
        return next(error);
    }
    fs.unlink(ImagePath,err => {
        console.log(err);
    })
    res.status(200).json({message : 'Place Deleted!.' });
};
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;