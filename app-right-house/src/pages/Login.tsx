import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {

    const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

    return (
        <>
        
            <div>teste</div>
        </>
    )
}

