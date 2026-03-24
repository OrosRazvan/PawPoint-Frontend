import { useNavigate } from "react-router-dom";
import { HaveAccountText } from "./HaveAccountText";

export const RegisterFooter = () => {
  const navigate = useNavigate();

  return <HaveAccountText onLoginClick={() => navigate("/login")} />;
};