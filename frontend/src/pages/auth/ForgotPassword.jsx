import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm.jsx';
import AuthLayout from '../../layouts/AuthLayout.jsx';

function ForgotPassword() {
  return (
    <AuthLayout
      eyebrow="Password help"
      title="Reset your password"
      description="Enter your account email and we will prepare the next step for password recovery."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

export default ForgotPassword;