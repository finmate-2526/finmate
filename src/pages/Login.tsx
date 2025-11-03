import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { register as localRegister, login as localLogin } from "@/lib/localAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import astronaut from "@/image/astronaut.png";

type FormValues = {
  email: string;
  password: string;
  passwordConfirm?: string;
};

const Auth: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();

  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    defaultValues: { email: "", password: "", passwordConfirm: "" },
  });

  const onSubmit = async (values: FormValues) => {
    if (mode === "register" && values.password !== values.passwordConfirm) {
      toast({ title: "Passwords do not match", description: "Please confirm your password." });
      return;
    }

    if (mode === "login") {
      const { user, error } = await localLogin(values.email, values.password);
      if (error) return toast({ title: "Login failed", description: error });

      toast({ title: "Welcome back!", description: "Logged in successfully." });
      return navigate("/dashboard");
    }

    if (mode === "register") {
      const { user, error } = await localRegister(values.email, values.password);
      if (error) return toast({ title: "Registration failed", description: error });

      toast({ title: "Account created", description: "You're now signed in." });
      return navigate("/dashboard");
    }
  };

  return (
    <div className="w-full h-screen flex bg-black text-white overflow-hidden">

      {/* ✅ LEFT SIDE IMAGE */}
      <div className="hidden md:block w-1/2 h-full">
        <img
          src={astronaut}
          className="w-full h-full object-cover rounded-r-3xl"
          alt="visual"
        />
      </div>

      {/* ✅ RIGHT FORM PANEL */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md">

          {/* Toggle Header */}
          <div className="flex justify-center mb-10">
            <div className="flex gap-6 border-b border-gray-700 pb-2">
              <button
                onClick={() => setMode("login")}
                className={`${mode === "login" ? "text-white border-b-2 border-white" : "text-gray-500"} pb-1 text-lg`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("register")}
                className={`${mode === "register" ? "text-white border-b-2 border-white" : "text-gray-500"} pb-1 text-lg`}
              >
                Register
              </button>
            </div>
          </div>

          {/* TITLE */}
          <h2 className="text-4xl font-semibold text-center mb-10">
            {mode === "login" ? "Sign in" : "Create account"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* ✅ Email */}
            <div>
              <label className="text-gray-300 text-sm">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: true })}
                className="bg-black border border-gray-600 text-white mt-1 p-5 rounded-xl"
              />
              {formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">Email is required</p>
              )}
            </div>

            {/* ✅ Password */}
            <div>
              <label className="text-gray-300 text-sm">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: true })}
                className="bg-black border border-gray-600 text-white mt-1 p-5 rounded-xl"
              />
              {formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">Password is required</p>
              )}
            </div>

            {/* ✅ Confirm Password (only for Register) */}
            {mode === "register" && (
              <div>
                <label className="text-gray-300 text-sm">Confirm password</label>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  {...register("passwordConfirm", { required: true })}
                  className="bg-black border border-gray-600 text-white mt-1 p-5 rounded-xl"
                />

                {formState.errors.passwordConfirm && (
                  <p className="text-red-500 text-sm mt-1">
                    Confirm your password
                  </p>
                )}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              disabled={formState.isSubmitting}
              className="w-full py-5 text-lg rounded-xl bg-white text-black hover:bg-gray-200"
            >
              {mode === "login" ? "Sign in" : "Register"}
            </Button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default Auth;
