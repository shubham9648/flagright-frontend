import { Routes, HashRouter, Route } from "react-router-dom";
import HomePage from './pages/homePage/homePage';
import TransactionPage from './pages/transactionPage/transaction'


const Routers = () => {
    return (
        <>
            <HashRouter>
                <Routes>
                    <Route path = "/" element = {<HomePage />}/>
                    <Route path = "/transaction" element = {<TransactionPage />}/>
                </Routes>
            </HashRouter>
        </>
    )
}

export default Routers;