import admin from "../firebase/index"

const db = admin.firestore();

export const db;

//adds data to a collection. Creates a new collection if collection not found
export async function addData(collection, data) {
    try {
        const result = await db.collection(collection).doc().set(data);
        console.log("Data successfully added!");
        return result;
    } catch (e) {
        console.error("Error adding data: ", error);
        throw e;
    }
}

//updates the entire documents data
export async function updateDoc(collection, doc, data) {
    try {
        const result = await db.collection(collection).doc(doc).set(data);
        console.log("Document successfully added!");
        return result;
    } catch (e) {
        console.error("Error adding document: ", error);
        throw e;
    }
}

//updates only the given fields in a collection
export async function updateField(collection, doc, data) {
    try {
        const result = await db.collection(collection).doc(doc).set(data, {merge:true});
        console.log("Field/s successfully added!");
        return result;
    } catch (e) {
        console.error("Error adding field/s: ", error);
        throw e;
    }
}

//returns the documents in a collection
export async function getDoc(collection) {
    try {
        const result = await db.collection(collection).onSnapshot().then(snap => {
            snap.forEach(doc => {
                console.log(doc.data());
                console.log(doc.id);
            });
        });
        console.log("Document successfully returned!");
        return result;
    } catch (e) {
        console.error("Error returning document: ", error);
        throw e;
    }
}

//returns the data in a collection
export async function getData(collection, doc) {
    try {
        const result = await db.collection(collection).doc(doc).get();
        console.log("Data successfully returned!");
        return result;
    } catch (e) {
        console.error("Error returning data: ", error);
        throw e;
    }
}

//deletes the document from a collection
export async function deleteDoc(collection, doc) {
    try {
        const result = await db.collection(collection).doc(doc).delete();
        console.log("Document successfully deleted!");
        return result;
    } catch (e) {
        console.error("Error deleting document: ", error);
        throw e;
    }
}

//deletes a field from a document
export async function deleteField(collection, doc, field) {
    let fieldValue = admin.firestore.FieldValue;
    let updates = {};
    updates[field] = fieldValue.delete();

    try {
        const result = await db.collection(collection).doc(doc).update(updates);
        console.log("Field successfully deleted!");
        return result;
    } catch (e) {
        console.error("Error deleting field: ", error);
        throw e;
    }
}
