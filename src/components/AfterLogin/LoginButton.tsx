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
      {success && <div style={{ textAlign: "center" }}>Check your email for a login link!</div>}
      {!success && (
        <>
          <div className="field-type email">
            <div className="input-wrapper">
              <label className="field-label" htmlFor="field-email">
                Email<span className="required">*</span>
              </label>
              <input
                type="email"
                id="field-email"
                name="email"
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="form-submit">
            <button className="btn btn--style-primary btn--icon-style-without-border btn--size-medium btn--icon-position-right" style={{ width: "100%"}} onClick={handleSubmit}>Login with Magic Login</button>
          </div>
        </>
      )}
    </div>
  )
}
