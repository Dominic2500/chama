import { getDatabase, ref, set } from "firebase/database";
import { getDatabase, ref, set } from "firebase/database";

function writeUserData(userId, name, email, imageUrl) {
    const db = getDatabase();
    set(ref(db, 'users/' + userId), {
        username: name,
        email: email,
        profile_picture : imageUrl
    });
}

// Call the writeUserData function with the desired arguments
writeUserData('user123', 'John Doe', 'johndoe@example.com', 'https://example.com/profile.jpg');

