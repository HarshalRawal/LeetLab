import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "./form-input";
import { loginSchema } from "../../Schema/auth.schema";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../Store/useAuthStore";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginCredential: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log(JSON.stringify(data));
      await login(data);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <FormInput
          label="Username or Email"
          type="text"
          placeholder="Enter your email or username"
          icon={<Mail className="h-4 w-4" />}
          error={errors.loginCredential?.message}
          {...register("loginCredential")}
        />
      </motion.div>

      <motion.div
        className="form-control w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <label className="label">
          <span className="label-text font-medium">Password</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 h-4 w-4 z-10" />
          <motion.input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className={`input input-bordered w-full pl-10 pr-10 bg-base-200/50 focus:bg-base-200 transition-all duration-300 ${
              errors.password ? "input-error" : ""
            }`}
            whileFocus={{
              scale: 1.02,
              boxShadow: "0 0 0 3px hsl(var(--p) / 0.1)",
            }}
            {...register("password")}
          />
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {showPassword ? (
                <motion.div
                  key="eye-off"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <EyeOff className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="eye"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Eye className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
        <AnimatePresence>
          {errors.password && (
            <motion.label
              className="label"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <span className="label-text-alt text-error flex items-center space-x-1">
                <span>⚠</span>
                <span>{errors.password.message}</span>
              </span>
            </motion.label>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.a
          href="#"
          className="link link-primary text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Forgot password?
        </motion.a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        <motion.button
          type="submit"
          disabled={isLoggingIn}
          className="btn btn-primary w-full relative overflow-hidden"
          whileHover={{
            scale: isLoggingIn ? 1 : 1.02,
            boxShadow: "0 10px 30px hsl(var(--p) / 0.3)",
          }}
          whileTap={{ scale: isLoggingIn ? 1 : 0.98 }}
        >
          <AnimatePresence mode="wait">
            {isLoggingIn ? (
              <motion.div
                key="loading"
                className="flex items-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="loading loading-spinner loading-sm"></span>
                <span>Signing in...</span>
              </motion.div>
            ) : (
              <motion.span
                key="signin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Sign In
              </motion.span>
            )}
          </AnimatePresence>

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
              ease: "linear",
            }}
          />
        </motion.button>
      </motion.div>

      <motion.p
        className="text-center text-base-content/70 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        {"Don't have an account? "}
        <Link to="/signup" className="link link-primary font-medium">
          Sign up
        </Link>
      </motion.p>
    </motion.form>
  );
}
