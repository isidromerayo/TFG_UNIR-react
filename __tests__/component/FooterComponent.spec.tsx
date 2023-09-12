import FooterComponent from "../../components/FooterComponent";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

describe('Footer Component', () => {  
    it("renders a footer", () => {
        render(<FooterComponent />);
        expect(screen.getByText(/TFG/i)).toBeInTheDocument();
    })
})