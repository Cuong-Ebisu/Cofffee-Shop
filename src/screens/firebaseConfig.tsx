import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWFbtFsafPZj_-I4eSqzrmBFxk2wkY16E",
  authDomain: "coffeeshop-5a7a6.firebaseapp.com",
  databaseURL: "https://coffeeshop-5a7a6-default-rtdb.firebaseio.com",
  projectId: "coffeeshop-5a7a6",
  storageBucket: "coffeeshop-5a7a6.appspot.com",
  messagingSenderId: "841962225313",
  appId: "1:841962225313:web:c542849dd8fc35404e3ae0",
  measurementId: "G-TKVJZ3F9P0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
