import React, { useContext } from "react"
import { Router } from "@reach/router"
import Profile from "./../profile/profile"
import Membres from "./../membres/membres"
import EditMembre from "./../membres/editMembre"
import Group from "./../groups/group"
import EditGroup from "./../groups/editGroup"
import Unit from "./../units/unit"
import EditUnit from "./../units/editUnit"
import Formation from "./../formation/formation"
import AccueilRessources from "../ressources/accueilRessources"
import Permissions from "../../auth/permissions"
import PermissionTypes from "../../auth/permissionTypes"
import RecensementOverview from "../recensement/recensementOverview"
import RecommendFormation from "../formation/recommendFormation"
import NominationsOverview from "../nominations/nominationsOverview"
import FormationResume from "../formation/components/formationResume"
import AppContext from "@aabp/context/appContext"

const NominatedUserRouter = () => {
    const { authedUser } = useContext(AppContext);

    return (
    <Router basepath="/app"> 
        <Profile path="/account" />
        <Membres path="/membres" />
        {Permissions(authedUser, PermissionTypes.ViewUsers) && <EditMembre path="membre/:id" />}
        <Group path="/groupes" />
        <EditGroup path="/groupe/:id" />
        <Unit path="/unites" />
        <EditUnit path="/unite/:id" />
        <Formation path="/formation" />
        <FormationResume path="/formation/:niveau/" />
        <FormationResume path="/formation/:niveau/:branche" />
        {Permissions(authedUser, PermissionTypes.RecommendFormation) && <RecommendFormation path="/formation/recommandations" />}
        <AccueilRessources path="/ressources" />
        {Permissions(authedUser, PermissionTypes.ViewRecensementSummary) && <RecensementOverview path="/recensements" />}
        <NominationsOverview path="/nominations" />
        <Profile default />
    </Router> 
    )
};

export default NominatedUserRouter;