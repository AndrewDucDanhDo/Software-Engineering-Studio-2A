import admin from "../firebase/index"

const db = admin.firestore();

export const db;

//adds data to a collection. Creates a new collection if collection not found
export function addData(collection, data) {
    db.collection(collection).doc().set(data).then(function () {
        console.log("Data successfully added!");
    }).catch(
        function (error) {
            console.error("Error adding data: ", error);
        }
    );
}

//updates the entire documents data
export function updateDoc(collection, doc, data) {
    db.collection(collection).doc(doc).set(data).then(function () {
        console.log("Document successfully updated!");
    }).catch(
        function (error) {
            console.error("Error updating document: ", error);
        }
    );;
}

//updates only the given fields in a collection
export function updateField(collection, doc, data) {
    db.collection(collection).doc(doc).set(data, { merge: true }).then(function () {
        console.log("Field/s successfully updated!");
    }).catch(
        function (error) {
            console.error("Error updating Field/s: ", error);
        }
    );;
}

//returns the documents in a collection
export function getDoc(collection) {
    db.collection(collection).onSnapshot().then(snap => {
        snap.forEach(doc => {
            console.log(doc.data());
            console.log(doc.id);
        });
    });
}

//returns the data in a collection
export function getDocData(collection, doc) {
    return db.collection(collection).doc(doc).get().then(function () {
        console.log("Data successfully returned!");
    }).catch(
        function (error) {
            console.error("Error returning data: ", error);
        }
    );;
}

//deletes the document from a collection
export function deleteDoc(collection, doc) {
    db.collection(collection).doc(doc).delete().then(function () {
        console.log("Document successfully deleted!");
    }).catch(
        function (error) {
            console.error("Error deleting document: ", error);
        }
    );
}

//deletes a field from a document
export function deleteField(collection, doc, field) {
    let fieldValue = admin.firestore.FieldValue;
    let updates = {};
    updates[field] = fieldValue.delete()

    db.collection(collection).doc(doc).update(updates).then(function () {
        console.log("Field successfully deleted!");
    }).catch(
        function (error) {
            console.error("Error deleting field: ", error);
        }
    );;
}
