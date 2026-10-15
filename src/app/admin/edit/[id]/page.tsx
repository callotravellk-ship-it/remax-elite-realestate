import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/propertyService";
import PropertyForm from "@/components/admin/PropertyForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);
  return {
    title: property ? `Edit ${property.title} | RE/MAX ELITE Admin` : "Edit Listing | RE/MAX ELITE Admin",
  };
}

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return <PropertyForm initialData={property} isEditing={true} />;
}
