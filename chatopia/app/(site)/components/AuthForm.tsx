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

import Input from '@/app/components/inputs/Input';
import Button from '@/app/components/Button';
import AuthSocialButton from "./AuthSocialButton";
import { toast } from "react-hot-toast";
import { useSession ,signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Variant = 'LOGIN' | 'REGISTER'; // The two possible variants of the form

function AuthForm(){
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>('LOGIN'); // Current variant of the form
    const [isLoading, setIsLoading] = useState(false); // Whether form is loading or not

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
    
    const{ register, 
        handleSubmit,
        formState: {
          errors
        }
    } = useForm<FieldValues>({
            defaultValues: { name: '', email: '', password: ''}
        });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
    
        if (variant === 'REGISTER') {
          // Register the user
          axios.post('/api/register', data)
          // Sign in the user after registration
          .then(() => signIn('credentials', data))
          // If successful, show a toast
          .then(() => toast.success('Registered successfully!'))
          // Redirect to the users page
          .then(() => router.push('/users'))
          // If there's an error, show a toast
          .catch(() => toast.error('Something went wrong!'))
          // Finally, set loading to false , so that user can submit the form again
          .finally(() => setIsLoading(false))
        }
    
        if (variant === 'LOGIN') {
          // Login the user
          signIn('credentials', {
            ...data,
            redirect: false
          })
          .then((callback) => {
            if (callback?.error) {
              toast.error('Invalid credentials');
            }

            if (callback?.ok && !callback?.error) {
              toast.success('Logged in!');
              router.push('/users');
            }
          })
          .finally(() => setIsLoading(false));
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
        <div
          className={styles.wrapper}
        >
          <div className={styles.container}>
            <form onSubmit={handleSubmit(onSubmit)} >
              {/* If the variant is REGISTER, then show the 'name' input   */}
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
    
            <div className={styles.socialSection}>
              <div className={styles.divider}>

                <div className={styles.dividerLine} >
                  <div />
                </div>

                <div className={styles.dividerText}>
                  <span> Or continue with </span>
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