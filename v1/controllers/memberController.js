const Member = require("../../models/member");
const Community = require("../../models/community");
const User = require("../../models/user");
const Role = require("../../models/role");
const currentUser = require("../middleware/getcurrentUser");

exports.addMember = async (req, res, next) => {
  try {
    const { communityId, userId, roleId } = req.body;

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Login again" });
    }

    const currUser = await currentUser(req.cookies.token);

    const community = await Community.findOne({ _id: communityId });
    console.log(community.owner);
    console.log(currUser._id);
    if (!(community.owner === currUser._id)) {
      console.log("Not Allowed Access Error");
      res.status(404).json({ message: "Not Allowed Access Error" });
    } else {
      const member = await new Member();
      member.community = communityId;
      member.user = userId;
      member.role = roleId;

      await member.save();
      console.log(member);

      const responseData = {
        status: true,
        content: {
          data: {
            id: member._id,
            community: member.community,
            user: member.user,
            role: member.role,
            created_at: member.createdAt,
          },
        },
      };

      res.status(200).json(responseData);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    const memberId = req.params.id;

    if (!token) {
      return res.status(401).json({ message: "Login again" });
    }

    const currUser = await currentUser(req.cookies.token);

    const member = await Member.findOne({ _id: memberId });

    const adminRole = await Role.findOne({ name: "Community Admin" });
    const moderatorRole = await Role.findOne({ name: "Community Moderator" });

    if (!(member.user === currUser._id)) {
      res.status(404).json({ message: "Not Allowed Access" });
    } else if (
      !(member.role === adminRole._id || member.role === moderatorRole._id)
    ) {
      res.status(403).json({ message: "Not Allowed Access" });
    } else {
      await Member.deleteOne({ _id: memberId });
      const responseData = {
        status: true,
      };
      res.status(200).json(responseData);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
