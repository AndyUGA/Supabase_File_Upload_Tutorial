import { Auth } from '@supabase/auth-ui-react'
import {
  ThemeSupa,
} from '@supabase/auth-ui-shared'
import { useEffect, useState } from "react";

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_ANON_KEY,
)

function App() {

  const [notes, setNotes] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [newNote, setNewNote] = useState('');



  const getUser = async () => {

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser()
      if (user != null) {
        setIsLoggedIn(true);
        setUserId(user.id);
      } else {
        setIsLoggedIn(false);
        setUserId('');
      }
    } catch (e) {
    }
    finally {
      setLoading(false);
    }


  }

  const signout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserId('');

  }
  const fetchNotes = async () => {
    const { data } = await supabase.from('notes').select('*');

    if (data) {
      setNotes(data);
    }
  }

  const addNotes = async () => {
    await supabase
      .from('notes')
      .insert([
        { description: newNote, user_id: userId },
      ]);

    await fetchNotes();
    setNewNote('');
  }
  useEffect(() => {
    getUser();
    fetchNotes();
    supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
        },
        (payload) => {
          fetchNotes();
        }
      )
      .subscribe()
  }, [])

  return (
    <div>
      {isLoggedIn && !loading ? <div>
        My Notes:
        {notes && (
          <div>
            {notes.map(notes => (
              <div>
                {notes.description}
              </div>
            ))}
          </div>
        )}
        <div>
          <br />
          <br />

          <input placeholder='Add Note' value={newNote} onChange={(e) => {
            setNewNote(e.target.value);
          }} />

          <button onClick={addNotes}> Save Note </button>
        </div>

        <br />
        <button onClick={signout}>
          Logout
        </button>
      </div> : null}

      {!isLoggedIn && !loading ? <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
      /> : null}


    </div>
  )
}




export default App;
