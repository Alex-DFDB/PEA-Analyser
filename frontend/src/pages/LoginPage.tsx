// pages/LoginPage.tsx
import { LoginForm } from "../components/Auth/LoginForm";

const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">PEA Portfolio Tracker</h1>
                    <p className="text-gray-400">Login to your account</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
