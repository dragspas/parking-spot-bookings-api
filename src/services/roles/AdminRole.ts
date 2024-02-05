import { IRole } from "./IRole";

export class AdminRole implements IRole {
    public hasMasterAccess(): boolean {
        return true;
    }

}