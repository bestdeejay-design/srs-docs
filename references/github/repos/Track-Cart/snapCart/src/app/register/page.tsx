"use client";
import RegisterFrom from "@/components/RegisterForm";
import Welcome from "@/components/Welcome";
import { useState } from "react";

const Register = () => {
  const [step, setStep] = useState(1);
  return (
    <div>
      {step == 1 ? (
        <Welcome nextStep={setStep} />
      ) : (
        <RegisterFrom nextStep={setStep} />
      )}
    </div>
  );
};

export default Register;
