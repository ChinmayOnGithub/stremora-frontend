import { Link } from 'react-router-dom';
import { CheckIcon } from '../components/icons.jsx';
import LoginForm from '../components/auth/LoginForm';

function Login() {
  return (
    <div className="min-h-full flex-1 flex items-center justify-center bg-gray-100 dark:bg-black transition-all px-4 py-2 relative overflow-hidden">
      {/* Background Elements - Only visible on mobile */}
      <div className="absolute inset-0 md:hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-amber-500/20 to-amber-400/20"
          style={{
            backgroundSize: '200% 200%',
            animation: 'gradientMove 15s ease infinite'
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.1),rgba(251,191,36,0))]"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl"></div>
      </div>

      <style>
        {`
          @keyframes gradientMove {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>

      <div className="w-full max-w-2xl overflow-hidden rounded-lg shadow-xl transition-all duration-300 dark:shadow-gray-800/20 sm:grid md:grid-cols-[0.6fr_1.4fr] relative z-10 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
        {/* Left Section - Welcome Back */}
        <div className="relative hidden overflow-hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-700 to-amber-600 dark:from-amber-800 dark:to-amber-700">
          </div>

          <div className="relative flex h-full flex-col justify-between p-5">
            <div>
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
                  <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white mb-3">
                Welcome back to
                <br />
                <span className="text-amber-100">Stremora</span>
              </h1>
            </div>

            <div className="relative rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex flex-col items-center justify-center space-y-2 py-2">
                <svg width="800px" height="800px" viewBox="0 0 32 32" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-12 w-12 text-white/80">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                  <g id="SVGRepo_iconCarrier">
                    <path class="cls-1" d="M17,12a1,1,0,0,0,0-2,1,1,0,0,1,0-2,3,3,0,0,0,0-6,1,1,0,0,0,0,2,1,1,0,0,1,0,2,3,3,0,0,0,0,6Z"/>
                    <path class="cls-1" d="M29,24H23.2l.18-1H25a4,4,0,0,0,4-4V18a3,3,0,0,0-3-3H24.83l.15-.82a1,1,0,0,0-.21-.82A1,1,0,0,0,24,13H8a1,1,0,0,0-.77.36,1,1,0,0,0-.21.82L8.8,24H3a1,1,0,0,0,0,2H4.56L7.2,28.88l.13.12a5.08,5.08,0,0,0,3,1H21.67a5.08,5.08,0,0,0,3-1l.13-.12L27.44,26H29a1,1,0,0,0,0-2Zm-3-7a1,1,0,0,1,1,1v1a2,2,0,0,1-2,2H23.74l.73-4ZM9.2,15H22.8l-1.63,9H10.83ZM23.4,27.45a3,3,0,0,1-1.73.55H10.33a3,3,0,0,1-1.73-.55L7.27,26H24.73Z"/>
                  </g>
                </svg>
                <p className="text-sm font-medium text-white/80 text-center ">
                  Relax. Login is just a few clicks away.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="relative bg-white/90 backdrop-blur-sm md:bg-background md:backdrop-blur-none p-8 dark:bg-gray-900/80 md:dark:bg-gray-900">
          {/* Mobile Welcome Text */}
          <div className="md:hidden mb-8 text-center">
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground dark:text-white">
              Welcome back to <span className="text-amber-500 dark:text-amber-400">Stremora</span>
            </h1>
          </div>

          <h1 className="mb-8 text-2xl md:text-3xl font-bold tracking-tight text-foreground dark:text-white text-center">
            Login
          </h1>

          <LoginForm />

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-amber-500 underline-offset-4 hover:underline dark:text-amber-400"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 