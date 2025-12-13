import "@testing-library/jest-dom/jest-globals";
import { render, screen } from "@testing-library/react";
import MenuCategoriaComponent from "../../components/MenuCategoriaComponent";

import { describe, expect, it, jest } from "@jest/globals";

jest.mock("next/link", () => {
  return ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
});

describe("MenuCategoriaComponent", () => {
  it("debe renderizar una lista de categorías", () => {
    render(
      <ul>
        <MenuCategoriaComponent
          data={[
            { id: 1, nombre: "Programación" },
            { id: 2, nombre: "Diseño" },
          ]}
        />
      </ul>
    );

    const link1 = screen.getByText("Programación").closest("a");
    const link2 = screen.getByText("Diseño").closest("a");

    expect(link1).toHaveAttribute("href", "/categoria/1");
    expect(link2).toHaveAttribute("href", "/categoria/2");
  });

  it("debe devolver null si data no es un array", () => {
    const { container } = render(
      <ul>
        <MenuCategoriaComponent data={null as any} />
      </ul>
    );

    expect(container.querySelectorAll("li")).toHaveLength(0);
  });
});
