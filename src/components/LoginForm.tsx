import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  const handleUpdateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleUpdatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleLogin = async () => {
    // const { data, error } = await supabase.auth.signUp({
    //   email,
    //   password
    // })

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    console.log({ data, error })

    if (error) {
      alert(error.message)
    } else {
      window.location.href = '/feed'
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert(error.message)
    } else {
      window.location.href = '/feed'
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      console.log({ data, error })

      setLoggedIn(data?.session !== null)
    })
  }, [])

  return (
    <div className="p-4 flex flex-col gap-4">
      {loggedIn ? (
        <button className="bg-white rounded-full py-2 px-4 font-bold text-black" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <>
          <input
            className="py-2 px-4 text-center border bg-transparent rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleUpdateEmail}
          />

          <input
            className="py-2 px-4 text-center border bg-transparent rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handleUpdatePassword}
          />

          <button className="bg-white rounded-full py-2 px-4 font-bold text-black" onClick={handleLogin}>
            Login
          </button>
        </>
      )}
    </div>
  )
}
