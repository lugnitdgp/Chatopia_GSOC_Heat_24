// import { getServerSession } from "next-auth";
// import { authOptions } from "../api/auth/[...nextauth]/route";
import { auth } from "@/auth"

export default async function getSession() {
  return await auth();
}