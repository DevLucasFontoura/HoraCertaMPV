import { redirect } from "next/navigation";

export default function Page() {
  redirect("/Home");
  return null;
}
