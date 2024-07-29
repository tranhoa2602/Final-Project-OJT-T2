import { database } from '../../firebaseConfig';
import { ref, set, get, update, remove } from "firebase/database";

// Create
export const createData = (id, data) => {
    set(ref(database, 'data/' + id), data);
};

// Read
export const readData = async (id) => {
    const snapshot = await get(ref(database, 'data/' + id));
    return snapshot.exists() ? snapshot.val() : null;
};

// Update
export const updateData = (id, data) => {
    update(ref(database, 'data/' + id), data);
};

// Delete
export const deleteData = (id) => {
    remove(ref(database, 'data/' + id));
};
