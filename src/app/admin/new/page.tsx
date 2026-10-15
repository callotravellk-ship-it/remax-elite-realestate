import PropertyForm from "@/components/admin/PropertyForm";

export const metadata = {
  title: "Create Listing | RE/MAX ELITE Admin",
  description: "Create and publish a new luxury architectural property listing in Sri Lanka",
};

export default function NewPropertyPage() {
  return <PropertyForm isEditing={false} />;
}
