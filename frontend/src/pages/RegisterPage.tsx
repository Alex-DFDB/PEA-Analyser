/**
 * Registration page.
 */
import { RegisterForm } from '../components/Auth/RegisterForm';

const RegisterPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">PEA Portfolio Tracker</h1>
                    <p className="text-gray-400">Create your account</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
