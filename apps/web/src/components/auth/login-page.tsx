"use client";

import Image from "next/image";
import { Shield, BarChart3, Zap, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";

const features = [
  {
    icon: Shield,
    title: "Fraud detection",
    description: "LightGBM + SHAP explanations",
  },
  {
    icon: Globe,
    title: "Sanctions screening",
    description: "Real-time OFAC list matching",
  },
  {
    icon: Zap,
    title: "Sub-200ms latency",
    description: "Real-time scoring pipeline",
  },
  {
    icon: BarChart3,
    title: "Explainable AI",
    description: "Top risk factors per decision",
  },
];

export function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side: Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 text-white flex-col justify-between p-12">
        <div>
          <Image
            src="/logos/logo.svg"
            alt="Sentinel"
            width={140}
            height={40}
            className="h-8 w-auto brightness-0 invert"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-semibold leading-tight">
            AI-powered fraud detection & sanctions screening
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Sentinel screens cross-border payments in real time using machine
            learning and OFAC sanctions lists, delivering explainable risk
            scores with sub-200ms latency.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <div className="p-2 bg-white/10 rounded-md">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Devbrew LLC. All rights reserved.
        </p>
      </div>

      {/* Right side: Auth forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <Image
              src="/logos/logo.svg"
              alt="Sentinel"
              width={120}
              height={34}
              className="h-7 w-auto mx-auto mb-3"
            />
            <p className="text-sm text-gray-500">
              AI fraud detection & sanctions screening
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome to Sentinel
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to your account to continue
            </p>
          </div>

          <Tabs defaultValue="sign-in" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="sign-in" className="flex-1">
                Sign in
              </TabsTrigger>
              <TabsTrigger value="sign-up" className="flex-1">
                Sign up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sign-in">
              <SignInForm />
            </TabsContent>

            <TabsContent value="sign-up">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
