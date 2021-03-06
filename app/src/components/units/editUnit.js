import React, { useState, useContext, useEffect } from "react"
import { Link, navigate } from "gatsby"
import { useSnackbar } from 'notistack';

import { Tabs, Tab } from '@material-ui/core';
import { Paper, Breadcrumbs, Typography } from '@material-ui/core';

import AppContext from "@aabp/context/appContext";
import UnitContext from "@aabp/context/unit/unitContext";

import Permissions from "@aabp/auth/permissions";
import PermissionTypes from "@aabp/auth/permissionTypes";

import UnitDetails from "./unitDetails";
import Loading from "../loading/loading";
import UnitRecensementTab from "./tabs/unitRecensementTab";

import UnitClient from "@aabp/clients/unitClient";

import "./unit.css";

const EditUnit = ({id}) => {
    const { authedUser } = useContext(AppContext);
    const unitContext = useContext(UnitContext);
    const {unit, setUnit} = unitContext;
    const [isFetchingUnit, setIsFetchingUnit] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const unitClient = new UnitClient();
    const [tab, setTab] = useState(0);
   
    useEffect(() => {
        FetchUnit();      
    }, [id]);

    async function FetchUnit() {
        try {               
            var data = await unitClient.getById(id);
            if(data !== null && data._id)
            {
                setUnit(data);
            }            
            else {
                navigate("/app/unites");
            }
        } catch (e) {
            console.log(e.message);   
            enqueueSnackbar("L'unité n'a pas été trouvée");
            navigate("/app/unites");
        }
        
        setIsFetchingUnit(false);
    }

    if(isFetchingUnit) {
        return <Loading />;
    }

    return  (
    <Paper className="unit">
        <Breadcrumbs aria-label="breadcrumb" className="crumbs">
            <Link color="inherit" to="/app/unites">
                Unités
            </Link>
            <Typography color="textPrimary">{`${unit.nom}`}</Typography>
        </Breadcrumbs>
        <div>
            <Tabs 
            value={tab}
            variant="scrollable"
            scrollButtons="auto"
            onChange={(event, newValue) => setTab(newValue)} aria-label="simple tabs for user details">
                <Tab label="Informations" />
                <Tab label="Recensement" />
                <Tab disabled label="Camps" />
            </Tabs>
            {tab === 0 && <UnitDetails disabled={!Permissions(PermissionTypes.UpdateUnit, authedUser)}/>}
            {tab === 1 && <UnitRecensementTab />}  
            {tab === 2 && <div />}
        </div>
    </Paper>
    );
};

export default EditUnit;
