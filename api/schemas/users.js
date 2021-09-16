const db = require("mongoose")

const schema = db.Schema(
	{
		email: {
			type: String,
			unique: true,
			required: true
		},
		password: {
			type: String,
			require: true
		},
		group: {
			type: String
		}
	}
);

const model = db.model("User", schema);

module.exports = model
