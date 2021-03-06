import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { Button } from "@material-ui/core";
import { useSnackbar } from 'notistack';

import RecensementContext from "@aabp/context/recensementContext";

import RecensementClient from "@aabp/clients/recensementClient";

const SoumettreRecensement = ({cost, unitId, unitMembers}) => {
    const recensementClient = new RecensementClient();
    const latestRecensement = useContext(RecensementContext).recensement;
    const { enqueueSnackbar } = useSnackbar();
    const [shouldSubmitNew, setShouldSubmitNew] = useState(shouldSubmitNewRecensement());

    function shouldSubmitNewRecensement() {
        var y = moment().year();
        var nextRecensementPeriod = moment(`${y}-09-01`);

        if(moment().isAfter(nextRecensementPeriod)) {
            nextRecensementPeriod.add(1, 'y');
        }

        var lastRecensementPeriod = moment(nextRecensementPeriod).add(-1, 'y');

        return latestRecensement ? moment(latestRecensement.date).isBefore(lastRecensementPeriod) || latestRecensement.paiementComplet : true;
    } 

    useEffect(() => {
        setShouldSubmitNew(shouldSubmitNewRecensement());
    }, [unitId, unitMembers, latestRecensement]);

/*
date: Date,
  paiementComplet: Boolean,
  details: Object,
  cost: Number,
  unitId: mongoose.Types.ObjectId
*/

    const SubmitRecensement = async() => {
        try {
            await recensementClient.addRecensement({
                date: new Date(),
                details: {
                    cost,
                    unitMembers: unitMembers.map(x => x._id)
                },
                unitId,
                cost: cost.totalPrice
            });

            enqueueSnackbar("Un recensement a été soumis avec les membres actuels");
        } catch (e) {
            enqueueSnackbar(e?.error?.response?.data, { variant: "error"});
        }
    };

    const UpdateLatest = async() => {
        try {
            await recensementClient.updateRecensement({
                ...latestRecensement,
                details: {
                    cost,
                    unitMembers: unitMembers.map(x => x._id)
                },
                unitId,
                cost: cost.totalPrice
            });

            enqueueSnackbar("Le dernier recensement a été mis à jour");
        } catch (e) {
            enqueueSnackbar(e?.error?.response?.data, { variant: "error"});
        }
    };

    return (
        <div>
            {
                latestRecensement && !shouldSubmitNew && (
                    <Button variant="contained" color="secondary" onClick={() => UpdateLatest()} >
                        Mettre à jour le dernier recensement
                    </Button>
                )
            }
            {
                (!latestRecensement || shouldSubmitNew) && (
                    <Button variant="contained" color="secondary" onClick={async() => await SubmitRecensement()} >
                        Soumettre un nouveau recensement
                    </Button>
                )
            }
        </div>
    );
};

export default SoumettreRecensement;