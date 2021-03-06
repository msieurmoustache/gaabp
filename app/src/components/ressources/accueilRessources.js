import React, { useState } from "react";
import { Paper, Tabs, Tab } from "@material-ui/core";

import Cotisation from "./cotisation";
import Reglements from "./reglements/reglements";
import AGA2021 from "./aga/AGA2021";

import "./ressources.scss";

const AccueilRessources = () => {

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Paper className="accueil-ressources">
            <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="mainnav"
            className="ressources-nav"
             >
                <Tab disableRipple component="a" label="Cotisation" />
                <Tab disableRipple component="a" label="Règlements" />
                <Tab disableRipple component="a" label="AGA 2021" />
            </Tabs>
            {
                value === 0 && <Cotisation />
            }
            {
                value === 1 && <Reglements />
            }
            {
                value === 2 && <AGA2021 />
            }
        </Paper>        
    );
};

export default AccueilRessources;