import { FC, useState } from "react";
import { Link } from "wouter"
import { Form, Card } from "react-bootstrap";

import { handleFormErrors, signUpUser } from "../services/api.service";
import { FormInputRow } from "../components/forms-util";
import ErrorAlert from "../components/error-alert";
import AsyncButton from "../components/AsyncButton";


type SignUpForm = {
  name: string,
  organization: string,
  email: string,
  password: string,
  passwordConfirm: string
  error: string,
  success: string,
  loading: string
}
type SignUpFormErrors = Partial<SignUpForm>

const defaultSignUpForm: SignUpForm = {
  name: "",
  organization: "",
  email: "",
  password: "",
  passwordConfirm: "",
  error: "",
  success: "",
  loading: ""
} as const;

const SignUp: FC<{}> = () => {

  const [form, setForm] = useState<SignUpForm>(defaultSignUpForm)
  const [formErrors, setFormErrors] = useState<SignUpFormErrors>({})

  async function handleSignUp() {
    try {
      setFormErrors({})
      setForm({ ...form, error: "", success: "", loading: "true" })
      const result = await signUpUser(form.email, form.password, form.passwordConfirm, form.name, form.organization);
      if (result) {
        setForm({
          ...defaultSignUpForm,
          loading: '',
          success: "Sign up successful, please check your email to verify your account."
        });
      }
    } catch (err) {
      handleFormErrors(err, setFormErrors, setForm);
    }
  }

  return (<>
    <Card style={{ width: '32rem', margin: 'auto', padding: '1rem' }}>
      <Card.Body>

        {form.success ? <>
          <Card.Title as="h2">Sign Up Success</Card.Title>
          <p className="mt-4">{form.success}</p>
          </> : <>
            <Card.Title as="h2">Sign Up</Card.Title>

            <p className="mt-4">Enter your email and a password. A verification email will be sent to you.</p>
            <Form
              onSubmit={(e)=>{
                e.preventDefault()
                e.stopPropagation()
                if (e.currentTarget.checkValidity() === false) return
                handleSignUp()
              }}>
              <FormInputRow form={form} setForm={setForm} errors={formErrors} type="input" field="name" label="Name" />
              <FormInputRow form={form} setForm={setForm} errors={formErrors} type="input" field="organization" label="Organization" />
              <FormInputRow form={form} setForm={setForm} errors={formErrors} required type="email" field="email" label="Email" />
              <FormInputRow form={form} setForm={setForm} errors={formErrors} minlength={8} type="password" required field="password" label="Password" />
              <FormInputRow form={form} setForm={setForm} errors={formErrors} minlength={8} type="password" required field="passwordConfirm" label="Confirm Password" />

              <AsyncButton
                type="submit"
                className="w-100 mb-3"
                variant="success"
                loading={!!form.loading}
              >Sign Up</AsyncButton>
              {form.error && <ErrorAlert error={form.error} onDismiss={()=>{ setForm({ ...form, error:'' }) }} />}
              <p className="text-muted">If you already have an account, you can <Link href="/sign-in">sign in here</Link>.</p>
            </Form>
            </>
      }
      </Card.Body>
    </Card>
  </>)
}

export default SignUp;
