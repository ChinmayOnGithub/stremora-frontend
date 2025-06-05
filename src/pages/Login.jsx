// import React from 'react'
// import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, GoogleIcon, GitHubIcon } from '../components/icons.jsx';
import LoginForm from '../components/auth/LoginForm';

function Login() {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full flex min-h-[calc(100vh-200px)] items-center p-3">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-background to-background dark:from-amber-900/10 dark:via-gray-900 dark:to-gray-900 opacity-70"></div>

      {/* Add subtle dot pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-8 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        filter: 'blur(0px)',
        backdropFilter: 'blur(0px)'
      }}></div>

      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl dark:shadow-gray-800/20 dark:hover:shadow-gray-800/30 sm:grid md:grid-cols-[1fr_1.3fr] md:min-h-[580px]">
        {/* Left Section - Welcome Back */}
        <div className="relative hidden overflow-hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-700 to-amber-600 dark:from-amber-800 dark:to-amber-700">
            <div className="absolute inset-0 opacity-10 animate-[pulse_8s_ease-in-out_infinite]" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '24px 24px'
            }}></div>
          </div>

          <div className="relative flex h-full flex-col justify-between p-8">
            <div>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white animate-[pulse_4s_ease-in-out_infinite]">
                  <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold leading-tight text-white">
                Welcome back to
                <br />
                <span className="text-amber-200">Stremora</span>
              </h2>
              <p className="mt-3 text-sm font-medium text-white/80">
                Sign in to continue your streaming experience
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="flex flex-col space-y-4">
                  <h3 className="text-lg font-semibold text-white">Premium benefits:</h3>

                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-300/20">
                        <CheckIcon className="h-4 w-4 text-amber-300" />
                      </div>
                      <span className="text-sm text-white">4K Ultra HD streaming</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-300/20">
                        <CheckIcon className="h-4 w-4 text-amber-300" />
                      </div>
                      <span className="text-sm text-white">Download for offline viewing</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-300/20">
                        <CheckIcon className="h-4 w-4 text-amber-300" />
                      </div>
                      <span className="text-sm text-white">Early access to new releases</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                <div className="flex flex-col space-y-4">
                  <p className="text-sm font-medium text-white">
                    &quot;Stremora changed how I watch content online. The quality is unmatched!&quot;
                  </p>
                  <p className="mt-2 text-xs text-white/70">— Sarah K., Premium Member</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="relative bg-background p-6 dark:bg-gray-900 sm:p-8">
          <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground dark:text-white">
            Sign in to your account
          </h1>

          <LoginForm />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted-foreground/20 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground dark:bg-gray-900 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-muted-foreground/20 bg-background text-sm font-medium text-foreground shadow-sm transition-all duration-300 hover:bg-muted/30 focus:ring-2 focus:ring-amber-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <GoogleIcon className="h-4 w-4" />
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-muted-foreground/20 bg-background text-sm font-medium text-foreground shadow-sm transition-all duration-300 hover:bg-muted/30 focus:ring-2 focus:ring-amber-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <GitHubIcon className="h-4 w-4" />
                <span>GitHub</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-amber-500 underline-offset-4 hover:underline dark:text-amber-400"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login