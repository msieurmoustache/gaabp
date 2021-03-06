import React, { useContext } from "react";
import NominatedUserRouter from "@aabp/components/routers/nominatedUserRouter";
import AnonymousUserRouter from "@aabp/components/routers/anonymousUserRouter";
import AppContext from "@aabp/context/app/appContext";

const AppRouter = () => {    
    const { authedUser } = useContext(AppContext);

    return (        
        <>
            {(authedUser?.nominations?.length > 0 || authedUser?.isAdmin) ? <NominatedUserRouter /> : <AnonymousUserRouter />}
        </>
    );
};

export default AppRouter;
