import { AuthForm } from "@/pages/auth/AuthForm";
import { AuthBackground, AuthHeader } from "@/pages/auth/AuthVisual";
import { useAuthPage } from "@/pages/auth/useAuthPage";

/** Main Auth page with responsive layout and accessible onboarding flow. */
export default function Auth() {
  const { state, isLoading, handleSubmit, toggleShowPassword } = useAuthPage();

  return (
    <main className="relative min-h-screen bg-midnight-grid flex flex-col items-center justify-start px-6 pb-10 pt-10 sm:justify-center sm:py-6">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-md">
        <section aria-labelledby="auth-heading">
          <h2 id="auth-heading" className="sr-only">Welcome to Lockr</h2>
          <p className="sr-only">
            Illustrated locker room scene behind the login form reinforces the Lockr privacy theme.
          </p>
          <AuthHeader />
        </section>
        <section aria-label="Authentication form">
          <AuthForm
            email={state.email}
            error={state.error}
            isLoading={isLoading}
            mode={state.mode}
            password={state.password}
            showPassword={state.showPassword}
            onEmailChange={state.setEmail}
            onModeChange={state.handleModeChange}
            onPasswordChange={state.setPassword}
            onShowPasswordToggle={toggleShowPassword}
            onSubmit={handleSubmit}
          />
        </section>
      </div>
    </main>
  );
}
