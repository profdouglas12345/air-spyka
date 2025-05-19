
const firebaseConfig = {
  apiKey: "AIzaSyCvwRC7btvhTM-Q673lm8TcO_3gxoc8H78",
  authDomain: "certifica-aluno.firebaseapp.com",
  projectId: "certifica-aluno",
  storageBucket: "certifica-aluno.firebasestorage.app",
  messagingSenderId: "103666376104",
  appId: "1:103666376104:web:8a96d78d8ae5b8c98ad19d"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
