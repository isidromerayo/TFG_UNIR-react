import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HeaderComponent from "../../components/HeaderComponent";
import { useRouter } from "next/router";

const mockPush = jest.fn();

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    route: "/",
    push: mockPush,
    query: {},
    pathname: "/",
    asPath: "/",
  })),
}));

jest.mock("next/link", () => {
  return ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
});

jest.mock("next/image", () => {
  return ({ alt, ...rest }: any) => <img alt={alt} {...rest} />;
});

jest.mock("../../utils/logger", () => ({
  logger: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

jest.mock("../../utils/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock("../../services", () => ({
  getToken: jest.fn(),
  removeToken: jest.fn(),
  removeUser: jest.fn(),
}));

jest.mock("../../components/MenuCategoriaComponent", () => {
  return ({ data }: any) => (
    <>
      {Array.isArray(data)
        ? data.map((c: any) => <li key={c.id}>{c.nombre}</li>)
        : null}
    </>
  );
});

jest.mock("sweetalert2", () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

describe("HeaderComponent", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      route: "/",
      push: mockPush,
      query: {},
      pathname: "/",
      asPath: "/",
    }));
    jest.clearAllMocks();
    mockPush.mockClear();
  });

  it("debe renderizar el header tras cargar categorías", async () => {
    const api = (await import("../../utils/api")).default as any;
    api.get.mockResolvedValue({
      data: {
        _embedded: {
          categorias: [
            { id: 1, nombre: "Programación" },
            { id: 2, nombre: "Diseño" },
          ],
        },
      },
    });

    const services = (await import("../../services")) as any;
    services.getToken.mockReturnValue("token");

    render(<HeaderComponent />);

    expect(screen.getByText("...Data Loading.....")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Home/i)).toBeInTheDocument();
    });

    expect(screen.getByAltText("Logo React")).toBeInTheDocument();
    expect(screen.getByAltText("Logo UNIR")).toBeInTheDocument();
    expect(screen.getByText(/TFG - FFJ: AEP/i)).toBeInTheDocument();

    expect(screen.getByText("Programación")).toBeInTheDocument();
    expect(screen.getByText("Diseño")).toBeInTheDocument();
  });

  it("debe mostrar Registro/Acceso cuando getToken devuelve null", async () => {
    const api = (await import("../../utils/api")).default as any;
    api.get.mockResolvedValue({ data: { _embedded: { categorias: [] } } });

    const services = (await import("../../services")) as any;
    services.getToken.mockReturnValue(null);

    render(<HeaderComponent />);

    await waitFor(() => {
      expect(screen.getByText("Registro")).toBeInTheDocument();
      expect(screen.getByText("Acceso")).toBeInTheDocument();
    });
  });

  it("debe ejecutar logout y navegar a / al clicar desconectar", async () => {
    const api = (await import("../../utils/api")).default as any;
    api.get.mockResolvedValue({ data: { _embedded: { categorias: [] } } });

    const services = (await import("../../services")) as any;
    services.getToken.mockReturnValue("token");

    render(<HeaderComponent />);

    await waitFor(() => {
      expect(screen.getByText(/Privado/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("desconectar"));

    expect(services.removeToken).toHaveBeenCalledTimes(1);
    expect(services.removeUser).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("debe hacer warn y dejar categorías vacías si la respuesta no trae un array", async () => {
    const api = (await import("../../utils/api")).default as any;
    api.get.mockResolvedValue({ data: { _embedded: { categorias: null } } });

    const services = (await import("../../services")) as any;
    services.getToken.mockReturnValue(null);

    const { logger } = (await import("../../utils/logger")) as any;

    render(<HeaderComponent />);

    await waitFor(() => {
      expect(screen.getByText(/Home/i)).toBeInTheDocument();
    });

    expect(logger.warn).toHaveBeenCalled();
  });

  it("debe manejar error 404 mostrando mensaje de no se encontraron categorías", async () => {
    const api = (await import("../../utils/api")).default as any;
    api.get.mockRejectedValue({
      message: "not found",
      response: {
        status: 404,
        data: {},
      },
    });

    const services = (await import("../../services")) as any;
    services.getToken.mockReturnValue(null);

    const { logger } = (await import("../../utils/logger")) as any;

    render(<HeaderComponent />);

    await waitFor(() => {
      expect(screen.getByText(/Home/i)).toBeInTheDocument();
    });

    expect(logger.error).toHaveBeenCalledWith("No se encontraron categorías");
  });
});
