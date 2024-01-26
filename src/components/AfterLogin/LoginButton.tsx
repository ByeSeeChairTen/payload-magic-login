import React from 'react'

export default function LoginButton() {
  const [success, setSuccess] = React.useState(false)
  const [email, setEmail] = React.useState('')

  const handleSubmit = async () => {
    const body = {
      destination: email,
      target: 'admin',
    }
    const response = await fetch('/api/auth/magiclogin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await response.json()

    if (data.code) {
      setSuccess(true)
    }

    if (data.error) {
      throw new Error(data.error.message)
    }
  }

  return (
    <div>
      {success && <div>Check your email for a login link!</div>}
      {!success && (
        <>
          <div className="input-wrapper">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <button onClick={handleSubmit}>Login</button>
        </>
      )}
    </div>
  )
}
