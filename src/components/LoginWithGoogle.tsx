import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

interface LoginWithGoogleProps {
  callback: (token: string) => Promise<void>
  className?: string
}

function LoginWithGoogle({ callback }: LoginWithGoogleProps) {
  return (
    <GoogleOAuthProvider clientId={clientId || ""}>
      <div className="flex justify-center items-center">
        <GoogleLogin
          onSuccess={async (tokenResponse) => {
            const token = tokenResponse.credential
            if (token) {
              await callback(token)
            }
          }}
          onError={() => console.log("Login Failed")}
          useOneTap={false}
          type="standard"
          theme="outline"
          shape="rectangular"
          size="large"
          text="continue_with"
          locale="en"
          logo_alignment="left"
          width="100%"
        />
      </div>
    </GoogleOAuthProvider>
  )
}

export default LoginWithGoogle
