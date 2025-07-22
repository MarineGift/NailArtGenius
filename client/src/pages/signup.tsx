import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLanguage } from "@/hooks/useLanguage";
import { Link } from "wouter";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  workplace: z.string().min(2, "Workplace must be at least 2 characters"),
  region: z.string().min(2, "Region must be at least 2 characters"),
  postalCode: z.string().min(5, "Postal code must be at least 5 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      workplace: "",
      region: "",
      postalCode: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      // For now, redirect to login since we use Replit Auth
      // In a real implementation, you would save this additional info
      console.log("Signup data:", data);
      
      // Store signup data in localStorage temporarily
      localStorage.setItem("pendingSignupData", JSON.stringify(data));
      
      // Redirect to Replit auth login
      window.location.href = "/api/login";
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {t('signup.title')}
          </CardTitle>
          <CardDescription>
            {t('signup.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signup.fullName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('signup.fullName')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signup.email')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t('signup.email')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signup.phoneNumber')}</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder={t('signup.phoneNumber')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workplace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signup.workplace')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('signup.workplace')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signup.region')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('signup.region')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signup.postalCode')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('signup.postalCode')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : t('signup.submit')}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('signup.alreadyHaveAccount')}{" "}
              <Link href="/api/login" className="text-pink-600 hover:text-pink-700 font-medium">
                {t('signup.signIn')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}