const db = require("mongoose");

const schema = new db.Schema(
	{
		userId: {
			type: db.ObjectId,
			required: true,
			ref: "User"
		},
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			unique: true,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		category: {
			type: Number,
			required: true
		}
	}
);

const model = db.model("Contacts", schema);


module.exports = model;
