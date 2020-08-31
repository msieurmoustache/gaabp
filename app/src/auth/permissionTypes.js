const PermissionTypes = {
    // users
    CreateUser: "createUser",
    UpdateUser: "updateUser",
    DeleteUser: "deleteUser",
    ViewUsers: "viewUsers",

    // units
    CreateUnit: "createUnit",
    UpdateUnit: "updateUnit",
    DeactivateUnit: "deactivateUnit",

    // groups
    CreateGroup: "createGroup",
    UpdateGroup: "updateGroup",
    DeactivateGroup: "deactivateGroup",

    // nominations
    AddNomination: "addNomination",
    ValidateNomination: "validateNomination",
    RemoveNomination: "removeNomination",

    // formations
    RecommendFormation: "recommendFormation",
    ConfirmFormation: "confirmFormation"

}

export default PermissionTypes;
