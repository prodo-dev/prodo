import { Theme } from "../src/styles";

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
