import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js'

import {
  Auth,
  ThemeSupa,
} from '@supabase/auth-ui-react'

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_ANON_KEY
)


function App() {

  return (

    <div>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}

      />
    </div>


  );
}

export default App;
