import LoginForm from "@/auth/forms/signin";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <LoginForm />
    </div>
  );
}
