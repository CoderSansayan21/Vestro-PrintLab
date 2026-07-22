import ResetPasswordForm from '../../components/auth/ResetPasswordForm.jsx';
import AuthLayout from '../../layouts/AuthLayout.jsx';

function ResetPassword() {
  return (
    <AuthLayout
      eyebrow="Secure reset"
      title="Choose a new password"
      description="Use a strong password so your designs, orders, and account details stay protected."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}

export default ResetPassword;