const db = require("mongoose")

const schema = db.Schema(
	{
		userId: {
			type: db.ObjectId,
			require: true
		},
		name: {
			type: String,
			require: true
		},
		email: {
			type: String,
			require: true
		},
		description: {
			type: String,
			require: true
		},
		category: {
			type: Number,
			require: true
		}
	}
);

const Contact = db.model("Contacts", schema);


module.exports = Contact
