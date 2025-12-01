import { Navigate } from "react-router-dom"
import { numInArray } from "../ultis/ultis"

const ProtectedRoute = ({ children, role }) => {
    const roleAccount = localStorage.getItem("role")
    const isAuthen = Boolean(localStorage.getItem("isAuthen"))
    const funCheck = (arr1, arr2) => {
        if (arr1) {
            const rs = arr1?.map((e1) => {
                if (typeof (arr2) === 'string') {
                    return numInArray(e1, [arr2])
                }
                return numInArray(e1, [...arr2])
            })
            return numInArray(true, rs)
        }
        return false
    }

    if (!isAuthen) {
        return <Navigate to="/login" replace />
    } else {
        if (!funCheck(roleAccount, role)) {
            return <Navigate to="/login" replace />
        }
    }
    return children
}

export default ProtectedRoute