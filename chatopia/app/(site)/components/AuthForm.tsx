'use client'

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { 
  FieldValues, 
  SubmitHandler, 
  useForm
} from "react-hook-form";
import { BsGithub, BsGoogle } from 'react-icons/bs';
import styles from './AuthForm.module.css';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Input from '@/app/components/inputs/Input';
import Button from '@/app/components/Button';
import AuthSocialButton from "./AuthSocialButton";
import { toast } from "react-hot-toast";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Variant = 'LOGIN' | 'REGISTER';

// Define the same validation schema as backend
const userSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password cannot exceed 50 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});

// Create a type from the schema
type FormData = z.infer<typeof userSchema>;

function AuthForm() {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      if (session?.status === 'authenticated') {
        router.push('/users');
      }
    }, [session?.status, router]);

    const toggleVariant = useCallback(() => {
      if (variant === 'LOGIN') {
        setVariant('REGISTER');
      } else {
        setVariant('LOGIN');
      }
    }, [variant]);
    
    const { 
      register, 
      handleSubmit,
      formState: { errors }
    } = useForm<FormData>({
      resolver: zodResolver(variant === 'REGISTER' ? userSchema : userSchema.omit({ name: true })),
      defaultValues: { 
        name: '', 
        email: '', 
        password: ''
      }
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setIsLoading(true);
    
        if (variant === 'REGISTER') {
          try {
            await axios.post('/api/register', data);
            const signInResult = await signIn('credentials', {
              ...data,
              redirect: false
            });

            if (signInResult?.error) {
              toast.error(signInResult.error);
              return;
            }

            toast.success('Registered successfully!');
            router.push('/users');
          } catch (error: any) {
            // Handle specific error messages from the backend
            const errorMessage = error.response?.data || 'Something went wrong!';
            toast.error(errorMessage);
          } finally {
            setIsLoading(false);
          }
        }
    
        if (variant === 'LOGIN') {
          try {
            const result = await signIn('credentials', {
              ...data,
              redirect: false
            });

            if (result?.error) {
              toast.error(result.error);
              return;
            }

            if (result?.ok) {
              toast.success('Logged in!');
              router.push('/users');
            }
          } catch (error) {
            toast.error('An error occurred during login');
          } finally {
            setIsLoading(false);
          }
        }
      };

    const socialAction = (action: string) => {
        setIsLoading(true);

        signIn(action, { redirect: false })
          .then((callback) => {
            if (callback?.error) {
              toast.error('Invalid Credentials');
            }
    
            if (callback?.ok && !callback?.error) {
              toast.success('Logged in!')
            }
          })
          .finally(() => setIsLoading(false));
    }

    return ( 
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {variant === 'REGISTER' && (
                <Input 
                  id="name" 
                  label="Name" 
                  register={register}
                  errors={errors}
                  disabled={isLoading}
                />
              )}
              <Input 
                id="email" 
                label="Email address"
                type="email" 
                register={register}
                errors={errors}
                disabled={isLoading}
              />
              <Input 
                id="password" 
                label="Password"
                type="password" 
                register={register}
                errors={errors}
                disabled={isLoading}
              />
              {errors.password && (
                <p className={styles.errorMessage}>
                  {errors.password.message}
                </p>
              )}
              <div>
                <Button
                  disabled={isLoading}
                  fullWidth
                  type="submit"
                >
                  {variant === 'LOGIN' ? 'Sign in' : 'Register'}
                </Button>
              </div>
            </form>
    
            {/* Rest of your JSX remains the same */}
            <div className={styles.socialSection}>
              <div className={styles.divider}>
                <div className={styles.dividerLine}>
                  <div />
                </div>
                <div className={styles.dividerText}>
                  <span>Or continue with</span>
                </div>
              </div>
    
              <div className={styles.socialButtons}>
                <AuthSocialButton
                  icon={BsGithub}
                  onClick={() => socialAction('github')}
                />
                <AuthSocialButton
                  icon={BsGoogle}
                  onClick={() => socialAction('google')}
                />
              </div>
            </div>
    
            <div className={styles.formSwitcher}>
              <div>
                {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}
              </div>
              <div
                onClick={toggleVariant}
                className={styles.formToggler}
              >
                {variant === 'LOGIN' ? 'Create an account' : 'Login'}
              </div>
            </div>
          </div>
        </div>
    );
}

export default AuthForm;