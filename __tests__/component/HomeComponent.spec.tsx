import "@testing-library/jest-dom/jest-globals";
import { render, screen } from "@testing-library/react";
import HomeComponent from "../../components/HomeComponent";

import { describe, expect, it, jest } from "@jest/globals";

jest.mock("next/link", () => {
  return ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
});

describe("HomeComponent", () => {
  it("debe renderizar las 3 secciones y sus elementos", () => {
    const data: any = {
      cursos_mas_valorados: [
        {
          id: 1,
          titulo: "Curso React",
          descripcion: "Desc React",
          valoracionMedia: 4.5,
          fechaActualizacion: "2025-01-01",
        },
      ],
      valoraciones_cursos: [
        {
          id: 10,
          puntuacion: 5,
          comentario: "Muy bueno",
        },
      ],
      cursos_actualizados: [
        {
          id: 2,
          titulo: "Curso TS",
          descripcion: "Desc TS",
          fechaActualizacion: "2025-02-01",
        },
      ],
    };

    render(<HomeComponent data={data} />);

    expect(screen.getByText("Cursos destacados")).toBeInTheDocument();
    expect(screen.getByText("Opiniones")).toBeInTheDocument();
    expect(screen.getByText("Ultimas actualizaciones")).toBeInTheDocument();

    expect(screen.getByText("Curso React")).toBeInTheDocument();
    expect(screen.getByText("Desc React")).toBeInTheDocument();

    expect(screen.getByText("Muy bueno")).toBeInTheDocument();
    expect(screen.getByText("Curso TS")).toBeInTheDocument();
    expect(screen.getByText("Desc TS")).toBeInTheDocument();
  });

  it("debe renderizar las secciones aunque no haya datos", () => {
    const data: any = {
      cursos_mas_valorados: [],
      valoraciones_cursos: [],
      cursos_actualizados: [],
    };

    render(<HomeComponent data={data} />);

    expect(screen.getByText("Cursos destacados")).toBeInTheDocument();
    expect(screen.getByText("Opiniones")).toBeInTheDocument();
    expect(screen.getByText("Ultimas actualizaciones")).toBeInTheDocument();
  });
});
