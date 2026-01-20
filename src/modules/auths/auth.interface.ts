import { RouterHandle } from "../../utils/routerHandle.type";
import { ICreateUserDTO } from "../users/user.interface";

export interface ILoginDTO {
  username: string;
  password: string;
}

export interface IForgotPasswordDTO {
  email: string;
}

export namespace AuthSpace {
  export type RenderPageController = RouterHandle<{}>;

  export type RegisterController = RouterHandle<{
    body: ICreateUserDTO;
  }>;

  export type LoginController = RouterHandle<{
    body: ILoginDTO;
  }>;

  export type ForgotPasswordController = RouterHandle<{
    body: IForgotPasswordDTO;
  }>;

  export type LogoutController = RouterHandle<{}>;
}
