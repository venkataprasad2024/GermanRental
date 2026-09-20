import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PostPropertyForm } from '../components/PostPropertyForm'

export default function PostProperty() {
  const {
    user,
    ready,
    isAuthenticated,
  } = useAuth()

  if (!ready) {
    return null
  }

  /*
   * Logged out → login
   */
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login?redirect=/post-property"
        replace
      />
    )
  }

  /*
   * Already logged in → directly show form
   */
  return (
    <div className="container-page py-8 lg:py-10">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8">
          <span className="section-eyebrow">
            Post an apartment
          </span>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            List your property
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            Welcome back,{' '}
            <strong>
              {user?.name}
            </strong>
            . Add your apartment details below.
          </p>
        </div>

        <PostPropertyForm />

      </div>
    </div>
  )
}