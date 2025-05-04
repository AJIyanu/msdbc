import { DevelopmentFundForm } from "@/auth/forms/buildingofferingform";

export default function DevelopmentFundPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Development Fund Collection</h1>
        <DevelopmentFundForm />
      </div>
    </div>
  );
}
