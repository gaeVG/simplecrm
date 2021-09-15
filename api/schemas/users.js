const db = require("mongoose")

const schema = db.Schema(
	{
		email: {
			type: String,
			unique: true
		},
		password: {
			type: String,
			require: true
		}
	}
);

const User = db.model("User", schema);

module.exports = User
