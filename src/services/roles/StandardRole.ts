import { IRole } from "./IRole";

export class StandardRole implements IRole {
    public hasMasterAccess(): boolean {
        return false;
    }

}