const Workout = require("../models/Workout");
const bcrypt = require("bcrypt"); //bcryptjs
const { errorHandler } = require("../auth.js");

module.exports.addWorkout = (req, res) => {
    const userId = req.user.id; // Retrieved from JWT
    let newWorkout = new Workout({
        userId,
        name : req.body.name,
        duration : req.body.duration
    });
    Workout.findOne({ name: req.body.name })
    .then(existingWorkout =>{
        if(existingWorkout){
            res.status(409).send({ message: 'Workout already exists'})
        }else{
            return newWorkout.save()
            .then(result => res.status(201).send(result))
            .catch(error => errorHandler(error, req, res));
        }
    }).catch(error => errorHandler(error, req, res))
};

module.exports.getMyWorkouts = (req, res) => {
    const userId = req.user.id; // Retrieved from JWT
    return Workout.find({userId}) // Filter by userId
    .then(result => {
        if(result.length <= 0) {
            return res.status(404).json({error: "No workouts found"});
        }
        
        return res.status(200).json({workouts: result})
    })
    .catch(error => errorHandler(error, req, res))
};

module.exports.updateWorkout = (req, res)=>{
    const userId = req.user.id; // Retrieved from JWT
    const workoutId = req.params.workoutId;

    if (!req.body.name || !req.body.duration) {
        return res.status(400).json({ error: "Name and duration are required" });
    }

    let updatedWorkout = {
        name: req.body.name,
        duration: req.body.duration,
        status: req.body.status || "pending"
    }

    return Workout.findOneAndUpdate({ _id: workoutId, userId }, updatedWorkout, { new: true }) // Filter by userId
    .then(workout => {
        console.log("Workout returned from findOneAndUpdate:", workout);

        if (workout) {
            return res.status(200).json({
                message : 'Workout updated successfully',
                updatedWorkout: workout
            });
        } else {
            return res.status(404).send({error : 'Workout not found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.deleteWorkout = (req, res) => {
    const userId = req.user.id; // Retrieved from JWT
    const workoutId = req.params.workoutId;
    return Workout.deleteOne({ _id: workoutId, userId }) // Filter by userId
    .then((deleteStatus) => {
        if(deleteStatus.deletedCount > 0) { // a workout was successfully deleted
            res.status(200).send({ 
                message: 'Workout deleted successfully'
            });
        }else{
            return res.status(404).send({error : 'Workout not found'});
        }
    })
    .catch(error => errorHandler(error, req, res));  
};

module.exports.completeWorkoutStatus = (req, res) => {
    const userId = req.user.id; // Retrieved from JWT
    const workoutId = req.params.workoutId;
    let updatedWorkout = {
        status: 'completed'
    }

    return Workout.findOneAndUpdate({ _id: workoutId, userId }, updatedWorkout, { new: true }) // Filter by userId
    .then(workout => {
        if (workout) {
            return res.status(200).json({
                message : 'Workout status updated successfully',
                workout
            });
        } else {
            return res.status(404).send({error : 'Workout not found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
};