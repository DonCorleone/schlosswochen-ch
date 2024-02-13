// Select the database to use.
use("staticDb");

db.getCollection("schlosswochen-content-index")
  .find({})
  .forEach(function (doc) {
    if (doc.title) {
      doc.key = doc.title;
      delete doc.title;
    }
    db.getCollection("schlosswochen-content-index").replaceOne(
      { _id: doc._id },
      doc
    );
  });

db.getCollection("schlosswochen-content-index").find({});
