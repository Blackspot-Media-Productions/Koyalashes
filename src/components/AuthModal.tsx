import { useState, type SubmitEvent } from "react";
import TextField from "./ui/TextField";
import Button from "./Button";
import { createCustomer, loginCustomer } from "~/shopify/requests/auth";
import { Loader2 } from "lucide-react";

type Props = {
  closeModal: () => void;
};

export default function AuthModal(props: Props) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);

  const [inProgress, setInProgress] = useState(false);
  const [error, setError] = useState({
    login: "",
    signup: "",
  });

  const handleLogin = async (e: SubmitEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setError({ login: "", signup: "" });

      const form = new FormData(e.target);
      const payload = {
        email: (form.get("email") as string) || "",
        password: (form.get("password") as string) || "",
      };

      if (!payload.email || !payload.password) {
        setError((current) => ({
          ...current,
          login: "Please fill all the fields in the form!",
        }));
        return;
      }

      setInProgress(true);
      await loginCustomer(payload);
    } catch (error) {
      let errorMessage = "Something went wrong";
      if (Array.isArray(error)) {
        errorMessage = error[0].message;
      }

      setError((current) => ({ ...current, login: errorMessage }));
    } finally {
      setInProgress(false)
    }
  };

  const handleSignup = async (e: SubmitEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setError({ login: "", signup: "" });

      const form = new FormData(e.target);
      const payload = {
        firstName: (form.get("firstName") as string) || "",
        lastName: (form.get("lastName") as string) || "",
        email: (form.get("email") as string) || "",
        phone: (form.get("phone") as string) || "",
        password: (form.get("password") as string) || "",
        acceptsMarketing,
      };

      if (
        !payload.email ||
        !payload.password ||
        !payload.firstName ||
        !payload.phone ||
        !payload.lastName
      ) {
        setError((current) => ({
          ...current,
          signup: "Please fill all the fields in the form!",
        }));
        return;
      }

      setInProgress(true)
      await createCustomer(payload);
    } catch (error) {
      let errorMessage = "Something went wrong";
      if (Array.isArray(error)) {
        errorMessage = error[0].message;
      }

      setError((current) => ({ ...current, login: errorMessage }));
    } finally {
      setInProgress(false)
    }
  };

  return (
    <div
      onClick={props.closeModal}
      className="w-full h-screen bg-near-black/20 backdrop-blur-md fixed top-0 left-0 z-99999999 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-1/3 max-h-[80vh] bg-white py-4 px-6 rounded-2xl"
      >
        <div className="w-fit flex border border-input p-2 mb-8">
          {["login", "signup"].map((tabOption) => (
            <button
              key={tabOption}
              type="button"
              onClick={() => setTab(tabOption as typeof tab)}
              className={`w-24 py-1.5 grid place-content-center ${tab === tabOption ? "bg-input" : "bg-white"}`}
            >
              <span className="text-sm capitalize">{tabOption}</span>
            </button>
          ))}
        </div>

        <div>
          {tab === "login" ? (
            <div>
              <h2 className="font-dm-serif text-xl">Sign in to continue</h2>
              <p className="text-sm text-muted">
                Enter your login details to continue.
              </p>

              {error.login && (
                <p className="text-red-500 text-sm mt-3">{error.login}</p>
              )}

              <form
                onSubmit={handleLogin}
                className="mt-6 flex flex-col gap-y-4"
              >
                <TextField
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email address"
                />
                <TextField
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                />
                <Button type="submit" disabled={inProgress}>{inProgress ? <Loader2 size={19} /> : "Sign in"}</Button>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="font-dm-serif text-xl">Create a new account</h2>
              <p className="text-sm text-muted">
                Fill the form below to proceed.
              </p>

              {error.signup && (
                <p className="text-red-500 text-sm mt-3">{error.signup}</p>
              )}

              <form
                onSubmit={handleSignup}
                className="mt-6 flex flex-col gap-y-4"
              >
                <div className="flex items-center gap-x-4">
                  <TextField
                    id="first-name"
                    name="firstName"
                    placeholder="First Name"
                  />
                  <TextField
                    id="last-name"
                    name="lastName"
                    placeholder="Last Name"
                  />
                </div>

                <TextField
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email address"
                />
                <TextField id="phone" name="phone" placeholder="Phone number" />
                <TextField
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                />

                <div className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    id="accept-marketing"
                    name="acceptsMarketing"
                    className="accent-primary"
                    checked={acceptsMarketing}
                    onChange={(e) => setAcceptsMarketing(e.target.checked)}
                  />
                  <label
                    htmlFor="accept-marketing"
                    className="text-sm text-muted"
                  >
                    Send me updates, discounts, and news via email.
                  </label>
                </div>
                <Button type="submit" disabled={inProgress}>{inProgress ? <Loader2 size={19} /> : "Create Account"}</Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
