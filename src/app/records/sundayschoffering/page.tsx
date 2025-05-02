import SundaySchoolOfferingForm from "@/auth/forms/sundayschool_offering_form";

export default function SundaySchoolOfferingPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Sunday School Offering Management
      </h1>
      <SundaySchoolOfferingForm />
    </div>
  );
}
