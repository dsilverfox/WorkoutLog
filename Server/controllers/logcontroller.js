const Express = require("express");
const router = Express.Router();
const { models } = require("../models");
let validateJWT = require("../middleware/validate-jwt");


//CREATE LOG
router.post('/create', (req, res) => {
  const {description, definition, result, owner_id} = req.body.log;
  models.LogModel.create({
    description,
    definition,
    result,
    owner_id
  })
    .then(log => res.status(201).json(log))
    .catch(err => res.json(err))
})


//GET ALL OF A USERS LOGS

router.get("/user", validateJWT, async (req, res) => {
  const { id } = req.user;
  try {
    const userLogs = await LogModel.findAll({
      where: {
        owner: id,
      },
    });
    res.status(200).json(userLogs);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

//GET INDIVIDUAL LOG BY ID
router.get("/:id", (req, res) => {
  models.LogModel.findAll({
    where: { id: req.params.log_id },
  })
    .then((log) => res.status(200).json(log))
    .catch((err) => res.json(err));
});

//UPDATE SPECIFIC LOG
router.put("/update/:logId", validateJWT, async (req, res) => {
  const { description, definition, result, owner_id } = req.body.log;
  const logId = req.params.logId;
  const userId = req.user.id;

  const query = {
    where: {
      id: logId,
      owner: userId,
    },
  };

  const updatedLog = {
    description: description,
    definition: definition,
    result: result,
    owner_id: owner_id
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
  const ownerId = req.user.id;
  const logId = req.params.id;

  try {
    const query = {
      where: {
        id: logId,
        owner: ownerId,
      },
    };

    await LogModel.destroy(query);
    res.status(200).json({ message: "Log Entry Removed" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
