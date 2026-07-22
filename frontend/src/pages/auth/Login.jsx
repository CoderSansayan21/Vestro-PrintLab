import LoginForm from '../../components/auth/LoginForm.jsx';
import AuthLayout from '../../layouts/AuthLayout.jsx';

function Login() {
  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Login to your account"
      description="Continue designing jerseys, managing orders, and generating brand-ready artwork."
    >
      <LoginForm />
    </AuthLayout>
  );
}

export default Login;