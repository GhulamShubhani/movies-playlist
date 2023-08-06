
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDiP-N8NpoUZ4S2nCv8Z7UP_lLEi5wu93w",
    authDomain: "ecom-d8023.firebaseapp.com",
    projectId: "ecom-d8023",
    storageBucket: "ecom-d8023.appspot.com",
    messagingSenderId: "741525210066",
    appId: "1:741525210066:web:9339b272d261087135fe0b",
    measurementId: "G-JP58WQXHBE"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const storage = getStorage(app);
  export const messaging = getMessaging(app);
  
  export const onMessageListener = () => {
    return new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        console.log("hh", payload);
        resolve(payload);
      });
    });
  };
  
  export const requestForToken = () => {
    return getToken(messaging, {
      vapidKey:
        "BDSSI5I_PnD0jcverR4BZjfAygkv3HlmrqywueN_6F35BGraPmeVkIZUZkWnPis9VqfMTCEdYE--RpA5ZMBVwJI",
      forceRefresh: true,
    })
      .then((currentToken) => {
        if (currentToken) {
          console.log(currentToken);
          return currentToken;
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });
  };
  
  export default app;
  
