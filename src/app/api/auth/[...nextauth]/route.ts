import NextAuth from "next-auth"
import Config from "@/core/auth-config";

const Handler = NextAuth(Config)

export {Handler as GET, Handler as POST}