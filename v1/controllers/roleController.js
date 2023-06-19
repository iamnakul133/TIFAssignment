const User = require("../../models/user");
const Role = require("../../models/role");
const { Snowflake } = require("@theinternetfolks/snowflake");
exports.create = async (req, res, next) => {
  try {
    const role = await Role.findOne({ name: req.body.name });

    if (role) {
      console.log("Role already exists!");
      res.status(404).json({ message: "Role already exists!" });
    } else {
      let role = await new Role();
      role.name = req.body.name;
      role._id = Snowflake.generate().toString();
      await role.save();

      const responseData = {
        status: true,
        content: {
          data: {
            _id: role._id,
            name: role.name,
            created_at: role.createdAt,
            updated_at: role.updatedAt,
          },
        },
      };
      res.status(200).json(responseData);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const page = 1;
    const limit = 10;
    const role = await Role.find({})
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Role.count();

    const responseData = {
      status: true,
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / limit),
          page: page,
        },

        data: role.map((role) => ({
          id: role._id,
          name: role.name,
          created_at: role.createdAt,
          updated_at: role.updatedAt,
        })),
      },
    };
    res.status(200).json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
