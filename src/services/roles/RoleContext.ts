import { Role } from "../../enums/Role";
import { UNAUTHORIZED } from "../../validations/ErrorReport";
import { AdminRole } from "./AdminRole";
import { IRole } from "./IRole";
import { StandardRole } from "./StandardRole";

export class RoleContext {
    private _role: IRole;

    constructor(role: Role) {
        this._role = this.setRole(role);
    }

    public setRole(role: Role): IRole {
        switch (role) {
            case Role.Admin:
                this._role = new AdminRole();
            case Role.Standard:
                this._role = new StandardRole();
            default:
                throw UNAUTHORIZED;
        }
    }

    public hasMasterAccess(): boolean {
        return this._role.hasMasterAccess();
    }
}