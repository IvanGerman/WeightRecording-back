const Members = require('../models/Members');
  


//GetMembers--------------------------------------------------------------------------------------------
module.exports.getMembers = async function(req, res) { console.log('getMembers');

  try {
    const allMembers = await Members.find();
    res.status(200).json(allMembers);
  } catch(err) {
    res.status(405).json({
      message: 'an error occured!'
    })
  }     
};




//PostMembers--------------------------------------------------------------------------------------------
module.exports.postMembers = async function(req, res) {
  console.log('postMember...');

// check is this member already in DB 
  const isMemberInDB = await Members.findOne({member: req.body.member});
  if (isMemberInDB) {
    res.status(409).json({
      message: 'this member is already in DB!'
    })
  } else { //create new Members
    const member = new Members({
      member: req.body.member,
      weights: req.body.weight
    });

    try {
      await member.save();
      res.status(201).json(member);
    } catch(err) {
      res.status(400).json({
        message: 'error occured'
      })
    }
  }
};

module.exports.deleteMembers = async function(req, res) {
  
  try {
    // check is this members in DB 
  const isMembersInDB = await Members.findOne({_id: req.params.id});
  if (!isMembersInDB) {
    res.status(404).json({
      message: 'this members is not in DB!'
    })
  } else { //delete members
    await Members.deleteOne({ _id: req.params.id });
    res.status(200).json(`${isMembersInDB.name} is deleted`);
  }
  } catch(err) {
    res.status(404).json({
      message: 'error occured!'
    })
  }     
};




  //PostWeight-------------------------------------------------------------------------
  
  module.exports.postWeight = async function(req, res) {
    console.log('postWeight...');
  
  // check is this member already in DB 
    const memberInDB = await Members.findOne({member: req.body.member}).lean();
    
    if (memberInDB) {
      // here we push new weight of a member into the array of his weights
      try {
        await Members.updateOne({ member: req.body.member }, { $push: { weights: req.body.weight } });
        res.status(200).json({
          message: `weight pushed to DB!  ${memberInDB.member}`
        })
      } catch(err) {
        res.status(400).json({
          message: 'error occured'
        })
      }

    } else { 
      res.status(404).json({
        message: 'no such member in DB!'
      }) 
      
    }
  };





  //UpdateWeight-------------------------------------------------------------------------

module.exports.updateWeight = async function(req, res) { console.log('updateWeightcontroller------');
    
  //create filter to find element to update
  let elemToUpdate = await Members.findOne({ member: req.body.member });
  console.log('elemToUpdate--',elemToUpdate);
  //elemToUpdate = elemToUpdate.weights[elemToUpdate.weights.length - 1].weight;
  let newWeights = [...elemToUpdate.weights];
  console.log('newWeights--',newWeights);
  newWeights[newWeights.length - 1].weight = req.body.weight;
  try {
     const result = await Members.findOneAndUpdate(
      { member: req.body.member },
      { weights : newWeights},
      { new: true });
     res.status(200).json(`Weight has been updated, new weight  is: ${req.body.weight} `);
  } catch {
      res.status(400).json({
      message: 'error occured'
      })
    }
  };