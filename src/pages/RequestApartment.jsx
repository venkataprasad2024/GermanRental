import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ApartmentRequestForm } from '../components/ApartmentRequestForm'

export default function RequestApartment() {
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
        to="/login?redirect=/request-apartment"
        replace
      />
    )
  }

  /*
   * Logged in → directly show request form
   */
  return (
    <div className="container-page py-8 lg:py-10">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8">
          <span className="section-eyebrow">
            Apartment request
          </span>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Tell us what you are looking for
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            Welcome back,{' '}
            <strong>
              {user?.name}
            </strong>
            . Tell us your housing requirements.
          </p>
        </div>

        <ApartmentRequestForm />

      </div>
    </div>
  )
}