import Auth from "@/components/auth/auth";
import authConfig from "@/core/auth-config";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function Page(){
  const session = await getServerSession(authConfig)
  if (session) redirect('/')
  return <Auth/>
}