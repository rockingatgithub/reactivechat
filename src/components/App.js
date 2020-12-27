
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState, useRef } from "react";

firebase.initializeApp({
  apiKey: "AIzaSyBjAzytVw_yUq8dOquXGxZFBRBXDo-FAPQ",
  authDomain: "reactivechat-7a47e.firebaseapp.com",
  projectId: "reactivechat-7a47e",
  storageBucket: "reactivechat-7a47e.appspot.com",
  messagingSenderId: "573689384061",
  appId: "1:573689384061:web:ac72f5d5e1c735e8dbf514",
  measurementId: "G-L6LJ0WQ7NT",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function SignIn(){
  const signInwithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInwithGoogle}>Sign In with google</button>
  )

}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut() }>Sign Out</button>
  )
}

function ChatRoom(){
  const dummy = useRef()
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

   const sendMessage = async(e) => {
     e.preventDefault();
     const {  uid, photoURL} = auth.currentUser;

     await messageRef.add({
       text: formValue,
       createdAt: firebase.firestore.FieldValue.serverTimestamp(),
       uid, 
       photoURL,
     })
     setFormValue('');
     dummy.current.scrollIntoView({behaviour: 'smooth'});
   }

  return ( 
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}>

        </div>
      </main>
      <form onSubmit={sendMessage}> 
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit"> Send </button>
      </form>
    </>
  )

}

function App() {
  const [user] = useAuthState(auth);
  return <div className="App">
    <header>

    </header>
    <section>
      {user ? <ChatRoom/> : <SignIn/>}
    </section>
  </div>;

}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`messgae ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
