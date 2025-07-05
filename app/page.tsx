import { redirect } from "next/navigation";

export default function Page() {
  try {
    redirect("/Home");
  } catch (error) {
    console.error("Erro no redirecionamento:", error);
    return null;
  }
}
