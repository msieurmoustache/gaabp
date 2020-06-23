import ApiClient from "./apiClient";

export class UnitClient {
    constructor() {
        this._apiClient = new ApiClient({ baseURL: "https://formation-aabp.herokuapp.com/api/" });
    }

    getById = (id) => {
         return this._apiClient.get(`unit/${id}`);
    }

    getUnitsByName = (name) => {
        return this._apiClient.get(`user/name/${name}`);
    }

    getUnits = () => {
        return this._apiClient.get("units");
    }

    addUnit = (user) => {
        return this._apiClient.post("unit", user );
    }

    updateUnit = (user) => {
        return this._apiClient.put(`unit/${user.id}`, user );
    }

    deleteUnit = (id) => {
        return this._apiClient.delete("unit", { id });
    }

}    

export default UnitClient;