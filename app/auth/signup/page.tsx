"use client"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image."

export default function SignUp() {

  const [employeeId, setEmployeeId] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const createuser = async ()=>{
    try 
    {
      setLoading(true)
        fetch("/api/signup", {
          method:"POST", 
          body:JSON.stringify({employeeId, password})
        })
        .then(response=>{
          if (response.status == 200)
          {
            setLoading(false);
            router.push("/task-manager")
          }
          else 
          {

          }
        })
       
    }
    catch(err)
    {
      setLoading(false)
      console.log("Error in server!")
    }
  }
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Signup</h1>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Employee Id</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={employeeId}
                onChange={(e) => {
                  setEmployeeId(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              onClick={() => {
                createuser();
              }}
              disabled={loading}
            >
              SignUp
              {loading && <Loader className="animate-spin ml-2" />}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative max-w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
          alt="Cover image"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
