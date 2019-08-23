import { State } from "../src/store";
import { createTestRenderer, createTestDispatch } from "@prodo/core";

export const renderWithProdo = createTestRenderer<State>();
export const createDispatch = createTestDispatch<State>();
