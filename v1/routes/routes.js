const express = require("express");
const router = express.Router();
const authroutes = require("./auth.routes");
const roleController = require("../controllers/roleController");
const communityController = require("../controllers/communityController");
const memberController = require("../controllers/memberController");

router.use("/auth", authroutes);

router.post("/role", roleController.create);

router.get("/role", roleController.getAll);

router.post("/community", communityController.Create);

router.get("/community", communityController.getAll);

router.get("/community/:id/members", communityController.getAllMembers);

router.get("/community/me/owner", communityController.getMyOwnedCommunity);

router.get("/community/me/member", communityController.getMyJoinedCommunity);

router.post("/member", memberController.addMember);

router.delete("/member/:id", memberController.removeMember);

module.exports = router;
