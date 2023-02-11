
export interface Roles{
    client?: boolean;
    manager?: boolean;
    admin?: boolean;
}
export interface User {
    uid: string;
    email: string;
    username: string;
    banned: boolean;
    roles: Roles;
  }