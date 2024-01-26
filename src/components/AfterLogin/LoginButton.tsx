import React from 'react'

export default function LoginButton() {
  const [email, setEmail] = React.useState('')

  const handleSubmit = async () => {
    const body = {
      destination: email,
      name: 'test',
      redirectURL: 'http://localhost:3000/admin',
      type: 'login',
    }
    const response = await fetch('http://localhost:3000/api/auth/magiclogin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const { error } = await response.json()
    if (error) {
      throw new Error(error.message)
    }
  }

  return (
    <div>
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit}>Login</button>
    </div>
  )
}
