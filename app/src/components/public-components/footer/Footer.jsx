import React from "react";
import { Link } from "gatsby";
import "./footer.scss";
import Logo from "../../../images/Logo_AABP.png";
import { Grid } from "@material-ui/core";

const Footer = () => (
  <footer> 
        <div>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Link to="/">
                  <img className="logo" src={Logo} alt="Logo"/>
              </Link>
            </Grid>
            <Grid item xs={12}>
              <Link to="/#about">
                Qui sommes-nous?
              </Link>
            </Grid>
            <Grid item xs={12}>  
                <Link to="/ressources">
                    Règlements
                </Link>
            </Grid>
            <Grid item xs={12}>  
                <Link to="/blog">
                    Blog
                </Link>
            </Grid>
          </Grid>
        </div>
        <div>    
          <Grid container spacing={3}>
              <Grid item xs={12}>
                 <a href="https://carrickquebec.com/" target="_blank" rel="noopener noreferrer">Carrick (boutique)</a>
              </Grid>
              <Grid item xs={12}>          
                <a href="https://www.canadahelps.org/fr/dn/3634" target="_blank" rel="noopener noreferrer">Faire un don</a>
              </Grid>  
              <Grid item xs={12}>  
                <a rel="noopener noreferrer" target="_blank" href="https://suivi.lnk01.com/s/443/15cea7a121968b111f68f436eb99a1be">
                    Infolettre
                </a>
              </Grid>
          </Grid>
        </div>
        <div>    
          <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
            <img src="https://www.netlify.com/img/global/badges/netlify-light.svg" alt="Deploys by Netlify" />
          </a>       
        </div>
  </footer>
);

export default Footer;
