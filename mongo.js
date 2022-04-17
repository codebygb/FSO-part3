const mongoose = require("mongoose");
console.log("Arg length: " + process.argv.length);
if (!(process.argv.length === 3 || process.argv.length === 5)) {
  console.log(
    "To Read all contacts usage: node mongo.js <PASSWORD>\n To Add a contact usage: node mongo.js <PASSWORD> <NAME> <NUMBER>"
  );
  process.exit(1);
}
const password = process.argv[2];
const name = process?.argv[3];
const number = process?.argv[4];
const url = `mongodb+srv://dbbygb:${password}@learncluster0.cbr5s.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: name,
  number: number,
});

if (name) {
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log("Phonebook::");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
