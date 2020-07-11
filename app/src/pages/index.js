import React from "react";
import Layout from "../components/public-components/layout";
import About from "../components/public-components/about";
import Inscrire from "../components/public-components/inscrire";
import Impliquer from "../components/public-components/impliquer";
import Contact from "../components/public-components/contact";
import CssBaseline from '@material-ui/core/CssBaseline';
import ImageCarousel from  "../components/public-components/imageCarousel";
import { Typography } from "@material-ui/core";

import {View} from 'react-native';
import { Helmet } from "react-helmet";

const IndexPage = () => (
  <View>
    <Helmet>
          <meta name="description" content="L'Association des Aventuriers de Baden-Powell est une association de scoutisme traditionnel pour les 7 ans et plus."/>
          <title>AABP | Scoutisme traditionnel</title>
    </Helmet>
    <CssBaseline />
    <Layout>  
      <section name="home" className="sitename">
      <Typography variant="h4" gutterBottom>Association des Aventuriers de Baden-Powell</Typography>
      <ImageCarousel />
      </section>
      <About/>
      <Inscrire />
      <Impliquer />
      <Contact />    
    </Layout>
  </View>
)
 


export default IndexPage