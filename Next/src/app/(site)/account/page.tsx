import { AuthProvider } from "@/providers/Auth/Auth";
import ClientPage from "./clientPage";

export default async function Account() {
  return (
    <AuthProvider>
      <ClientPage />
    </AuthProvider>
  );
}
