const boom = require('boom')
const mongoose = require('mongoose');
const User = require('../../models/User');
const Decoration = require('../../models/Decoration');
const DemandeNomination = require('../../models/DemandeNomination')
const { PermissionTypes } = require('../../security/permissionTypes');
const { Permissions } = require('../../security/permissions');
require('dotenv').config()
const jwt = require('jsonwebtoken');

// Get all users
exports.getPendingNominationUsers = async (req, reply) => {
  try {
    const users = await User.find({nominations: {$elemMatch: { $or: [{sd: {$gte: new Date("2020-09-01")}}, {sd: null}, {sd: {$exists:false}}], type: {$ne: "Membre"}, "approved": {$ne: true}, "ed": null}}},{"details":0, formations: 0})
    return users
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Get all contactable users
exports.getContacts = async (req, reply) => {
  if(Permissions(req.headers.authorization, PermissionTypes.ViewUsers)) {
    try {
      const users = await User.find({nominations: {$elemMatch: { type: {$ne: "Membre"}, "ed": null }}},{_id:1, courriel:1, nom:1, prenom:1})
      return users.map(x => {return { nom: `${x.prenom} ${x.nom}`, courriel: x.courriel}})
    } catch (err) {
      throw boom.boomify(err)
    }
  }
  else {
    reply.code(403)
    return "Forbidden"
  }  
}

exports.getBasicUsersWithPaging = async (req, reply) => {  
  if(Permissions(req.headers.authorization, PermissionTypes.ViewUsers)) {
    try {
      const {page, pageSize, query, activeOnly} = req.query
      var skip = parseInt(page) > 1 ? parseInt((page-1))*pageSize : 0;
      var active = activeOnly == "true" ? true : false;
      var users;
      var count;

      var nominationFilter;

      if(active) {
        nominationFilter = {$elemMatch: {ed: null}};
      }
      else {
        nominationFilter = {$exists: true};
      }
  
      if(query && query.trim() !== "") {
        var regex = new RegExp(".*" + query.trim().replace(" ","|") + "*.", "i")
  
        users = await User.find({          
          $or: 
          [          
            {courriel: {$regex: regex}}, 
            {prenom: {$regex: regex}}, 
            {nom: {$regex: regex}},
            {"formations.niveau.name": {$regex: regex}}
          ],
          "nominations": nominationFilter
        },{_id:1, courriel:1, nom:1, prenom:1, nominations: 1, formations: 1 })
          .sort({nom:1})
          .skip(skip)
          .limit(parseInt(pageSize))
        count = await User.find({$or: 
          [
            {courriel: {$regex: regex}}, 
            {prenom: {$regex: regex}}, 
            {nom: {$regex: regex}},
            {"formations.niveau.name": {$regex: regex}}
          ],
          "nominations": nominationFilter
        },{_id:1}).countDocuments()
      }
      else {
        users = await User.find({
          "nominations": nominationFilter
        },{_id:1, courriel:1, nom:1, prenom:1, nominations: 1, formations: 1}).sort({prenom:1}).skip(skip).limit(parseInt(pageSize))
        count = await User.find({
          "nominations": nominationFilter
        },{_id:1}).countDocuments()
      }
      return { users, page: parseInt(page), count }
    } catch (err) {
      throw boom.boomify(err)
    }
  }
  else {
    reply.code(403)
    return "Vous n'avez pas le droit de visualiser la liste des membres"
  }  
}

// Search in users
exports.searchUsers = async (req, reply) => {
  try {
    const { query } = req.body
    const users = await User.find({ 
      $text: { $search:  query }
      },{details:0, formations:0, score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
    return users
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Search in users
exports.searchUsersWithFormations = async (req, reply) => {
  if(Permissions(req.headers.authorization, PermissionTypes.RecommendFormation)) {
    try {
      const { query } = req.body
      var regex = new RegExp("^" + query.toLowerCase().replace(" ","|"), "i")
      const users = await User.find({$or: 
        [
          {courriel: {$regex: regex}}, 
          {prenom: {$regex: regex}}, 
          {nom: {$regex: regex}}
        ]},{details:0, nominations:0})
      return users
    } catch (err) {
      throw boom.boomify(err)
    }
  }
  else {
    reply.code(403)
    return "Forbidden"
  }  
}

// Search users by formation
exports.searchUsersWithPendingFormations = async (req, reply) => {
  if(Permissions(req.headers.authorization, PermissionTypes.RecommendFormation)) {
    try {
      const users = await User.find({formations: {$elemMatch: {dateConfirme: null, dateRecommende: {$ne: null}}}},{nominations:0,details:0})
      return users
    } catch (err) {
      throw boom.boomify(err)
    }
  }
  else {
    reply.code(403)
    return "Forbidden"
  }  
}

exports.getUsersByUnit = async (req, reply) => {
  if(Permissions(req.headers.authorization, PermissionTypes.SubmitRecensement)) {
    try {
      const id = req.params.id
      const users = await User.aggregate([
        {$unwind: "$nominations"},
        {$match: {
          $or:[{"nominations.unitId": id}, {"nominations.unitId": mongoose.Types.ObjectId(id)}],
          "nominations.ed": null
        }}
      ]);

      return users
    } catch (err) {
      throw boom.boomify(err)
    }
  }
  else {
    reply.code(403)
    return "Forbidden"
  }
}

exports.removeFromUnit = async (req, reply) => {
  if(Permissions(req.headers.authorization, PermissionTypes.SubmitRecensement)) {
    try {    
      const { userId, unitId, type} = req.body

      const update = await User.collection.updateOne({
        _id: mongoose.Types.ObjectId(userId), 
        nominations: { 
          $elemMatch : {
            $or: [
              {
                "unitId": unitId
              },
              {
              "unitId": mongoose.Types.ObjectId(unitId)
              }
            ],
            "ed": null,
            "type": type}}
          }, 
          {
          $set: {
            "nominations.$.ed": new Date()
          }
        })

      return update
    } catch (err) {
      throw boom.boomify(err)
    }
  }
  else {
    reply.code(403)
    return "Forbidden"
  }
}

exports.getUsersByGroup = async (req, reply) => {
  try {
    const id = req.params.id
    const users = await User.find({"nominations.groupId": id},{"details":0})
    return users
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Get single user by ID
exports.getSingleUser = async (req, reply) => {
  if(Permissions(req.headers.authorization, PermissionTypes.ViewUsers)) {
    try {
      const id = req.params.id
      const user = await User.find({_id: id},{"details.ramq":0})
      return user
    } catch (err) {
      throw boom.boomify(err)
    }
  }
  else {
    reply.code(403)
    return "Forbidden"
  }
}

exports.getMultipleUsers = async (req, reply) => {
  try {
    const ids = req.body
    const user = await User.find({_id: {$in: ids }},{"details":0})
    return user
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Add a new user
exports.addUser = async (req, reply) => {
  try {
    const userModel = req.body

    const user = new User(
    {
      courriel: userModel.courriel,
      prenom: userModel.prenom,
      nom: userModel.nom
    })
    return user.save()
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Add a new user
exports.addUsers = async (req, reply) => {
  if(Permissions(req.headers.authorization, PermissionTypes.SubmitRecensement)) {
    try {
      const userModels = req.body

      return User.insertMany(userModels)
    } catch (err) {
      throw boom.boomify(err)
    }
  }
  else {
    reply.code(403)
    return "Forbidden"
  }
}

// Update an existing user
exports.updateProfile = async (req, reply) => {
  if(Permissions(req.headers.authorization, PermissionTypes.UpdateUser)) {
    try {
      const user = req.body
      const id = user.id
      const { ...updateData } = user
      const update = await User.findByIdAndUpdate(id, updateData, { new: true })
      return update
    } catch (err) {
      throw boom.boomify(err)
    }
  }
  else {
    reply.code(401)
    return "Vous n'avez pas le droit de faire la mise à jour de ce membre"
  }
}

// Update an existing user
exports.updateUser = async (req, reply) => {
  var userId = jwt.verify(req.headers.authorization, process.env.signingsecret).permissions._id; 
  const user = req.body
  const id = user.id

  if(Permissions(req.headers.authorization, PermissionTypes.UpdateUser) || userId == id) {
    try {
      const { ...updateData } = user
      const update = await User.findByIdAndUpdate(id, updateData, { new: true })
      return update
    } catch (err) {
      throw boom.boomify(err)
    }
  }
  else {
    reply.code(401)
    return "Vous n'avez pas le droit de faire la mise à jour de ce membre"
  }
}

// Delete a user
exports.deleteUser = async (req, reply) => {
  if(Permissions(req.headers.authorization, PermissionTypes.DeleteUser))
  {
    try {
      const id = req.params.id
      const user = await User.findByIdAndRemove(id)
      return user
    } catch (err) {
      throw boom.boomify(err)
    }
  }
  else {
    reply.code(401)
    return "La suppression n'est pas permise"
  }
}

exports.FuseUsers = async (req, reply) => {
  if(Permissions(req.headers.authorization, PermissionTypes.FuseUsers)) {
    try {
      const { memberToFuse, targetMember } = req.body

      const toFuse = await User.findOne({_id: memberToFuse._id})

      const target = await User.findOne({_id: targetMember._id})

      const updateData = { 
        nominations: [...toFuse.nominations, ...target.nominations],
        formations: [...toFuse.formations, ...target.formations]
      }
      
      const userUpdate = await User.findByIdAndUpdate(targetMember._id, updateData, { new: true });
      const decorationUpdate = await Decoration.updateMany({membre: memberToFuse._id}, {$set: {membre:targetMember._id}});
      const nominationUpdate = await DemandeNomination.updateMany({user: memberToFuse._id}, {$set: {user:targetMember._id}});

      const del = await User.findByIdAndDelete(toFuse._id)

      return { userUpdate, decorationUpdate, nominationUpdate};
    } catch (err) {
      throw boom.boomify(err)
    }
  }
  else {
    reply.code(401)
    return "Vous n'avez pas le droit de fusionner des dossiers"
  }
}