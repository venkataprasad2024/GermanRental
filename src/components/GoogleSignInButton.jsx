import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function GoogleSignInButton({
  text = 'continue_with',
  role = 'tenant',
  city = '',
}) {
  const { loginWithGoogleProfile } = useAuth()

  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSuccess = (
    credentialResponse,
  ) => {
    try {
      if (!credentialResponse?.credential) {
        throw new Error(
          'Google did not return a credential.',
        )
      }

      /*
       * Prototype/demo behavior:
       * decode the Google credential to obtain
       * basic profile information.
       *
       * IMPORTANT:
       * For a production application, the credential
       * should be verified on a backend before creating
       * an authenticated session.
       */
      const profile = jwtDecode(
        credentialResponse.credential,
      )

      if (!profile.email) {
        throw new Error(
          'Google account email was not returned.',
        )
      }

      const result =
        loginWithGoogleProfile({
          googleId: profile.sub,
          name:
            profile.name ||
            profile.email.split('@')[0],
          email: profile.email,
          avatar:
            profile.picture || '',
          role,
          city,
        })

      if (!result.ok) {
        toast.error(result.error)
        return
      }

      toast.success(
        `Welcome, ${result.user.name.split(' ')[0]}!`,
      )

      const redirect =
        new URLSearchParams(
          location.search,
        ).get('redirect')

      if (redirect) {
        navigate(redirect, {
          replace: true,
        })
        return
      }

      if (result.user.role === 'admin') {
        navigate('/dashboard/admin', {
          replace: true,
        })
      } else if (
        result.user.role === 'landlord'
      ) {
        navigate(
          '/dashboard/landlord',
          {
            replace: true,
          },
        )
      } else {
        navigate('/dashboard/tenant', {
          replace: true,
        })
      }
    } catch (error) {
      console.error(
        'Google sign-in error:',
        error,
      )

      toast.error(
        'Google sign-in could not be completed.',
      )
    }
  }

  const handleError = () => {
    toast.error(
      'Google sign-in failed. Please try again.',
    )
  }

  return (
    <div className="flex w-full justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        type="standard"
        theme="outline"
        size="large"
        text={text}
        shape="rectangular"
        width="100%"
        useOneTap={false}
      />
    </div>
  )
}