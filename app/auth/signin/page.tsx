"use client"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader } from "lucide-react"

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image."




export default function Login() {

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      setLoading(true)
      const result = await signIn("credentials", {
        redirect: false,
        employeeId: employeeId,
        password: password,
      });
      if (result?.error) {
        setLoading(false)
        console.error("Error:", result.error);
      } else {
        console.log("Successfully signed in!");
        setLoading(false)
        router.push("/task-manager")
      }
    } catch (error) {
      console.error("Sign-in error", error);
    }
  };


  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={employeeId}
                onChange={(e)=>{setEmployeeId(e.target.value)}}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
            </div>
            <Button type="submit" className="w-full" onClick={()=>{handleSignIn()}} disabled={loading}>
              Login
              {loading && <Loader className="animate-spin ml-2"/>}
            </Button>
           
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <h1>
          Remote Work
        </h1>
      </div>
    </div>
  )
}
