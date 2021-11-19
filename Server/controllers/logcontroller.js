const Express = require("express");
const router = Express.Router();
const { LogModel } = require("../models");
let validateJWT = require("../middleware/validate-jwt");


//CREATE LOG - VERIFIED
router.post('/create', validateJWT, (req, res) => {
  const {description, definition, result} = req.body.log;
  console.log(req.user.id, description, definition, result);
  
  LogModel.create({
    description,
    definition,
    result,
    owner_id: req.user.id
  })
    .then(log => res.status(201).json(log))
    .catch(err => res.status(500).json(err))
})



//GET ALL OF A USERS LOGS

router.get("/mylogs", validateJWT, async (req, res) => {
      const{id} = req.user;
      try {
        const userLogs = await LogModel.findAll({
          where: {
            owner_id: id
          }
        })
        res.status(200).json(userLogs);
      } catch(err) {
        res.status(500).json({error:err})
      }
})

//GET INDIVIDUAL LOG BY LOG ID - VERIFIED
router.get("/:id", validateJWT,  (req, res) => {
  LogModel.findAll({
    where: { id: req.params.id, 
            owner_id: req.user.id},
  })
    .then((log) => res.status(200).json(log))
    .catch((err) => res.json(err));
});

//UPDATE SPECIFIC LOG - 
router.put("/update/:logId", validateJWT, async (req, res) => {
  const { description, definition, result} = req.body.log;
  const logId = req.params.logId;
  const ownerId = req.user.id;

  const query = {
    where: {
      id: logId,
      owner_id: ownerId,
    },
  };

  const updatedLog = {
    description: description,
    definition: definition,
    result: result,
    owner_id: ownerId
  };

  try {
    const update = await LogModel.update(updatedLog, query);
    res.status(200).json(update);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

//DELETE A LOG

router.delete("/delete/:id", validateJWT, async (req, res) => {
  const owner_id = req.user.id;
  const log_id = req.params.id;

  try {
    const query = {
      where: {
        id: log_id,
        owner_id: owner_id,
      },
    };

    await LogModel.destroy(query);
    res.status(200).json({ message: "Log Entry Removed" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
