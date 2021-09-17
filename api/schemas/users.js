const db = require("mongoose")

const schema = new db.Schema(
	{
		email: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true
		},
		group: {
			type: String
		}
	}
);

const model = db.model("User", schema);

module.exports = model
