import "@testing-library/jest-dom/jest-globals";
import { render, screen } from "@testing-library/react";

import { describe, expect, it, jest } from "@jest/globals";

jest.mock("../../components/HeaderComponent", () => {
  return {
    __esModule: true,
    default: function HeaderComponentMock() {
      return <div>HeaderMock</div>;
    },
  };
});

jest.mock("../../components/FooterComponent", () => {
  return {
    __esModule: true,
    default: function FooterComponentMock() {
      return <div>FooterMock</div>;
    },
  };
});

describe("LayoutComponent", () => {
  it("debe renderizar header, main con children y footer", () => {
    const LayoutComponent = require("../../components/LayoutComponent").default;

    render(
      <LayoutComponent>
        <div>Contenido</div>
      </LayoutComponent>
    );

    expect(screen.getByText("HeaderMock")).toBeInTheDocument();
    expect(screen.getByText("FooterMock")).toBeInTheDocument();
    expect(screen.getByText("Contenido")).toBeInTheDocument();

    const main = document.querySelector("main#main");
    expect(main).toBeTruthy();
  });
});
