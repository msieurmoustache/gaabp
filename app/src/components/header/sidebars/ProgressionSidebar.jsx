import React, { useContext, useState } from "react";
import { Link, navigate } from "gatsby";
import PermissionTypes from "@aabp/auth/permissionTypes";
import Permissions from "@aabp/auth/permissions";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AppContext from "@aabp/context/app/appContext";

const ProgressionSidebar = () => {
    const { authedUser } = useContext(AppContext);
    const [open, setOpen] = useState(false);    

    return (
        <div>
            <List>
                <ListItem button onClick={() => setOpen(!open)}>                
                <ListItemText primary="Progression" />
                {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>          
                        <ListItem divider button disableRipple onClick={() => navigate("/app/formation")}>     
                                <Link className="" to="/app/formation" partiallyActive={true} activeClassName="active">
                                    Formation
                                </Link>  
                        </ListItem>
                        {
                            Permissions(PermissionTypes.RecommendFormation, authedUser) &&
                            (<ListItem divider button disableRipple onClick={() => navigate("/app/formation/recommandations")}>     
                                <Link className="" to="/app/formation/recommandations" partiallyActive={true} activeClassName="active">
                                    Recommandations
                                </Link>  
                            </ListItem>)
                        }
                    </List>
                </Collapse>                 
            </List>
        </div>
    );
};

export default ProgressionSidebar;