const User = require("../../models/user");
const Community = require("../../models/community");
const Member = require("../../models/member");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Thisismysecretkey";
const currentUser = require("../middleware/getcurrentUser");
const role = require("../../models/role");

exports.Create = async (req, res, next) => {
  try {
    const { name } = req.body;

    const community = await Community.findOne({ name: name });

    if (community) {
      console.log("This community is already available");
      res.status(401).json({ message: "This community is already available" });
    }

    const newCommunity = await new Community();
    newCommunity.name = name;
    newCommunity.slug = name.trim();

    const currUser = await currentUser(req.cookies.token);
    newCommunity._id = currUser._id;

    await newCommunity.save();

    const responseData = {
      status: true,
      content: {
        data: {
          _id: newCommunity._id,
          name: newCommunity.name,
          slug: newCommunity.name.trim(),
          owner: newCommunity.owner,
          created_at: newCommunity.createdAt,
          updated_at: newCommunity.updatedAt,
        },
      },
    };
    console.log(responseData);
    res.status(200).json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const page = 1;
    const limit = 10;
    const communities = await Community.find()
      .populate("owner", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    let count = await Community.find().count();
    const ResponseData = {
      status: true,
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / limit),
          page: page,
        },
        data: communities.map((community) => ({
          id: community._id,
          name: community.name,
          slug: community.slug,
          owner: {
            id: community.owner,
            name: community.name,
          },
          createdAt: community.createdAt,
          updatedAt: community.updatedAt,
        })),
      },
    };
    res.status(200).json(ResponseData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllMembers = async (req, res, next) => {
  try {
    const page = 1;
    const limit = 10;

    const communityName = req.params.id;

    const community = await Community.findOne({ name: communityName });

    if (community === null) {
      console.log("No such community found!");
      res.status(404).json({ message: "No such community found!" });
    }
    console.log(community._id);
    const members = await Member.find({
      community: community._id,
    })
      .populate({ path: "user", select: "name" })
      .populate({ path: "role", select: "name" })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Member.find({ community: community._id }).count();

    const responseData = {
      status: true,
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / limit),
          page: page,
        },
        data: members.map((member) => ({
          id: member._id,
          community: member.community,
          user: {
            id: member.user._id,
            name: member.user.name,
          },
          role: {
            id: member.role,
            name: member.role.name,
          },
          created_at: member.createdAt,
        })),
      },
    };
    res.status(200).json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getMyOwnedCommunity = async (req, res, next) => {
  try {
    const page = 1;
    const limit = 10;

    const currUser = await currentUser(req.cookies.token);

    const community = await Community.find({ owner: currUser._id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Community.find({ owner: currUser._id }).count();

    const ResponseData = {
      status: true,
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / limit),
          page: page,
        },
        data: community.map((community) => ({
          id: community._id,
          name: community.name,
          slug: community.slug,
          owner: community.owner,
          createdAt: community.createdAt,
          updatedAt: community.updatedAt,
        })),
      },
    };
    res.status(200).json(ResponseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getMyJoinedCommunity = async (req, res, next) => {
  try {
    const page = 1;
    const limit = 10;

    const currUser = await currentUser(req.cookies.token);

    const members = await Member.find({ user: currUser._id }).populate({
      path: "community",
      select: ["_id", "name", "slug", "owner", "createdAt", "updatedAt"],
      populate: { path: "owner", model: "User", select: "name" },
    });

    const joinedCommunities = members.map((member) => {
      const { _id, name, slug, owner, createdAt, updatedAt } = member.community;

      return {
        id: _id,
        name,
        slug,
        owner: {
          id: owner._id,
          name: owner.name,
        },
        created_at: createdAt,
        updated_at: updatedAt,
      };
    });

    const ResponseData = {
      status: true,
      content: {
        meta: {
          total: joinedCommunities.length,
          pages: Math.ceil(joinedCommunities.length / limit),
          page: page,
        },
        data: joinedCommunities,
      },
    };
    res.status(200).json(ResponseData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
