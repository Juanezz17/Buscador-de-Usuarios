import { Navigate,useLocation } from "react-router-dom"

import { useAuth} from '../context/AuthContext';


export default function PrivateRouter({children}){
    const {isAuthenticated} = useAuth();
    const location = useLocation();

    if(!isAuthenticated) {
        return <Navigate to= "/login" replace state={{from: location}} />
    }

    return children;
}