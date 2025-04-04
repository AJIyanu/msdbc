import Image from "next/image";
import LoginForm from "@/auth/forms/signin";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute inset-0 z-0">
        <Image
          src="/loginbg.webp"
          alt="Login Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="hidden lg:flex min-h-screen w-full">
        <div className="relative w-1/2 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 z-0"></div>
          <div className="relative z-10 p-8">
            <div className="flex flex-col items-center justify-center">
              <Image
                src="/placeholder.svg?height=80&width=240"
                alt="Company Logo"
                width={240}
                height={80}
                className="mb-4"
              />
              <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            </div>
          </div>
        </div>

        <div className="w-1/2 bg-white/80 backdrop-blur-md flex items-center justify-center">
          <div className="w-full max-w-md p-8">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Mobile Layout (less than lg) */}
      <div className="lg:hidden flex min-h-screen w-full items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/placeholder.svg?height=60&width=180"
              alt="Company Logo"
              width={180}
              height={60}
              className="mb-4"
            />
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
