import RegisterForm from '../../components/auth/RegisterForm.jsx';
import AuthLayout from '../../layouts/AuthLayout.jsx';

function Register() {
  return (
    <AuthLayout
      eyebrow="Create account"
      title="Join VESTRO PRINTLAB"
      description="Set up your workspace for custom apparel design, saved mockups, and order tracking."
    >
      <RegisterForm />
    </AuthLayout>
  );
}

export default Register;